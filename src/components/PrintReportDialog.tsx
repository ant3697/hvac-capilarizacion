import React from 'react';
import { AppSettings, CalculationResult, InputValues } from '../types';

interface PrintReportDialogProps {
  isOpen: boolean;
  inputs: InputValues;
  settings: AppSettings;
  result: CalculationResult;
  onClose: () => void;
}

export const PrintReportDialog: React.FC<PrintReportDialogProps> = ({
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

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modern Dialog container for the print sheet */}
      <div
        className="w-full max-w-[700px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[var(--text-primary)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px] select-none print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[18px] text-[var(--accent-base)]">print</span>
            <span>Informe de Cálculo - Selector de Tubos Capilares</span>
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

        {/* Action bar on top */}
        <div className="p-3 bg-[var(--bg-alt)]/40 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 print:hidden select-none">
          <span className="text-[11px] text-[var(--text-muted)]">
            Vista previa del informe técnico de cálculo. Genera el documento en papel o PDF.
          </span>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] text-[12px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-rounded text-[15px]">print</span>
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-[6px] text-[12px] font-medium cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Printable Sheet (White Paper simulation) */}
        <div className="p-6 bg-white m-3 border border-[#aaa] shadow-inner text-[12px] leading-normal" id="printable-area">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-[#cc0000] pb-3 mb-4">
            <div>
              <h1 className="text-[20px] font-bold text-[#002080] tracking-tight">Selector de Tubos Capilares</h1>
              <div className="text-[12px] text-gray-600 font-medium">
                Informe Técnico de Selección de Tubo Capilar
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Versión 1.0 • Fecha: {currentDate}
              </div>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="font-bold text-[#002080] text-[14px]">HOJA TÉCNICA</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Cálculo Termodinámico</span>
            </div>
          </div>

          {/* System Operating Inputs Grid */}
          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-[#000080] bg-gray-100 px-2 py-0.5 border-l-4 border-[#000080] mb-2">
              1. Condiciones de Entrada del Sistema
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 px-2 text-[12px]">
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">Refrigerante:</span>
                <span className="font-bold">{inputs.refrigerant}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">(A) Carga térmica:</span>
                <span className="font-bold">{inputs.heatLoad} {settings.energy}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">(B) Temp. evaporación:</span>
                <span className="font-bold">{inputs.evapTemp} {settings.temperature}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">(C) Temp. condensación:</span>
                <span className="font-bold">{inputs.condTemp} {settings.temperature}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">(D) Temp. gas de retorno:</span>
                <span className="font-bold">{inputs.returnTemp} {settings.temperature}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600">Catálogo de tubos:</span>
                <span className="font-bold">{settings.standardTubeList === 'Europe' ? 'Europa (Métrico mm)' : 'EE. UU. (in)'}</span>
              </div>
            </div>
          </div>

          {/* Thermodynamic Flow Results */}
          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-[#000080] bg-gray-100 px-2 py-0.5 border-l-4 border-[#000080] mb-2">
              2. Caudal Equivalente de Ensayo con Nitrógeno
            </h2>
            <div className="px-2 text-[12px] space-y-1">
              <div className="font-semibold text-gray-900">
                Caudal de prueba con Nitrógeno seco:{' '}
                <span className="text-[#000080] font-bold text-[14px]">
                  {result.flowRateFormatted}
                </span>
              </div>
              {result.thermoDetails && (
                <div className="text-[11px] text-gray-500">
                  Flujo másico: {result.thermoDetails.massFlowKgH.toFixed(2)} kg/h | Recalentamiento:{' '}
                  {result.thermoDetails.superheatK.toFixed(1)} K | Presión de condensación:{' '}
                  {result.thermoDetails.pCondBar.toFixed(2)} bar
                </div>
              )}
            </div>
          </div>

          {/* Capillary Recommendations Table */}
          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-[#000080] bg-gray-100 px-2 py-0.5 border-l-4 border-[#000080] mb-2">
              3. Recomendaciones de Tubos Capilares
            </h2>
            {!result.isValid ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-center font-semibold">
                Error de cálculo: {result.errorMessage} ({result.errorDetail})
              </div>
            ) : (
              <table className="w-full border border-gray-300 text-[12px]">
                <thead>
                  <tr className="bg-[#003399] text-white">
                    <th className="py-1 px-3 text-left">Longitud ({settings.length === 'meters' ? 'm' : 'in.'})</th>
                    <th className="py-1 px-3 text-left">Diámetro Interior ({settings.diameter === 'millimeters' ? 'mm' : 'in.'})</th>
                    <th className="py-1 px-3 text-center">Estado / Evaluación</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recommendations.map((rec) => (
                    <tr
                      key={rec.id}
                      className={
                        rec.isOptimal
                          ? 'bg-[#22b14c]/30 font-bold border-t border-b border-[#22b14c]'
                          : 'border-b border-gray-200 hover:bg-gray-50'
                      }
                    >
                      <td className="py-1 px-3 font-mono">{rec.lengthFormatted}</td>
                      <td className="py-1 px-3 font-mono">{rec.diameterFormatted}</td>
                      <td className="py-1 px-3 text-center">
                        {rec.isOptimal ? (
                          <span className="px-2 py-0.5 bg-[#22b14c] text-black text-[10px] rounded uppercase font-bold mr-1">
                            Óptimo
                          </span>
                        ) : null}
                        {rec.practicalStatus === 'optimal' ? (
                          <span className="text-[10px] text-green-700 font-semibold">2.0-3.0m (Óptimo)</span>
                        ) : rec.practicalStatus === 'acceptable' ? (
                          <span className="text-[10px] text-blue-700 font-normal">1.5-4.0m (Admisible)</span>
                        ) : rec.practicalStatus === 'too_short' ? (
                          <span className="text-[10px] text-red-600 font-semibold">&lt; 1.5m (No aconsejado)</span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-semibold">&gt; 4.0m (No aconsejado)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Engineering Notes & Assumptions */}
          <div className="text-[10px] text-gray-500 border-t border-gray-200 pt-3 space-y-1 leading-relaxed">
            <div className="font-semibold text-gray-700">Premisas técnicas de cálculo:</div>
            <div>• La línea de succión está unida térmicamente al tubo capilar en la mayor parte de su longitud para el intercambio térmico interno.</div>
            <div>• Se asume funcionamiento en régimen continuo con poco o ningún subenfriamiento a la salida del condensador.</div>
            <div>• Los resultados representan un punto de partida inicial óptimo; se recomienda la verificación calorimétrica en banco o prototipo.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
