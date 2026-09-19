import React from 'react';
import { AppSettings, CalculationResult, InputValues } from '../types';
import { REFRIGERANTS } from '../thermo/refrigerants';

interface EquationsDialogProps {
  isOpen: boolean;
  inputs: InputValues;
  settings: AppSettings;
  result: CalculationResult;
  onClose: () => void;
}

export const EquationsDialog: React.FC<EquationsDialogProps> = ({
  isOpen,
  inputs,
  settings,
  result,
  onClose,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const refDef = REFRIGERANTS[inputs.refrigerant] || REFRIGERANTS.R134a;

  // Real-time calculation steps for display:
  const qWatts = settings.energy === 'W' ? inputs.heatLoad : inputs.heatLoad / 3.412142;
  const tEvapC = settings.temperature === '°C' ? inputs.evapTemp : (inputs.evapTemp - 32) / 1.8;
  const tCondC = settings.temperature === '°C' ? inputs.condTemp : (inputs.condTemp - 32) / 1.8;
  const tReturnC = settings.temperature === '°C' ? inputs.returnTemp : (inputs.returnTemp - 32) / 1.8;

  const h1 = refDef.h_vap_ref + refDef.cp_vapor * (tReturnC - tEvapC);
  const h4 = refDef.cp_liquid * tCondC;
  const deltaH = Math.max(10, h1 - h4);
  const massFlowKgS = (qWatts / 1000) / deltaH;
  const massFlowKgH = massFlowKgS * 3600;

  const denomCond = tCondC + refDef.antoine.C;
  const pCondBar = denomCond !== 0 ? Math.max(0.01, Math.pow(10, refDef.antoine.A - refDef.antoine.B / denomCond)) : 1;
  const pressureCorrection = Math.pow(Math.max(0.01, pCondBar) / 13.5, 0.25);

  const flowRateCFM = result.flowRateCFM;
  const flowRateLMin = result.flowRateLMin;

  const optimalRec = result.recommendations.find((r) => r.isOptimal) || result.recommendations[0];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[760px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[12px] text-[var(--text-primary)] my-4 overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[20px] text-[var(--accent-base)]">functions</span>
            <span>Ecuaciones y Fórmulas Matemáticas de Cálculo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center text-[16px] transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Header intro */}
          <div className="bg-[var(--bg-alt)]/50 border border-[var(--border-subtle)] rounded-[8px] p-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
            El dimensionamiento termodinámico del tubo capilar y la comprobación de flujo en banco con nitrógeno seco a <strong>10,0 bar (145 psi)</strong> se rigen por principios de conservación de masa, balance entálpico de ciclo y la ley exponencial de flujo bifásico estrangulado.
          </div>

          {/* Section 1: Nitrogen Flow Rate Calculation (Formula de Caudal) */}
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="font-condensed uppercase tracking-tight text-[14px]">
                Ecuación de Caudal de Nitrógeno (V̇_N₂ a Δp = 10 bar)
              </span>
            </div>

            <p className="text-[var(--text-secondary)] text-[11px]">
              El caudal equivalente de nitrógeno traduce la potencia frigorífica y el salto entálpico del refrigerante a la resistencia neumática fija que debe medir el rotámetro en taller:
            </p>

            {/* Formula Block 1: Enthalpy & Mass Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] space-y-1">
                <div className="text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)]">
                  A) Efecto Refrigerante Neto (Δh)
                </div>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[12px] text-center text-[var(--accent-base)]">
                  Δh = h₁ - h₄ = [h_vap + c_p,v · (T_ret - T_evap)] - c_p,l · T_cond
                </div>
                <div className="text-[10px] font-code text-[var(--text-secondary)] pt-1">
                  Valores actuales ({inputs.refrigerant}):<br />
                  h₁ = {h1.toFixed(1)} kJ/kg, h₄ = {h4.toFixed(1)} kJ/kg<br />
                  <strong>Δh = {deltaH.toFixed(1)} kJ/kg</strong>
                </div>
              </div>

              <div className="p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] space-y-1">
                <div className="text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)]">
                  B) Caudal Másico de Refrigerante (ṁ_ref)
                </div>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[12px] text-center text-[var(--accent-base)]">
                  ṁ_ref (kg/h) = [Q̇ (W) / (1000 · Δh)] × 3600
                </div>
                <div className="text-[10px] font-code text-[var(--text-secondary)] pt-1">
                  Carga térmica Q̇ = {qWatts.toFixed(0)} W<br />
                  ṁ_ref = ({qWatts.toFixed(0)} / {deltaH.toFixed(1)}) · 3.6<br />
                  <strong>ṁ_ref = {massFlowKgH.toFixed(2)} kg/h</strong>
                </div>
              </div>
            </div>

            {/* Formula Block 2: Nitrogen Flow Formula */}
            <div className="p-3 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] space-y-2">
              <div className="text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)]">
                C) Caudal Volumétrico de Nitrógeno en Banco (10 bar / 145 psi)
              </div>
              <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[13px] text-center text-[var(--accent-base)]">
                V̇_N₂ (CFM) = ṁ_ref × k_N₂ × (p_cond / 13.5)⁰·²⁵
              </div>
              <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[13px] text-center text-emerald-500">
                V̇_N₂ (l/min) = V̇_N₂ (CFM) × 28.31685
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-code pt-1 border-t border-[var(--border-subtle)]">
                <div>
                  <span className="text-[var(--text-muted)]">Factor gas (k_N₂):</span><br />
                  <strong>{refDef.n2ConversionFactor.toFixed(3)}</strong> ({inputs.refrigerant})
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Presión cond (Antoine):</span><br />
                  <strong>{pCondBar.toFixed(2)} bar</strong> (factor corr: {pressureCorrection.toFixed(3)})
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Resultado en Taller (S.I.):</span><br />
                  <strong className="text-emerald-500 text-[12px]">{flowRateLMin.toFixed(2)} l/min</strong> ({flowRateCFM.toFixed(2)} CFM)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Capillary Sizing Formula */}
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span className="font-condensed uppercase tracking-tight text-[14px]">
                Ecuación de Longitud del Tubo Capilar (L)
              </span>
            </div>

            <p className="text-[var(--text-secondary)] text-[11px]">
              La ley de rozamiento y caída de presión bifásica (Darcy-Weisbach adaptada a flujo compresible estrangulado con choque) relaciona la longitud requerida con el diámetro interior y el caudal:
            </p>

            <div className="p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] space-y-2">
              <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[14px] text-center text-[var(--accent-base)]">
                L = L_ref × (D / D_ref)⁴·⁶⁵ × (V̇_ref / V̇_N₂)¹·⁸²
              </div>

              <div className="text-[11px] text-[var(--text-secondary)] space-y-1">
                <div>• <strong>D_ref = 0.63 mm</strong> y <strong>L_ref = 64.5 pulgadas (1.638 m)</strong> calibrados a <strong>V̇_ref = 0.24 CFM</strong>.</div>
                <div>• <strong>Exponente 4.65:</strong> Sensibilidad geométrica del diámetro. Una mínima variación en el orificio interno altera exponencialmente la restricción al paso de líquido y vapor.</div>
                <div>• <strong>Exponente 1.82:</strong> Exponente clásico de flujo turbulento de fluidos compresibles a través de conductos estrechos.</div>
              </div>

              {optimalRec && (
                <div className="mt-2 p-2 bg-[var(--bg-surface)] border border-emerald-500/30 rounded text-[11px] font-code flex items-center justify-between">
                  <span>Ejemplo para Ø {optimalRec.nominalDiameterMm.toFixed(2)} mm:</span>
                  <strong className="text-emerald-500">{optimalRec.calculatedLengthM.toFixed(2)} m ({optimalRec.lengthFormatted})</strong>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Equivalent Tube & Parallel Mounting */}
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] space-y-3">
            <div className="flex items-center gap-2 font-bold text-[13px] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span className="font-condensed uppercase tracking-tight text-[14px]">
                Fórmulas de Tubo Equivalente y Montaje en Paralelo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px]">
                <div className="text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] mb-1">
                  Sustitución Directa (1 Capilar)
                </div>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[12px] text-center text-[var(--accent-base)]">
                  L₂ = L₁ × (D₂ / D₁)⁴·⁶⁵
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  Permite sustituir un capilar original por otro diámetro comercial manteniendo exactamente la misma caída de presión.
                </div>
              </div>

              <div className="p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px]">
                <div className="text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] mb-1">
                  Montaje en Paralelo (2 Capilares)
                </div>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code font-bold text-[12px] text-center text-[var(--accent-base)]">
                  L_paralelo = L_individual × (1 / 2)¹·⁸²
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  Al dividir el flujo en dos ramales idénticos, cada capilar se corta al <strong>28.3%</strong> de la longitud que requeriría uno solo.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-[var(--bg-alt)] border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[var(--text-muted)] italic">
            Formulación termodinámica con unidades primarias en el Sistema Internacional (S.I.)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[12px] cursor-pointer transition-colors shadow-xs"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
