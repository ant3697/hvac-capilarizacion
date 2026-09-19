import React, { useState } from 'react';
import { CalculationResult } from '../types';
import capilarizacionImg from '../assets/capilarizacion.png';

interface BancoN2PanelProps {
  result: CalculationResult;
  onGoToRecommendations?: () => void;
}

export const BancoN2Panel: React.FC<BancoN2PanelProps> = ({ result, onGoToRecommendations }) => {
  // Reference baseline from current calculation result:
  const optimalRec = result.recommendations.find((r) => r.isOptimal) || result.recommendations[0];

  // Workshop custom diameter state: initialize with optimal diameter if available, or 0.80 mm
  const [customDiameterMm, setCustomDiameterMm] = useState<number>(() => {
    return optimalRec ? optimalRec.nominalDiameterMm : 0.80;
  });
  const [parallelTubes, setParallelTubes] = useState<number>(1); // 1 or 2 tubes
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (isZoomOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsZoomOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isZoomOpen]);

  const dRefMm = optimalRec ? optimalRec.nominalDiameterMm : 0.80;
  const lRefInches = optimalRec ? optimalRec.calculatedLengthIn : 64.5;

  // Equivalent tube calculation: L = L_ref * (D / D_ref)^4.65 * (1 / parallelTubes)^1.82
  const validDiameter = Number.isFinite(customDiameterMm) && customDiameterMm > 0 ? customDiameterMm : dRefMm;
  const calculatedLengthIn = parallelTubes === 1
    ? lRefInches * Math.pow(validDiameter / dRefMm, 4.65)
    : (lRefInches * Math.pow(validDiameter / dRefMm, 4.65)) * Math.pow(1 / 2, 1.82);

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
      desc: 'Peligro de siseo y ruido acústico, escaso intercambio térmico con la succión y riesgo de retorno de líquido. Se recomienda elegir un diámetro menor.',
    };
  } else if (calculatedLengthM > 4.0) {
    statusBadge = {
      color: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
      icon: 'error',
      title: 'Longitud Excesiva (> 4,00 m)',
      desc: 'Peligro de taponamiento por impurezas o ceras de aceite. Se aconseja elegir un diámetro mayor o utilizar 2 capilares en paralelo.',
    };
  } else if (calculatedLengthM >= 2.0 && calculatedLengthM <= 3.0) {
    statusBadge = {
      color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium',
      icon: 'star',
      title: 'Zona Dorada de Taller (2,00 m a 3,00 m)',
      desc: 'Estándar de excelencia para taller frigorífico. Perfecta atenuación de pulsaciones, longitud ideal para soldar y óptimo intercambio regenerativo.',
    };
  }

  // Predefined workshop common diameters in Spain (S.I. mm)
  const commonWorkshopDiameters = [
    { mm: 0.60, label: '0,60 mm - Doméstico estándar (1/10 a 1/8 CV)' },
    { mm: 0.70, label: '0,70 mm - Doméstico LBP / Congeladores (1/6 a 1/5 CV)' },
    { mm: 0.80, label: '0,80 mm - Muy común en taller (1/4 a 1/3 CV)' },
    { mm: 0.90, label: '0,90 mm - Enfriadores / Botelleros MBP' },
    { mm: 1.00, label: '1,00 mm - Comercial estándar (1/2 CV a 3/4 CV)' },
    { mm: 1.20, label: '1,20 mm - Comercial HBP / Vitrinas (3/4 a 1 CV)' },
    { mm: 1.25, label: '1,25 mm - Hostelería / Climatización' },
    { mm: 1.40, label: '1,40 mm - Gran Capacidad comercial' },
    { mm: 1.50, label: '1,50 mm - Máxima sección' },
  ];

  return (
    <div className="flex flex-col font-inter text-[12px] space-y-3.5 select-none text-[var(--text-primary)]">
      {/* 1. Header Maestro: Caudal de Nitrógeno */}
      <div className="p-3 bg-[var(--bg-alt)]/70 border border-[var(--border-subtle)] rounded-[8px] flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-base)]/15 border border-[var(--accent-base)]/30 flex items-center justify-center text-[var(--accent-base)] shrink-0">
            <span className="material-symbols-rounded text-[18px]">speed</span>
          </div>
          <div>
            <div className="font-condensed font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-wide">
              Caudal Maestro de Nitrógeno en Banco
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Presión diferencial regulada a <strong>10,0 bar (1,0 MPa)</strong>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 bg-[var(--bg-surface)] px-3 py-1.5 rounded-[6px] border border-[var(--border-default)] shadow-xs">
          <div className="text-[9.5px] font-condensed uppercase tracking-wider text-[var(--text-muted)] font-bold">
            Caudal Nominal S.I.
          </div>
          <div className="text-[17px] font-code font-bold text-emerald-500 leading-tight">
            {result.flowRateLMin.toFixed(2)} l/min
          </div>
          <div className="text-[9.5px] font-code text-[var(--text-muted)]">
            ({result.flowRateCFM.toFixed(2)} CFM equiv.)
          </div>
        </div>
      </div>

      {/* 2. Calculadora de Sustitución en Taller (Spacious & Clean) */}
      <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[17px] text-[var(--accent-base)]">calculate</span>
            <h3 className="font-condensed font-bold text-[13px] uppercase tracking-wide text-[var(--text-primary)]">
              Calculadora de Sustitución en Taller
            </h3>
          </div>
          <span className="text-[10.5px] text-[var(--text-muted)] font-mono hidden sm:inline">
            L₂ = L₁ × (D₂/D₁)⁴·⁶⁵
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          ¿No dispones en stock del diámetro óptimo? Selecciona el calibre disponible en tu taller y obtén la longitud exacta para conservar el mismo caudal y rendimiento frigorífico:
        </p>

        {/* Selector de Diámetro Comercial con ancho completo */}
        <div className="space-y-1">
          <label htmlFor="tab-select-workshop-diam" className="block text-[11px] font-semibold text-[var(--text-secondary)]">
            Diámetro disponible en taller (mm):
          </label>
          <select
            id="tab-select-workshop-diam"
            value={customDiameterMm}
            onChange={(e) => setCustomDiameterMm(Number(e.target.value))}
            className="w-full h-[34px] px-2.5 bg-[var(--bg-alt)] border border-[var(--border-default)] rounded-[6px] text-[12px] font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] shadow-xs cursor-pointer"
          >
            {commonWorkshopDiameters.map((d) => (
              <option key={d.mm} value={d.mm}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ajuste milimétrico y Configuración en 2 columnas amplias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[var(--bg-alt)]/40 p-2.5 rounded-[6px] border border-[var(--border-subtle)]">
          <div>
            <label htmlFor="tab-custom-mm-input" className="text-[11px] font-semibold text-[var(--text-muted)] block">
              Ajuste fino milimétrico (calibre):
            </label>
            <div className="flex items-center gap-1.5 mt-1">
              <input
                id="tab-custom-mm-input"
                type="number"
                step="0.01"
                min="0.4"
                max="2.5"
                value={customDiameterMm}
                onChange={(e) => setCustomDiameterMm(Math.max(0.3, Number(e.target.value)))}
                className="w-full h-[30px] px-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[4px] text-right font-code text-[12px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)]"
              />
              <span className="text-[11px] font-bold text-[var(--text-primary)]">mm</span>
            </div>
          </div>

          <div>
            <label htmlFor="tab-parallel-select" className="text-[11px] font-semibold text-[var(--text-muted)] block">
              Configuración de montaje:
            </label>
            <select
              id="tab-parallel-select"
              value={parallelTubes}
              onChange={(e) => setParallelTubes(Number(e.target.value))}
              className="w-full h-[30px] px-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[4px] text-[12px] text-[var(--text-primary)] mt-1 focus:outline-none focus:border-[var(--accent-base)] cursor-pointer"
            >
              <option value={1}>1 Capilar simple</option>
              <option value={2}>2 Capilares en paralelo</option>
            </select>
          </div>
        </div>

        {/* Resultado Destacado con Tipografía Grande y sin cortes */}
        <div className="p-3 bg-[var(--bg-alt)]/70 border-2 border-[var(--accent-base)]/40 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-condensed font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Longitud Requerida para este Diámetro (S.I.)
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[26px] font-code font-bold text-[var(--accent-base)] leading-none">
                {calculatedLengthM.toFixed(2)} m
              </span>
              <span className="text-[12px] font-code text-[var(--text-muted)]">
                ({calculatedLengthCm.toFixed(0)} cm / {(calculatedLengthM * 1000).toFixed(0)} mm)
              </span>
            </div>
            <div className="text-[10px] font-code text-[var(--text-muted)] mt-1">
              Fórmula: L = L_ref × (D / D_ref)⁴·⁶⁵ {parallelTubes === 2 ? '× (1 / 2)¹·⁸²' : ''}
            </div>
            {parallelTubes === 2 && (
              <div className="text-[10px] text-[var(--accent-base)] mt-0.5 font-medium">
                * Montaje en paralelo: Cada uno de los 2 capilares debe cortarse a {calculatedLengthM.toFixed(2)} m
              </div>
            )}
          </div>
          {onGoToRecommendations && (
            <button
              type="button"
              onClick={onGoToRecommendations}
              className="self-start sm:self-auto px-3 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-[6px] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>Ver tabla de diámetros</span>
              <span className="material-symbols-rounded text-[13px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Estado / Recomendación de longitud */}
        <div className={`p-2.5 border rounded-[6px] flex items-start gap-2 ${statusBadge.color}`}>
          <span className="material-symbols-rounded text-[17px] shrink-0 mt-0.5">
            {statusBadge.icon}
          </span>
          <div>
            <div className="font-bold text-[11px] font-condensed tracking-wide">
              {statusBadge.title}
            </div>
            <div className="text-[10.5px] mt-0.5 leading-snug">
              {statusBadge.desc}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Banco de Prueba y Esquema Técnico (Horizontal Card, Spacious) */}
      <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-rounded text-[16px] text-[var(--accent-base)]">compress</span>
            <h3 className="font-condensed font-bold text-[13px] uppercase tracking-wide text-[var(--text-primary)]">
              Banco de Calibración con Nitrógeno
            </h3>
          </div>
          <a
            href="https://www.youtube.com/watch?v=zvLUBG25TdI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            title="Ver tutorial de cómo realizar la capilarización"
          >
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">▶</span>
            <span>Vídeo Tutorial</span>
            <span className="material-symbols-rounded text-[13px]">open_in_new</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Imagen de Esquema con Zoom */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="sm:col-span-5 group relative bg-white dark:bg-slate-900 rounded-[6px] border border-[var(--border-default)] p-1.5 cursor-pointer hover:border-[var(--accent-base)] transition-all flex items-center justify-center overflow-hidden"
            title="Hacer clic para ampliar el esquema"
          >
            <img
              src={capilarizacionImg}
              alt="Esquema técnico de capilarización y banco de prueba con nitrógeno"
              className="w-full h-auto max-h-[115px] object-contain transition-transform group-hover:scale-105"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded shadow flex items-center gap-1">
              <span className="material-symbols-rounded text-[11px]">zoom_in</span>
              <span>Ampliar</span>
            </div>
          </div>

          {/* Información y Lectura Digital */}
          <div className="sm:col-span-7 space-y-2">
            <div className="bg-[#0f172a] dark:bg-[#020617] border border-slate-700/70 rounded-[6px] py-1.5 px-2.5 text-center shadow-inner">
              <div className="text-[9.5px] font-condensed uppercase tracking-wider font-bold text-slate-300">
                Lectura Objetivo en Banco (S.I.)
              </div>
              <div className="text-[20px] font-code font-bold text-emerald-400 tracking-tight leading-none my-1">
                {result.flowRateLMin.toFixed(2)} l/min
              </div>
              <div className="text-[9.5px] text-slate-400 font-code">
                Nitrógeno seco a Δp = 10,0 bar (1,0 MPa)
              </div>
            </div>

            <div className="text-[10.5px] text-[var(--text-muted)] leading-relaxed px-0.5">
              Ajustar la longitud cortando el tubo capilar hasta registrar exactamente este caudal en el caudalímetro antes de soldar al circuito.
            </div>
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
