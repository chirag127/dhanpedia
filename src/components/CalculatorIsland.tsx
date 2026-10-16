/**
 * CalculatorIsland — a single React island that renders one calculator from
 * the client-safe catalogue. It handles input validation, reset, and the
 * ECharts visualisation when present.
 *
 * Mounted from the per-calculator page (src/pages/calculators/[id].astro).
 */
import { useMemo, useState, useEffect, useRef } from 'react';
import type { CalcDef } from '@lib/calculators';
import { getCalc } from '@lib/calculators';
import { formatINR, formatINR2, formatNumber } from '@lib/format';
import { init, use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

type Vals = Record<string, number | string>;

function fmt(v: number | string, kind: string): string {
  if (typeof v === 'string') return v;
  switch (kind) {
    case 'inr': return formatINR(v);
    case 'inr2': return formatINR2(v);
    case 'pct': return `${(v * 100).toFixed(2)}%`;
    case 'number': return formatNumber(v);
    default: return String(v);
  }
}

export default function CalculatorIsland({ calcId }: { calcId: string }) {
  const def = useMemo(() => getCalc(calcId), [calcId]);
  const [vals, setVals] = useState<Vals>(() =>
    def ? Object.fromEntries(def.inputs.map((i) => [i.key, i.type === 'textarea' ? i.default : Number(i.default)])) : {}
  );
  const [chartEl, setChartEl] = useState<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof init> | null>(null);

  const out = def ? def.compute(vals) : null;

  // (Re)render the chart whenever the definition or computed option changes.
  useEffect(() => {
    if (!chartEl || !out?.chart) return;
    if (!chartRef.current) {
      chartRef.current = init(chartEl, null, { renderer: 'canvas' });
    }
    const apply = () => {
      if (!chartRef.current) return;
      const isDark = document.documentElement.classList.contains('dark');
      const theme = isDark
        ? { textStyle: { color: '#e7e4da' }, backgroundColor: 'transparent' }
        : { textStyle: { color: '#14231d' }, backgroundColor: 'transparent' };
      chartRef.current.setOption({ ...theme, ...out!.chart.option }, { notMerge: true });
    };
    apply();
    const ro = new ResizeObserver(() => chartRef.current?.resize());
    ro.observe(chartEl);
    window.addEventListener('themechange', apply);
    return () => { ro.disconnect(); window.removeEventListener('themechange', apply); };
  }, [out?.chart, chartEl]);

  useEffect(() => () => { chartRef.current?.dispose(); }, []);

  if (!def) return <p>Calculator not found.</p>;

  const set = (k: string, raw: string) => {
    setVals((prev) => ({ ...prev, [k]: raw === '' ? 0 : Number(raw) }));
  };
  const reset = () => setVals(Object.fromEntries(def.inputs.map((i) => [i.key, i.type === 'textarea' ? i.default : Number(i.default)])));

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: '1.25rem', background: 'var(--surface)' }}>
      <h3 style={{ margin: '0 0 .3rem', fontSize: '1.2rem' }}>{def.title}</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', margin: '0 0 1rem' }}>{def.description}</p>

      <div style={{ display: 'grid', gap: '.8rem' }}>
        {def.inputs.map((inp) => (
          <label key={inp.key} style={{ display: 'block', fontSize: '.85rem', color: 'var(--ink-soft)' }}>
            <span style={{ display: 'block', fontWeight: 600, color: 'var(--ink)', marginBottom: '.3rem' }}>
              {inp.label}{inp.unit ? <span style={{ fontWeight: 400 }}>: {inp.unit}</span> : ''}
            </span>
            {inp.type === 'textarea' ? (
              <textarea
                value={String(vals[inp.key])}
                onChange={(e) => set(inp.key, e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: '.9rem' }}
              />
            ) : inp.options ? (
              <select
                value={String(vals[inp.key])}
                onChange={(e) => set(inp.key, e.target.value)}
                style={{ padding: '.5rem .7rem', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '.9rem' }}
              >
                {inp.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                type="number"
                value={String(vals[inp.key] ?? '')}
                onChange={(e) => set(inp.key, e.target.value)}
                min={inp.min} max={inp.max} step={inp.step ?? 1}
                style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '.9rem' }}
              />
            )}
            {inp.hint && <span style={{ display: 'block', fontSize: '.75rem', color: 'var(--ink-soft)', marginTop: '.25rem' }}>{inp.hint}</span>}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '.6rem', margin: '1rem 0' }}>
        <button type="button" onClick={reset}
          style={{ border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)', borderRadius: 8, padding: '.4rem .9rem', cursor: 'pointer', fontSize: '.85rem' }}>
          Reset to defaults
        </button>
      </div>

      {out && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '.7rem', margin: '1rem 0' }}>
          {out.results.map((r, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '.8rem' }}>
              <div style={{ fontSize: '.75rem', color: 'var(--ink-soft)' }}>{r.label}</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>{fmt(r.value, r.kind)}</div>
              {r.note && <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)', marginTop: '.2rem' }}>{r.note}</div>}
            </div>
          ))}
        </div>
      )}

      {out?.chart ? (
        <>
          <div ref={setChartEl} style={{ width: '100%', height: 340 }} role="img" aria-label={out.chart.alt} />
          <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', marginTop: '.4rem' }}><em>Chart: {out.chart.title}</em> — {out.chart.alt}</div>
        </>
      ) : null}

      <details style={{ marginTop: '1.2rem', fontSize: '.85rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Assumptions & limitations</summary>
        <ul style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {def.assumptions.map((a, i) => <li key={i}>{a}</li>)}
          {def.limitations.map((l, i) => <li key={i}>⚠ {l}</li>)}
        </ul>
      </details>
    </div>
  );
}
