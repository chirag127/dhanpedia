import fs from 'node:fs';

const p = 'tests/unit/finance.test.ts';
let s = fs.readFileSync(p, 'utf8');

// 1) Add dtaaReliefFY27 to the import from '@lib/finance/index'.
if (!s.includes('dtaaReliefFY27')) {
  s = s.replace(
    /import \{([\s\S]*?)\} from '@lib\/finance\/index';/,
    (m, body) => {
      let nb = body.replace(/\s*\}\s*$/, '').trimEnd();
      if (!nb.endsWith(',')) nb += ',';
      nb += '\n  dtaaReliefFY27';
      return `import { ${nb} } from '@lib/finance/index';`;
    },
  );
}

const block = `

describe('dtaaReliefFY27', () => {
  const base = (o: Record<string, unknown> = {}) => ({
    income: 1000000,
    domesticRate: 0.3,
    treatyRate: 0.15,
    surchargePct: 0,
    cessPct: 0.04,
    residenceTax: 0,
    ...o,
  });

  it('treaty route halves the pre-cess withholding vs 30% domestic', () => {
    const r = dtaaReliefFY27(base());
    expect(r.domesticWithholding).toBe(300000);
    expect(r.treatyWithholding).toBe(150000);
    expect(r.tdsSaved).toBe(150000);
  });

  it('applies surcharge + 4% cess to both routes for the all-in figure', () => {
    const r = dtaaReliefFY27(base({ surchargePct: 0.1 }));
    expect(r.domesticAllIn).toBeCloseTo(300000 * 1.1 * 1.04, 0);
    expect(r.treatyAllIn).toBeCloseTo(150000 * 1.1 * 1.04, 0);
    expect(r.savingAllIn).toBeCloseTo(r.domesticAllIn - r.treatyAllIn, 0);
  });

  it('effective rate reflects the cess+surcharge multiplier', () => {
    const r = dtaaReliefFY27(base({ surchargePct: 0 }));
    expect(r.effectiveRateDomestic).toBeCloseTo(0.3 * 1.04, 6);
    expect(r.effectiveRateTreaty).toBeCloseTo(0.15 * 1.04, 6);
  });

  it('exemption-method corridor (residenceTax 0) shows India as the only tax', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 0 }));
    expect(r.creditMethod).toBe(false);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(r.treatyAllIn, 0);
    expect(r.netAdditionalTax).toBe(0);
  });

  it('credit-method corridor caps the s.91 credit at the lesser of India-paid and home-tax', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 120000 }));
    expect(r.creditMethod).toBe(true);
    expect(r.foreignTaxCredit).toBe(120000);
    expect(r.netAdditionalTax).toBe(0);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(r.treatyAllIn, 0);
  });

  it('when home tax exceeds the India-side, the net extra is the difference', () => {
    const r = dtaaReliefFY27(base({ residenceTax: 400000 }));
    const cap = r.treatyAllIn;
    expect(r.foreignTaxCredit).toBeCloseTo(cap, 0);
    expect(r.netAdditionalTax).toBeCloseTo(400000 - cap, 0);
    expect(r.totalTaxBurdenTreatyRoute).toBeCloseTo(400000, 0);
  });

  it('clamps rates to 0-1 and floors savings at zero when treaty >= domestic', () => {
    const r = dtaaReliefFY27(base({ domesticRate: 0.2, treatyRate: 0.35 }));
    expect(r.tdsSaved).toBe(0);
    expect(r.savingAllIn).toBe(0);
  });
});
`;

s = s.trimEnd() + '\n' + block;
fs.writeFileSync(p, s);
console.log('finance.test.ts updated. dtaaReliefFY27 present:', s.includes('dtaaReliefFY27'));
console.log('describe blocks now:', (s.match(/describe\(/g) || []).length);
