import React from 'react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDisclaimer?: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({
  isOpen,
  onClose,
  onOpenDisclaimer,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modern Dialog Frame */}
      <div
        className="w-full max-w-[540px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[12px] text-[var(--text-primary)] overflow-hidden select-none flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[20px] text-[var(--accent-base)]">help</span>
            <span>Manual de Ayuda y Criterios Técnicos</span>
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

        {/* Content Area */}
        <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
          <div className="bg-[var(--bg-alt)]/40 border border-[var(--border-subtle)] rounded-[8px] p-3 text-[12px] leading-relaxed text-[var(--text-secondary)] space-y-3">
            <div className="pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-condensed font-bold text-[15px] text-[var(--text-primary)] block">
                Selector de Tubos Capilares para Refrigeración
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Herramienta de Dimensionamiento Técnico y Equivalencias en Taller (S.I.)
              </span>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block mb-1">
                1. Introducción y Premisas Físicas:
              </span>
              <p>
                Este software calcula el dispositivo de expansión por tubo capilar para circuitos frigoríficos con compresor hermético. El dimensionamiento considera:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[var(--text-muted)]">
                <li>Línea de succión térmicamente unida al capilar (intercambiador de calor regenerativo).</li>
                <li>Régimen estacionario con subenfriamiento estándar a la salida del condensador.</li>
                <li>Fórmulas empíricas de flujo bifásico calibradas con datos experimentales.</li>
              </ul>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block mb-1">
                2. Calibres del Mercado Español y Europeo (S.I.):
              </span>
              <p>
                La lista de recomendaciones está estrictamente adaptada a los diámetros comerciales normalizados en España: <strong>0,60, 0,70, 0,80, 0,90, 1,00, 1,20, 1,25, 1,40 y 1,50 mm</strong>.
              </p>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block mb-1">
                3. Banco de Pruebas de Nitrógeno y Capilarización:
              </span>
              <p>
                Para comprobar o ajustar un capilar en taller sin cargar refrigerante, se utiliza nitrógeno seco a <strong>10,0 bar (1,0 MPa)</strong> de presión diferencial constante. El caudal medido en litros/minuto (l/min) debe coincidir con el caudal de nitrógeno calculado.
              </p>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block mb-1">
                4. Ecuaciones y Fórmulas Matemáticas de Cálculo:
              </span>
              <div className="space-y-1.5 text-[11px] text-[var(--text-muted)]">
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code text-[11px] text-[var(--accent-base)] text-center font-bold">
                  V̇_N₂ (CFM) = ṁ_ref × k_N₂ × (p_cond / 13.5)⁰·²⁵
                </div>
                <p>
                  • <strong>Caudal de Nitrógeno (V̇_N₂):</strong> Se determina a partir del caudal másico ṁ_ref = Q̇ / Δh (kg/s) y del factor de conversión del gas k_N₂, corregido por la relación de presiones calculada con la ecuación de Antoine log₁₀(p) = A - B/(T + C).
                </p>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code text-[11px] text-[var(--accent-base)] text-center font-bold">
                  L = L_ref × (D / D_ref)⁴·⁶⁵ × (V̇_ref / V̇_N₂)¹·⁸²
                </div>
                <p>
                  • <strong>Longitud del Tubo Capilar (L):</strong> Ley empírica de fricción bifásica calibrada con D_ref = 0.63 mm, L_ref = 64.5 in (1.638 m) a V̇_ref = 0.24 CFM.
                </p>
                <div className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-code text-[11px] text-[var(--accent-base)] text-center font-bold">
                  L₂ = L₁ × (D₂ / D₁)⁴·⁶⁵
                </div>
                <p>
                  • <strong>Capilar Equivalente:</strong> Permite adaptar la longitud al cambiar el calibre del capilar conservando la misma restricción.
                </p>
              </div>
            </div>

            {onOpenDisclaimer && (
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  Consulta las condiciones de uso y responsabilidad técnica:
                </span>
                <button
                  type="button"
                  onClick={onOpenDisclaimer}
                  className="text-[11px] font-semibold text-[var(--accent-base)] hover:underline cursor-pointer"
                >
                  Ver Aviso Legal
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[13px] shadow-xs cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
