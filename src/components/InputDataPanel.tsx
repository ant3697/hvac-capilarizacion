import React from 'react';
import { AppSettings, InputValues } from '../types';
import { REFRIGERANTS } from '../thermo/refrigerants';

interface InputDataPanelProps {
  inputs: InputValues;
  settings: AppSettings;
  onChange: (inputs: InputValues) => void;
  activeBadge: 'A' | 'B' | 'C' | 'D' | null;
  onBadgeHover: (badge: 'A' | 'B' | 'C' | 'D' | null) => void;
  onBadgeClick: (badge: 'A' | 'B' | 'C' | 'D') => void;
  hideHeader?: boolean;
  noBorder?: boolean;
  resultPreview?: React.ReactNode;
}

export const InputDataPanel: React.FC<InputDataPanelProps> = ({
  inputs,
  settings,
  onChange,
  activeBadge,
  onBadgeHover,
  onBadgeClick,
  hideHeader = false,
  noBorder = false,
  resultPreview,
}) => {
  const handleInputChange = (field: keyof InputValues, value: string | number) => {
    onChange({
      ...inputs,
      [field]: typeof value === 'number' ? value : value,
    });
  };

  const handleNumberInput = (field: keyof InputValues, raw: string) => {
    const num = raw === '' || isNaN(Number(raw)) ? 0 : Number(raw);
    handleInputChange(field, num);
  };

  return (
    <div className={`relative ${noBorder ? '' : 'border border-[var(--border-default)] bg-[var(--bg-surface)] p-3.5 rounded-[8px] shadow-[var(--shadow-soft)]'} transition-colors`}>
      {/* Group Box Legend Title */}
      {!hideHeader && (
        <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[var(--border-subtle)]">
          <span className="material-symbols-rounded text-[var(--accent-base)] text-[16px]">tune</span>
          <h2 className="text-[var(--text-primary)] font-condensed text-[14px] font-bold tracking-tight uppercase">
            Datos de Entrada
          </h2>
        </div>
      )}

      <div className="space-y-2.5 font-inter text-[13px] text-[var(--text-primary)]">
        {/* Refrigerant Selection */}
        <div className="flex items-center justify-between gap-2">
          <div className="w-6" /> {/* spacer matching badge column */}
          <label htmlFor="refrigerant-select" className="flex-1 text-left font-medium text-[var(--text-secondary)]">
            Refrigerante
          </label>
          <div className="w-[125px] flex items-center">
            <select
              id="refrigerant-select"
              value={inputs.refrigerant}
              onChange={(e) => handleInputChange('refrigerant', e.target.value)}
              className="w-full h-[30px] px-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[12px] font-code text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] focus:ring-2 focus:ring-[var(--accent-ghost)] transition-all cursor-pointer shadow-xs"
            >
              {Object.keys(REFRIGERANTS).map((refKey) => (
                <option key={refKey} value={refKey} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {refKey}
                </option>
              ))}
            </select>
          </div>
          <div className="w-10 text-left text-[11px]" />
        </div>

        {/* Row A: Heat load */}
        <div
          className={`flex items-center justify-between gap-2 py-1 px-1.5 rounded-[6px] transition-all duration-150 ${
            activeBadge === 'A'
              ? 'bg-[var(--accent-ghost)] ring-1 ring-[var(--accent-base)]'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          onMouseEnter={() => onBadgeHover('A')}
          onMouseLeave={() => onBadgeHover(null)}
        >
          <button
            type="button"
            onClick={() => onBadgeClick('A')}
            title="Resaltar Carga Térmica en el Esquema (A)"
            className="w-6 h-6 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] font-extrabold text-[11px] flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            A
          </button>
          <label htmlFor="input-heat-load" className="flex-1 text-left font-medium text-[var(--text-primary)] cursor-pointer">
            Carga térmica del sistema
          </label>
          <div className="w-[90px]">
            <input
              id="input-heat-load"
              type="number"
              step="any"
              value={inputs.heatLoad}
              onChange={(e) => handleNumberInput('heatLoad', e.target.value)}
              className="w-full h-[30px] px-2 text-right bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] font-code text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] focus:ring-2 focus:ring-[var(--accent-ghost)] shadow-xs transition-all"
            />
          </div>
          <span className="w-12 text-left text-[12px] font-condensed text-[var(--text-muted)] shrink-0 font-semibold">
            {settings.energy}
          </span>
        </div>

        {/* Row B: Evaporating temperature */}
        <div
          className={`flex items-center justify-between gap-2 py-1 px-1.5 rounded-[6px] transition-all duration-150 ${
            activeBadge === 'B'
              ? 'bg-[var(--accent-ghost)] ring-1 ring-[var(--accent-base)]'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          onMouseEnter={() => onBadgeHover('B')}
          onMouseLeave={() => onBadgeHover(null)}
        >
          <button
            type="button"
            onClick={() => onBadgeClick('B')}
            title="Resaltar Temp. Evaporación en el Esquema (B)"
            className="w-6 h-6 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] font-extrabold text-[11px] flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            B
          </button>
          <label htmlFor="input-evap-temp" className="flex-1 text-left font-medium text-[var(--text-primary)] cursor-pointer">
            Temperatura de evaporación
          </label>
          <div className="w-[90px]">
            <input
              id="input-evap-temp"
              type="number"
              step="any"
              value={inputs.evapTemp}
              onChange={(e) => handleNumberInput('evapTemp', e.target.value)}
              className="w-full h-[30px] px-2 text-right bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] font-code text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] focus:ring-2 focus:ring-[var(--accent-ghost)] shadow-xs transition-all"
            />
          </div>
          <span className="w-12 text-left text-[12px] font-condensed text-[var(--text-muted)] shrink-0 font-semibold">
            {settings.temperature}
          </span>
        </div>

        {/* Row C: Condensing temperature */}
        <div
          className={`flex items-center justify-between gap-2 py-1 px-1.5 rounded-[6px] transition-all duration-150 ${
            activeBadge === 'C'
              ? 'bg-[var(--accent-ghost)] ring-1 ring-[var(--accent-base)]'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          onMouseEnter={() => onBadgeHover('C')}
          onMouseLeave={() => onBadgeHover(null)}
        >
          <button
            type="button"
            onClick={() => onBadgeClick('C')}
            title="Resaltar Temp. Condensación en el Esquema (C)"
            className="w-6 h-6 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] font-extrabold text-[11px] flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            C
          </button>
          <label htmlFor="input-cond-temp" className="flex-1 text-left font-medium text-[var(--text-primary)] cursor-pointer">
            Temperatura de condensación
          </label>
          <div className="w-[90px]">
            <input
              id="input-cond-temp"
              type="number"
              step="any"
              value={inputs.condTemp}
              onChange={(e) => handleNumberInput('condTemp', e.target.value)}
              className="w-full h-[30px] px-2 text-right bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] font-code text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] focus:ring-2 focus:ring-[var(--accent-ghost)] shadow-xs transition-all"
            />
          </div>
          <span className="w-12 text-left text-[12px] font-condensed text-[var(--text-muted)] shrink-0 font-semibold">
            {settings.temperature}
          </span>
        </div>

        {/* Row D: Return gas temperature */}
        <div
          className={`flex items-center justify-between gap-2 py-1 px-1.5 rounded-[6px] transition-all duration-150 ${
            activeBadge === 'D'
              ? 'bg-[var(--accent-ghost)] ring-1 ring-[var(--accent-base)]'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          onMouseEnter={() => onBadgeHover('D')}
          onMouseLeave={() => onBadgeHover(null)}
        >
          <button
            type="button"
            onClick={() => onBadgeClick('D')}
            title="Resaltar Temp. Gas de Retorno en el Esquema (D)"
            className="w-6 h-6 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] font-extrabold text-[11px] flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            D
          </button>
          <label htmlFor="input-return-temp" className="flex-1 text-left font-medium text-[var(--text-primary)] cursor-pointer">
            Temperatura gas de retorno
          </label>
          <div className="w-[90px]">
            <input
              id="input-return-temp"
              type="number"
              step="any"
              value={inputs.returnTemp}
              onChange={(e) => handleNumberInput('returnTemp', e.target.value)}
              className="w-full h-[30px] px-2 text-right bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] font-code text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)] focus:ring-2 focus:ring-[var(--accent-ghost)] shadow-xs transition-all"
            />
          </div>
          <span className="w-12 text-left text-[12px] font-condensed text-[var(--text-muted)] shrink-0 font-semibold">
            {settings.temperature}
          </span>
        </div>

        {resultPreview && (
          <div className="pt-2">
            {resultPreview}
          </div>
        )}
      </div>
    </div>
  );
};
