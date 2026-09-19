import React, { useState } from 'react';
import { AppSettings, StandardTubeList } from '../types';

interface SettingsDialogProps {
  isOpen: boolean;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<AppSettings>({ ...settings });

  React.useEffect(() => {
    if (isOpen) {
      setDraft({ ...settings });
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, settings, onClose]);

  if (!isOpen) return null;

  const handleOk = () => {
    onSave(draft);
    onClose();
  };

  const setSIUnits = () => {
    setDraft({
      energy: 'W',
      temperature: '°C',
      pressure: 'Bar',
      diameter: 'millimeters',
      length: 'meters',
      flow: 'l/min',
      standardTubeList: 'Europe',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modern Dialog Frame */}
      <div
        className="w-[440px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter select-none text-[12px] text-[var(--text-primary)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="h-[42px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-3 text-[var(--text-primary)] font-condensed font-bold text-[14px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-rounded text-[17px] text-[var(--accent-base)]">tune</span>
            <span>Configuración de Unidades</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-[4px] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] flex items-center justify-center text-[14px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3.5 space-y-3.5">
          {/* 3x2 Grid of GroupBoxes */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Energy */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Energía</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="energy"
                    checked={draft.energy === 'W'}
                    onChange={() => setDraft({ ...draft, energy: 'W' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>W (Vatios)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="energy"
                    checked={draft.energy === 'Btu/hr'}
                    onChange={() => setDraft({ ...draft, energy: 'Btu/hr' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>Btu/hr</span>
                </label>
              </div>
            </fieldset>

            {/* 2. Temperature */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Temperatura</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="temperature"
                    checked={draft.temperature === '°C'}
                    onChange={() => setDraft({ ...draft, temperature: '°C' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>°C</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="temperature"
                    checked={draft.temperature === '°F'}
                    onChange={() => setDraft({ ...draft, temperature: '°F' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>°F</span>
                </label>
              </div>
            </fieldset>

            {/* 3. Pressure */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Presión</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pressure"
                    checked={draft.pressure === 'Bar'}
                    onChange={() => setDraft({ ...draft, pressure: 'Bar' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>Bar</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pressure"
                    checked={draft.pressure === 'psi'}
                    onChange={() => setDraft({ ...draft, pressure: 'psi' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>psi</span>
                </label>
              </div>
            </fieldset>

            {/* 4. Diameter */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Diámetro</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="diameter"
                    checked={draft.diameter === 'millimeters'}
                    onChange={() => setDraft({ ...draft, diameter: 'millimeters' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>mm</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="diameter"
                    checked={draft.diameter === 'inches'}
                    onChange={() => setDraft({ ...draft, diameter: 'inches' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>pulgadas</span>
                </label>
              </div>
            </fieldset>

            {/* 5. Length */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Longitud</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="length"
                    checked={draft.length === 'meters'}
                    onChange={() => setDraft({ ...draft, length: 'meters' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>metros</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="length"
                    checked={draft.length === 'inches'}
                    onChange={() => setDraft({ ...draft, length: 'inches' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>pulgadas</span>
                </label>
              </div>
            </fieldset>

            {/* 6. Flow */}
            <fieldset className="border border-[var(--border-default)] rounded-[6px] p-2 bg-[var(--bg-alt)]/40">
              <legend className="px-1 text-[10px] font-condensed font-bold uppercase text-[var(--text-muted)] tracking-wider">Caudal</legend>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flow"
                    checked={draft.flow === 'l/min'}
                    onChange={() => setDraft({ ...draft, flow: 'l/min' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>l/min</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flow"
                    checked={draft.flow === 'CFM'}
                    onChange={() => setDraft({ ...draft, flow: 'CFM' })}
                    className="accent-[var(--accent-base)]"
                  />
                  <span>CFM</span>
                </label>
              </div>
            </fieldset>
          </div>

          {/* Standard tube diameter list */}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
            <label htmlFor="settings-tube-list" className="text-[var(--text-secondary)] font-medium">
              Catálogo estándar de diámetros
            </label>
            <select
              id="settings-tube-list"
              value={draft.standardTubeList}
              onChange={(e) => setDraft({ ...draft, standardTubeList: e.target.value as StandardTubeList })}
              className="w-[180px] h-[28px] px-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[12px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-base)]"
            >
              <option value="Europe">España (Métrico mm - Comercial)</option>
              <option value="USA">EE. UU. / USA (in)</option>
            </select>
          </div>

          {/* Quick preset for SI units */}
          <div className="pt-0.5 flex justify-end">
            <button
              type="button"
              onClick={setSIUnits}
              className="text-[11px] text-[var(--accent-base)] hover:underline cursor-pointer font-medium flex items-center gap-1"
            >
              <span className="material-symbols-rounded text-[13px]">restart_alt</span>
              <span>Restablecer valores predeterminados del S.I.</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[6px] bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] text-[var(--text-primary)] font-medium text-[12px] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleOk}
              className="px-3.5 py-1.5 rounded-[6px] bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-semibold text-[12px] cursor-pointer shadow-xs"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
