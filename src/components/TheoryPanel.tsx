import React from 'react';

interface TheoryPanelProps {
  onOpenTestBench?: () => void;
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ onOpenTestBench }) => {
  return (
    <div className="flex flex-col font-inter text-[12px] space-y-3 select-none text-[var(--text-primary)]">
      {/* Reference Links & Resources Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Video Tutorial Card */}
        <div className="p-3 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[14px]">
            ▶
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[12px] text-[var(--text-primary)] line-clamp-1">
              Video Tutorial de Selección
            </div>
            <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mb-1.5">
              Criterios prácticos de taller y nitrógeno
            </div>
            <a
              href="https://www.youtube.com/watch?v=KyyYoXEuyTQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-base)] hover:underline"
            >
              <span>Ver en YouTube</span>
              <span className="material-symbols-rounded text-[12px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Compressor Data Sheet Card */}
        <div className="p-3 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[14px]">
            📄
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[12px] text-[var(--text-primary)] line-clamp-1">
              Ficha Técnica Compresor
            </div>
            <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mb-1.5">
              Curvas de capacidad modelo GS26TG
            </div>
            <a
              href="https://lightcommercialrefrigeration.danfoss.com/pdf/danfoss_GS26TG_T_R134a_200_50.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-base)] hover:underline"
            >
              <span>Descargar PDF</span>
              <span className="material-symbols-rounded text-[12px]">download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Practical Workshop Rules Section */}
      <div className="space-y-2.5">
        {/* Rule 1: Length bounds */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px]">
          <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            <span>Regla de Longitud: Límite 1.5 m a 4.0 m (Óptimo 2.0 m - 3.0 m)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-[4px]">
              <div className="font-bold text-red-500 mb-0.5">❌ Menor a 1.5 m:</div>
              <div className="text-[var(--text-secondary)]">
                Expansión violenta, siseo y riesgo de golpe de líquido al compresor por falta de intercambio térmico.
              </div>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-[4px]">
              <div className="font-bold text-emerald-500 mb-0.5">✅ 2.0 m a 3.0 m (Ideal):</div>
              <div className="text-[var(--text-secondary)]">
                Máxima estabilidad termodinámica, amortiguación de pulsaciones y flujo continuo sin turbulencias.
              </div>
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-[4px]">
              <div className="font-bold text-amber-500 mb-0.5">⚠️ Mayor a 4.0 m:</div>
              <div className="text-[var(--text-secondary)]">
                Riesgo de obstrucción por ceras de aceite lubricante, excesiva fricción y dificultad de montaje.
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2: Flow Rate with N2 */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px]">
          <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            <span>Caudal de Nitrógeno (Flow Rate): La Restricción Invariable</span>
          </div>
          <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed mb-2">
            El tubo capilar es una restricción fija por fricción. En fábrica y bancos de calibración se comprueba con <strong>Nitrógeno seco a Δp = 10,0 bar (1,0 MPa)</strong>.
          </p>
          <div className="p-2 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[4px] text-[11px] text-[var(--text-primary)] flex items-center justify-between gap-2">
            <span>Para mantener el mismo punto de trabajo al cambiar de diámetro, el <strong>Caudal en l/min (S.I.)</strong> debe conservarse invariable.</span>
            {onOpenTestBench && (
              <button
                type="button"
                onClick={onOpenTestBench}
                className="px-2.5 py-1 bg-[var(--accent-base)] text-[var(--accent-text)] rounded-[4px] font-semibold shrink-0 cursor-pointer hover:opacity-90"
              >
                Banco N₂ ↗
              </button>
            )}
          </div>
        </div>

        {/* Rule 3: Suction Line Heat Exchanger */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px]">
          <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
              3
            </span>
            <span>Intercambiador Succión - Capilar (Tramo 1.0 m a 1.5 m soldado)</span>
          </div>
          <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
            El método de dimensionamiento asume que el capilar va unido térmicamente en contracorriente a la línea de succión. Esto proporciona <strong>subenfriamiento</strong> al líquido entrante (evitando vapor antes de tiempo) y <strong>recalienta</strong> el vapor de retorno protegiendo al motocompresor.
          </p>
        </div>

        {/* Rule 4: Equivalence Formula */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px]">
          <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
              4
            </span>
            <span>Ley Exponencial de Equivalencia de Diámetros</span>
          </div>
          <div className="p-2 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[4px] font-code text-center font-bold text-[12px] text-[var(--accent-base)] my-1">
            L₂ = L₁ × (D₂ / D₁)⁴·⁶⁵
          </div>
          <p className="text-[var(--text-muted)] text-[10px] italic">
            *Un ligero incremento de diámetro requiere un aumento exponencial en longitud para preservar la misma pérdida de carga.
          </p>
        </div>

        {/* Section 5: Detailed Mathematical Equations for Flow and Capillary */}
        <div className="p-3 bg-[var(--bg-surface)] border-2 border-[var(--accent-base)]/30 rounded-[8px] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)]">
              <span className="material-symbols-rounded text-[18px] text-[var(--accent-base)]">functions</span>
              <span className="font-condensed uppercase tracking-tight text-[13px]">
                Ecuaciones Matemáticas Utilizadas en los Cálculos
              </span>
            </div>
            {onOpenTestBench && (
              <button
                type="button"
                onClick={onOpenTestBench}
                className="text-[11px] font-semibold text-[var(--accent-base)] hover:underline cursor-pointer"
              >
                Probar en Banco N₂ ↗
              </button>
            )}
          </div>

          <div className="space-y-2 text-[11px]">
            {/* Caudal equation */}
            <div className="p-2 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px]">
              <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-base)]" />
                <span>1. Caudal de Nitrógeno (V̇_N₂ a Δp = 10 bar / 145 psi):</span>
              </div>
              <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[11px] text-center text-[var(--accent-base)] my-1">
                V̇_N₂ (CFM) = ṁ_ref × k_N₂ × (p_cond / 13.5)⁰·²⁵
              </div>
              <div className="p-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[11px] text-center text-emerald-500 my-1">
                V̇_N₂ (l/min) = V̇_N₂ (CFM) × 28.31685
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] space-y-0.5 mt-1 leading-relaxed">
                <div>• <strong>Efecto refrigerante:</strong> Δh = [h_vap(T_evap) + c_p,v · (T_ret - T_evap)] - c_p,l · T_cond (kJ/kg).</div>
                <div>• <strong>Caudal másico:</strong> ṁ_ref = [Q̇ (W) / (1000 · Δh)] × 3600 (kg/h).</div>
                <div>• <strong>Presión de condensación:</strong> log₁₀(p_cond) = A - B / (T_cond + C) (Ecuación de Antoine).</div>
                <div>• <strong>k_N₂:</strong> Factor de conversión específico de cada refrigerante (0.155 en R134a, 0.285 en R600a, 0.145 en R404A).</div>
              </div>
            </div>

            {/* Capillary sizing equation */}
            <div className="p-2 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px]">
              <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-base)]" />
                <span>2. Longitud del Tubo Capilar (L):</span>
              </div>
              <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[11px] text-center text-[var(--accent-base)] my-1">
                L = L_ref × (D / D_ref)⁴·⁶⁵ × (V̇_ref / V̇_N₂)¹·⁸²
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Calibrado con punto de referencia: D_ref = 0.63 mm, L_ref = 64.5 in (1.638 m) a V̇_ref = 0.24 CFM de nitrógeno seco.
              </div>
            </div>

            {/* Parallel tubes equation */}
            <div className="p-2 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px]">
              <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-base)]" />
                <span>3. Montaje en Paralelo (2 Capilares):</span>
              </div>
              <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[11px] text-center text-[var(--accent-base)] my-1">
                L_paralelo = L_individual × (1 / 2)¹·⁸² = L_individual × 0.283
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Cada capilar se corta al 28.3% de la longitud requerida para un solo tubo para mantener la misma pérdida de carga global.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
