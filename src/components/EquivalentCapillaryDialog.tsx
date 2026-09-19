import React, { useState } from 'react';
import { AppSettings, CalculationResult } from '../types';
import capilarizacionImg from '../assets/capilarizacion.png';

interface EquivalentCapillaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  settings: AppSettings;
}

export const EquivalentCapillaryDialog: React.FC<EquivalentCapillaryDialogProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  // Reference baseline from current calculation result:
  const optimalRec = result.recommendations.find((r) => r.isOptimal) || result.recommendations[0];

  // Workshop custom diameter state: initialize with optimal diameter if available, or 0.80 mm
  const [customDiameterMm, setCustomDiameterMm] = useState<number>(() => {
    return optimalRec ? optimalRec.nominalDiameterMm : 0.80;
  });
  const [parallelTubes, setParallelTubes] = useState<number>(1); // 1 or 2 tubes
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const dRefMm = optimalRec ? optimalRec.nominalDiameterMm : 0.80;
  const lRefInches = optimalRec ? optimalRec.calculatedLengthIn : 64.5;

  // Equivalent tube calculation: L = L_ref * (D / D_ref)^4.65 * (1 / parallelTubes)^1.82
  const calculatedLengthIn = parallelTubes === 1
    ? lRefInches * Math.pow(customDiameterMm / dRefMm, 4.65)
    : (lRefInches * Math.pow(customDiameterMm / dRefMm, 4.65)) * Math.pow(1 / 2, 1.82);

  // S.I. Primary: Meters (m)
  const calculatedLengthM = calculatedLengthIn * 0.0254;
  const calculatedLengthCm = calculatedLengthM * 100;

  // Status Badge in S.I. (m)
  let statusBadge = {
    color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    icon: 'verified',
    title: 'Rango Aconsejado (1,50 m a 4,00 m)',
    desc: 'Esta combinación garantiza amortiguación acústica suave, excelente rendimiento termodinámico y mínimo riesgo de obstrucción.',
  };

  if (calculatedLengthM < 1.5) {
    statusBadge = {
      color: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
      icon: 'warning',
      title: 'Longitud Insuficiente (< 1,50 m)',
      desc: 'Peligro de siseo y ruido acústico, expansión demasiado violenta, escaso intercambio térmico con la succión y riesgo de retorno de líquido al compresor. Se recomienda elegir un diámetro menor.',
    };
  } else if (calculatedLengthM > 4.0) {
    statusBadge = {
      color: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
      icon: 'error',
      title: 'Longitud Excesiva (> 4,00 m)',
      desc: 'Peligro de pérdida de carga excesiva o taponamiento por ceras del aceite o impurezas. Se aconseja elegir un diámetro mayor o utilizar 2 capilares en paralelo.',
    };
  } else if (calculatedLengthM >= 2.0 && calculatedLengthM <= 3.0) {
    statusBadge = {
      color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium',
      icon: 'star',
      title: 'Zona Dorada de Taller (2,00 m a 3,00 m)',
      desc: 'Estándar de excelencia para taller frigorífico. Perfecta atenuación de pulsaciones, longitud ideal para soldar y óptimo intercambio térmico regenerativo.',
    };
  }

  // Predefined workshop common diameters in Spain (S.I. mm)
  const commonWorkshopDiameters = [
    { mm: 0.60, label: '0,60 mm - Doméstico estándar' },
    { mm: 0.70, label: '0,70 mm - Doméstico LBP' },
    { mm: 0.80, label: '0,80 mm - Muy común en taller' },
    { mm: 0.90, label: '0,90 mm - Enfriador / MBP' },
    { mm: 1.00, label: '1,00 mm - Comercial estándar' },
    { mm: 1.20, label: '1,20 mm - Comercial HBP' },
    { mm: 1.25, label: '1,25 mm - Hostelería / Clima' },
    { mm: 1.40, label: '1,40 mm - Gran Capacidad' },
    { mm: 1.50, label: '1,50 mm - Máxima sección' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      {/* Modern Dialog Window */}
      <div className="w-full max-w-[860px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[12px] text-[var(--text-primary)] overflow-hidden my-auto flex flex-col transition-colors">
        
        {/* Title Bar */}
        <div className="h-[42px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-3.5 text-[var(--text-primary)] font-condensed font-bold text-[14px] shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[19px] text-[var(--accent-base)]">science</span>
            <span>Banco de Pruebas de Nitrógeno y Capilar Equivalente</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center text-[15px] transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Interior Content (Sized to fit standard viewport without scroll) */}
        <div className="p-3 space-y-2.5 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {/* Top Master Parameter Banner */}
          <div className="bg-[var(--bg-alt)]/60 border border-[var(--border-subtle)] rounded-[8px] py-1.5 px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="font-condensed font-bold text-[13px] text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-base)]"></span>
                <span>Parámetro Maestro: Caudal de Nitrógeno (Flow Rate)</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Prueba en banco con Nitrógeno seco a presión diferencial regulada de <strong>10,0 bar (1,0 MPa)</strong>.
              </div>
            </div>
            <div className="py-1 px-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-right shrink-0 shadow-xs">
              <div className="text-[9.5px] font-condensed uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Caudal Nominal Calculado (S.I.)
              </div>
              <div className="text-[15px] font-code font-bold text-[var(--accent-base)] leading-tight">
                {result.flowRateLMin.toFixed(2)} l/min N₂
              </div>
              <div className="text-[9.5px] font-code text-[var(--text-muted)]">
                (Δp = 10 bar / {result.flowRateCFM.toFixed(2)} CFM)
              </div>
            </div>
          </div>

          {/* Dual Panel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
            {/* Left: Nitrogen Bench & Capillarization Schematic (5/12) */}
            <div className="md:col-span-5 bg-[var(--bg-alt)]/40 border border-[var(--border-default)] rounded-[8px] p-2.5 flex flex-col justify-between gap-2 shadow-xs">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1">
                  <div className="font-condensed font-bold text-[12px] text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[15px] text-[var(--accent-base)]">compress</span>
                    <span>Banco de Prueba y Capilarización</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                  Presión diferencial regulada: <strong>10,0 bar (1,0 MPa)</strong>
                </div>
              </div>

              {/* Capillarization Image with Modern Frame & Zoom */}
              <div className="flex flex-col justify-center my-0.5">
                <div
                  onClick={() => setIsZoomOpen(true)}
                  className="group relative bg-white dark:bg-slate-900 rounded-[6px] border border-[var(--border-default)] p-1.5 cursor-pointer shadow-xs hover:border-[var(--accent-base)] transition-all flex items-center justify-center overflow-hidden"
                  title="Hacer clic para ampliar el esquema de capilarización"
                >
                  <img
                    src={capilarizacionImg}
                    alt="Esquema técnico de capilarización y banco de prueba con nitrógeno"
                    className="w-full h-auto max-h-[120px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-xs text-white text-[9.5px] font-sans px-2 py-0.5 rounded-[4px] shadow flex items-center gap-1 border border-white/20 group-hover:bg-[var(--accent-base)] group-hover:text-[var(--accent-text)] transition-colors">
                    <span className="material-symbols-rounded text-[12px]">zoom_in</span>
                    <span className="font-semibold">Ampliar</span>
                  </div>
                </div>
                <div className="text-center text-[9.5px] text-[var(--text-muted)] mt-1">
                  Cilindro N₂ • Manómetro 10 bar • Tubo capilar • Caudalímetro
                </div>
              </div>

              {/* Digital Readout Box - S.I. Primary */}
              <div className="bg-[#0f172a] dark:bg-[#020617] border border-slate-700/70 rounded-[6px] py-1.5 px-2.5 text-center shadow-inner">
                <div className="text-[9.5px] font-condensed uppercase tracking-wider font-bold text-slate-300">
                  Lectura del Caudalímetro en Banco (S.I.)
                </div>
                <div className="text-[20px] font-code font-bold text-emerald-400 tracking-tight leading-none my-1">
                  {result.flowRateLMin.toFixed(2)} l/min
                </div>
                <div className="text-[10px] text-slate-400 font-code">
                  N₂ seco a Δp 10 bar ({result.flowRateCFM.toFixed(2)} CFM)
                </div>
                <div className="text-[9px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                  Ajustar longitud hasta medir exactamente este caudal a 10 bar
                </div>
              </div>

              {/* Video Tutorial Banner: Único enlace al vídeo */}
              <a
                href="https://www.youtube.com/watch?v=zvLUBG25TdI"
                target="_blank"
                rel="noopener noreferrer"
                className="group py-1.5 px-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] hover:border-red-500/50 rounded-[6px] transition-all shadow-xs flex items-center justify-between gap-2 text-inherit no-underline cursor-pointer"
                title="Ver vídeo en YouTube: Cómo realizar una capilarización paso a paso"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-[10px] group-hover:scale-105 transition-transform">
                    ▶
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[10.5px] text-[var(--text-primary)] truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Vídeo: Cómo realizar una capilarización
                    </div>
                    <div className="text-[9px] text-[var(--text-muted)] truncate">
                      Explicación práctica del proceso en banco
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold text-red-600 dark:text-red-400 shrink-0">
                  <span>Ver vídeo</span>
                  <span className="material-symbols-rounded text-[13px]">open_in_new</span>
                </div>
              </a>
            </div>

            {/* Right: Workshop Equivalent Calculator (7/12) */}
            <div className="md:col-span-7 bg-[var(--bg-alt)]/40 border border-[var(--border-default)] rounded-[8px] p-2.5 flex flex-col justify-between gap-2 shadow-xs">
              <div className="space-y-2">
                <div className="border-b border-[var(--border-subtle)] pb-1.5">
                  <div className="font-condensed font-bold text-[13px] text-[var(--text-primary)] flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] text-[var(--accent-base)]">calculate</span>
                    <span>Calculadora de Sustitución en Taller</span>
                  </div>
                  <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5 leading-snug">
                    ¿No dispones en stock del diámetro óptimo? Selecciona el calibre disponible y obtén la longitud exacta equivalente en el Sistema Internacional (S.I.):
                  </p>
                </div>

                {/* Common Presets (S.I. mm) */}
                <div>
                  <label htmlFor="select-workshop-diam" className="block text-[10.5px] font-semibold text-[var(--text-primary)] mb-0.5">
                    Diámetro disponible en taller (mm):
                  </label>
                  <select
                    id="select-workshop-diam"
                    value={customDiameterMm}
                    onChange={(e) => setCustomDiameterMm(Number(e.target.value))}
                    className="w-full h-[30px] px-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[11.5px] font-inter text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] shadow-xs cursor-pointer"
                  >
                    {commonWorkshopDiameters.map((d) => (
                      <option key={d.mm} value={d.mm}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manual precise adjustment & Parallel options */}
                <div className="grid grid-cols-2 gap-2 bg-[var(--bg-surface)] p-2 rounded-[6px] border border-[var(--border-subtle)]">
                  <div>
                    <label htmlFor="custom-mm-input" className="text-[10.5px] font-semibold text-[var(--text-muted)] block">
                      Ajuste milimétrico exacto:
                    </label>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        id="custom-mm-input"
                        type="number"
                        step="0.01"
                        min="0.4"
                        max="2.5"
                        value={customDiameterMm}
                        onChange={(e) => setCustomDiameterMm(Math.max(0.3, Number(e.target.value)))}
                        className="w-16 h-[26px] px-1.5 bg-[var(--bg-alt)]/30 border border-[var(--border-default)] rounded-[4px] text-right font-code text-[11.5px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)]"
                      />
                      <span className="text-[10.5px] font-semibold text-[var(--text-primary)]">mm</span>
                    </div>
                  </div>

                  <div className="border-l border-[var(--border-subtle)] pl-2">
                    <label htmlFor="parallel-select" className="text-[10.5px] font-semibold text-[var(--text-muted)] block">
                      Configuración de montaje:
                    </label>
                    <select
                      id="parallel-select"
                      value={parallelTubes}
                      onChange={(e) => setParallelTubes(Number(e.target.value))}
                      className="w-full h-[26px] px-1.5 bg-[var(--bg-alt)]/30 border border-[var(--border-default)] rounded-[4px] text-[10.5px] text-[var(--text-primary)] mt-0.5 focus:outline-none focus:border-[var(--accent-base)] cursor-pointer"
                    >
                      <option value={1}>1 Capilar simple</option>
                      <option value={2}>2 Capilares en paralelo</option>
                    </select>
                  </div>
                </div>

                {/* Result Box (S.I. Primary) */}
                <div className="p-2 bg-[var(--bg-surface)] border-2 border-[var(--accent-base)]/40 rounded-[6px] shadow-xs">
                  <div className="text-[10px] font-condensed font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Longitud requerida para este diámetro (S.I.):
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[22px] font-code font-bold text-[var(--accent-base)] leading-none">
                      {calculatedLengthM.toFixed(2)} m
                    </span>
                    <span className="text-[11px] font-code text-[var(--text-muted)]">
                      ({calculatedLengthCm.toFixed(0)} cm / {(calculatedLengthM * 1000).toFixed(0)} mm)
                    </span>
                  </div>
                  {parallelTubes === 2 && (
                    <div className="text-[9.5px] text-[var(--accent-base)] mt-1 font-medium">
                      * Montaje en paralelo: Cada uno de los 2 capilares debe cortarse exactamente a {calculatedLengthM.toFixed(2)} m.
                    </div>
                  )}
                </div>

                {/* Practical Status Badge (S.I.) */}
                <div className={`p-2 border rounded-[6px] flex items-start gap-1.5 ${statusBadge.color}`}>
                  <span className="material-symbols-rounded text-[15px] shrink-0 mt-0.5">
                    {statusBadge.icon}
                  </span>
                  <div>
                    <div className="font-bold text-[10.5px] font-condensed tracking-wide">
                      {statusBadge.title}
                    </div>
                    <div className="text-[9.5px] mt-0.5 leading-snug">
                      {statusBadge.desc}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] text-[var(--text-muted)] italic font-mono pt-0.5">
                Fórmula de equivalencia: L₂ = L₁ × (D₂ / D₁)⁴·⁶⁵ manteniendo caudal N₂ constante.
              </div>
            </div>
          </div>

          {/* Action Footer (Clean, no redundant video link) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[10.5px] text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[15px] text-emerald-500">verified</span>
              <span>Comprobación técnica recomendada en banco antes de soldar en el circuito.</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[12px] shadow-xs cursor-pointer transition-colors shrink-0"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {/* High-Resolution Zoom Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="w-full max-w-[940px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] overflow-hidden font-inter text-[var(--text-primary)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px] select-none">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-[18px] text-[var(--accent-base)]">zoom_in</span>
                <span>Esquema Técnico de Capilarización y Banco de Pruebas de Nitrógeno</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-7 h-7 rounded-[6px] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center text-[16px] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 bg-[var(--bg-alt)]/30 space-y-3">
              <div className="bg-white dark:bg-slate-900 p-2.5 border border-[var(--border-default)] rounded-[8px] shadow-xs flex items-center justify-center">
                <img
                  src={capilarizacionImg}
                  alt="Esquema técnico de capilarización y banco de prueba con nitrógeno"
                  className="w-full h-auto max-h-[75vh] object-contain select-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] px-1">
                <span>Diagrama de conexiones y calibración con nitrógeno a 10,0 bar (1,0 MPa) de presión diferencial.</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.youtube.com/watch?v=zvLUBG25TdI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-[6px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>▶ Ver vídeo explicativo</span>
                    <span className="material-symbols-rounded text-[14px]">open_in_new</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    className="px-4 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
