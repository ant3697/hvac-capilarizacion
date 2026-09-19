import React from 'react';
import { CalculationResult, CapillaryRecommendation } from '../types';

interface RecommendationTableProps {
  result: CalculationResult;
  selectedTubeId?: string | null;
  onSelectTube?: (tube: CapillaryRecommendation) => void;
  onOpenTestBench?: () => void;
  noBorder?: boolean;
  onGoToInputs?: () => void;
}

export const RecommendationTable: React.FC<RecommendationTableProps> = ({
  result,
  selectedTubeId,
  onSelectTube,
  onOpenTestBench,
  noBorder = false,
  onGoToInputs,
}) => {
  // View mode: 'optimal_5' (5 tubes centered on optimal) vs 'all' (all standard Spanish tubes)
  const [viewMode, setViewMode] = React.useState<'optimal_5' | 'all'>('optimal_5');

  // Currently focused recommendation (either selected or optimal)
  const activeRec =
    result.recommendations.find((r) => r.id === selectedTubeId) ||
    result.recommendations.find((r) => r.isOptimal) ||
    result.recommendations[0];

  // Index of the optimal or best candidate in the recommendations list
  const optimalIndex = React.useMemo(() => {
    const idx = result.recommendations.findIndex((r) => r.isOptimal);
    if (idx !== -1) return idx;
    const accIdx = result.recommendations.findIndex((r) => r.practicalStatus === 'acceptable');
    if (accIdx !== -1) return accIdx;
    return 0;
  }, [result.recommendations]);

  // Reduced window: 5 tubes with the recommended tube placed in the center (index 2 of 5)
  const displayedRecommendations = React.useMemo(() => {
    if (!result.isValid || result.recommendations.length === 0) return [];
    if (viewMode === 'all' || result.recommendations.length <= 5) {
      return result.recommendations;
    }
    const COUNT = 5;
    let start = optimalIndex - Math.floor(COUNT / 2);
    if (start + COUNT > result.recommendations.length) {
      start = result.recommendations.length - COUNT;
    }
    if (start < 0) {
      start = 0;
    }
    return result.recommendations.slice(start, start + COUNT);
  }, [result.isValid, result.recommendations, viewMode, optimalIndex]);

  const totalDisplayRows = viewMode === 'all' ? Math.max(9, result.recommendations.length) : 5;

  return (
    <div className={`flex flex-col font-inter select-none ${noBorder ? '' : 'border border-[var(--border-default)] bg-[var(--bg-surface)] p-3.5 rounded-[8px] shadow-[var(--shadow-soft)]'} transition-colors`}>
      {/* Group title & Flow rate */}
      <div className="mb-2.5 pb-2 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-rounded text-[var(--accent-base)] text-[16px]">view_list</span>
            <h3 className="text-[var(--text-primary)] text-[14px] font-condensed font-bold uppercase tracking-tight">
              Recomendación de Tubo Capilar
            </h3>
          </div>
          <div className="text-[12px] text-[var(--text-secondary)] font-normal mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>Caudal N₂ calculado (S.I.):</span>
            <span className="font-code font-bold text-[var(--accent-base)] bg-[var(--accent-ghost)] px-1.5 py-0.2 rounded-[4px]">
              {result.flowRateLMin.toFixed(2)} l/min (N₂ a Δp = 10 bar)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle 5 centrados vs todos los comerciales de España */}
          <div className="inline-flex rounded-[6px] p-0.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] text-[11px] font-condensed font-semibold">
            <button
              type="button"
              id="btn-view-optimal-5"
              onClick={() => setViewMode('optimal_5')}
              className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer ${
                viewMode === 'optimal_5'
                  ? 'bg-[var(--accent-base)] text-[var(--accent-text)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Mostrar 5 capilares con el punto recomendado en el centro"
            >
              5 Óptimos (Centrado)
            </button>
            <button
              type="button"
              id="btn-view-all"
              onClick={() => setViewMode('all')}
              className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-[var(--accent-base)] text-[var(--accent-text)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Mostrar todos los diámetros comerciales en España"
            >
              Todos ({result.recommendations.length} en España)
            </button>
          </div>

          {onGoToInputs && (
            <button
              type="button"
              onClick={onGoToInputs}
              className="px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-[4px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Volver a la pestaña de Datos de Entrada (1)"
            >
              <span className="material-symbols-rounded text-[13px]">arrow_back</span>
              <span>Editar Datos (1)</span>
            </button>
          )}
        </div>
      </div>

      {/* Pro Data Table Container */}
      <div className="border border-[var(--border-default)] rounded-[6px] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-[12px]">
          {/* Header */}
          <thead>
            <tr className="bg-[var(--bg-alt)] text-[var(--text-secondary)] font-condensed font-bold uppercase text-left border-b border-[var(--border-default)] text-[11px] tracking-wider">
              <th className="py-2 px-3 border-r border-[var(--border-subtle)] w-1/2">
                Longitud Calculada
              </th>
              <th className="py-2 px-3 w-1/2">
                Diámetro Interior (ID)
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {!result.isValid ? (
              <>
                {/* Error Row: Row 1 */}
                <tr className="bg-red-500/10 border-b border-[var(--border-subtle)] h-[32px]">
                  <td className="py-1 px-3 text-left font-semibold text-red-500 border-r border-[var(--border-subtle)]">
                    {result.errorMessage || 'Entrada no válida'}
                  </td>
                  <td className="py-1 px-3 text-left font-normal text-[var(--text-muted)] text-[11px]">
                    {result.errorDetail || 'Compruebe los parámetros de entrada'}
                  </td>
                </tr>

                {/* Remaining blank rows */}
                {Array.from({ length: totalDisplayRows - 1 }).map((_, i) => (
                  <tr key={`blank-${i}`} className="border-b border-[var(--border-subtle)] h-[28px] opacity-40">
                    <td className="py-1 px-3 border-r border-[var(--border-subtle)]">&nbsp;</td>
                    <td className="py-1 px-3">&nbsp;</td>
                  </tr>
                ))}
              </>
            ) : (
              <>
                {displayedRecommendations.map((rec) => {
                  const isUserSelected = selectedTubeId === rec.id;
                  const isOptimal = rec.isOptimal;

                  let rowBg = 'hover:bg-[var(--bg-hover)]';
                  let borderHighlight = '';

                  if (isOptimal) {
                    rowBg = 'bg-emerald-500/15 font-semibold';
                    borderHighlight = 'border-l-4 border-l-emerald-500';
                  } else if (isUserSelected) {
                    rowBg = 'bg-[var(--accent-ghost)] font-medium';
                    borderHighlight = 'border-l-4 border-l-[var(--accent-base)]';
                  }

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => onSelectTube?.(rec)}
                      className={`${rowBg} ${borderHighlight} border-b border-[var(--border-subtle)] h-[32px] cursor-pointer transition-colors duration-150`}
                    >
                      <td className="py-1 px-3 text-left border-r border-[var(--border-subtle)] font-code text-[12px] flex items-center justify-between">
                        <span className="text-[var(--text-primary)]">{rec.lengthFormatted}</span>
                        {/* Status micro-badge */}
                        {rec.practicalStatus === 'optimal' ? (
                          <span className="text-[10px] font-inter font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-[4px] shadow-xs flex items-center gap-0.5">
                            <span className="material-symbols-rounded text-[11px]">check</span>
                            Óptimo (Centrado)
                          </span>
                        ) : rec.practicalStatus === 'too_short' ? (
                          <span className="text-[10px] font-inter font-semibold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-[4px]">
                            &lt;1.5m
                          </span>
                        ) : rec.practicalStatus === 'too_long' ? (
                          <span className="text-[10px] font-inter font-semibold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-[4px]">
                            &gt;4.0m
                          </span>
                        ) : (
                          <span className="text-[10px] font-inter font-medium text-[var(--text-muted)]">
                            Aceptable
                          </span>
                        )}
                      </td>
                      <td className="py-1 px-3 text-left font-code text-[12px] text-[var(--text-secondary)]">
                        {rec.diameterFormatted}
                      </td>
                    </tr>
                  );
                })}

                {/* Fill remaining empty rows if fewer than totalDisplayRows */}
                {displayedRecommendations.length < totalDisplayRows &&
                  Array.from({ length: totalDisplayRows - displayedRecommendations.length }).map((_, i) => (
                    <tr key={`pad-${i}`} className="border-b border-[var(--border-subtle)] h-[32px] opacity-25">
                      <td className="py-1 px-3 border-r border-[var(--border-subtle)]">&nbsp;</td>
                      <td className="py-1 px-3">&nbsp;</td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Practical Diagnostic Box based on video theory */}
      {result.isValid && activeRec && (
        <div className="mt-3 p-3 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[6px] text-[12px] leading-relaxed transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-[var(--accent-base)]">build_circle</span>
              <span className="font-condensed font-bold text-[var(--text-primary)] text-[13px]">
                Diagnóstico de Taller: {activeRec.lengthFormatted} @ {activeRec.diameterFormatted}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide uppercase ${
                activeRec.practicalStatus === 'optimal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : activeRec.practicalStatus === 'acceptable'
                  ? 'bg-blue-600 text-white'
                  : activeRec.practicalStatus === 'too_short'
                  ? 'bg-red-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {activeRec.practicalStatus === 'optimal'
                ? '⭐ Rango Óptimo (2.0 - 3.0 m)'
                : activeRec.practicalStatus === 'acceptable'
                ? '✓ Rango Tolerable (1.5 - 4.0 m)'
                : activeRec.practicalStatus === 'too_short'
                ? '⚠️ Peligro (< 1.5 m)'
                : '⚠️ Riesgo Obstrucción (> 4.0 m)'}
            </span>
          </div>
          <div className="text-[var(--text-secondary)] text-[12px]">
            {activeRec.statusReason}
          </div>
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex justify-between items-center font-code">
            <span>Longitud física (S.I.): {activeRec.calculatedLengthM.toFixed(2)} m ({(activeRec.calculatedLengthM * 100).toFixed(0)} cm)</span>
            <span className="font-inter italic">Regla práctica de taller: 1.5 m ≤ L ≤ 4.0 m</span>
          </div>
        </div>
      )}

      {/* Bottom hint label */}
      <div className="mt-2 text-[11px] text-[var(--text-muted)] italic flex items-center gap-1">
        <span className="material-symbols-rounded text-[14px]">info</span>
        <span>La opción destacada en verde es la más equilibrada termodinámicamente. Seleccione cualquier fila para ver detalles.</span>
      </div>
    </div>
  );
};


