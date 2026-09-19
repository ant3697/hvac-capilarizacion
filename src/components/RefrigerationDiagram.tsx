import React, { useState } from 'react';
import circuitoImg from '../assets/circuito.png';

interface RefrigerationDiagramProps {
  activeBadge?: 'A' | 'B' | 'C' | 'D' | null;
  onBadgeClick?: (badge: 'A' | 'B' | 'C' | 'D') => void;
  onBadgeHover?: (badge: 'A' | 'B' | 'C' | 'D' | null) => void;
  tCondC?: number;
  tEvapC?: number;
  isError?: boolean;
}

export const RefrigerationDiagram: React.FC<RefrigerationDiagramProps> = ({
  activeBadge,
  onBadgeClick,
  onBadgeHover,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center p-1 select-none overflow-hidden">
      {!imgError ? (
        <div className="relative w-full max-w-[430px] aspect-[2/3] flex items-center justify-center bg-white">
          {/* Authentic circuit diagram illustration */}
          <img
            src={circuitoImg}
            alt="Esquema del Circuito de Refrigeración"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
          />

          {/* Interactive clickable badges A, B, C, D placed exactly in the locations indicated by the user image */}
          
          {/* Badge B: Evaporating temperature (to the right of the upper evaporator pipe bend) */}
          <button
            type="button"
            onClick={() => onBadgeClick?.('B')}
            onMouseEnter={() => onBadgeHover?.('B')}
            onMouseLeave={() => onBadgeHover?.(null)}
            style={{ top: '7.5%', left: '76.5%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full font-black text-[12px] transition-all cursor-pointer flex items-center justify-center shadow-sm ${
              activeBadge === 'B'
                ? 'bg-[#f58220] text-black border-2 border-black scale-125 ring-2 ring-blue-600 z-30'
                : 'bg-[#f58220] text-black border-[1.5px] border-black hover:scale-115 hover:bg-[#ff9900]'
            }`}
            title="B: Temperatura de evaporación"
          >
            B
          </button>

          {/* Badge A: Heat load (in the white space to the right of the middle evaporator coils) */}
          <button
            type="button"
            onClick={() => onBadgeClick?.('A')}
            onMouseEnter={() => onBadgeHover?.('A')}
            onMouseLeave={() => onBadgeHover?.(null)}
            style={{ top: '23.8%', left: '76.5%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full font-black text-[12px] transition-all cursor-pointer flex items-center justify-center shadow-sm ${
              activeBadge === 'A'
                ? 'bg-[#f58220] text-black border-2 border-black scale-125 ring-2 ring-blue-600 z-30'
                : 'bg-[#f58220] text-black border-[1.5px] border-black hover:scale-115 hover:bg-[#ff9900]'
            }`}
            title="A: Carga térmica del sistema"
          >
            A
          </button>

          {/* Badge C: Condensing temperature (in the white space to the right of the middle condenser coils) */}
          <button
            type="button"
            onClick={() => onBadgeClick?.('C')}
            onMouseEnter={() => onBadgeHover?.('C')}
            onMouseLeave={() => onBadgeHover?.(null)}
            style={{ top: '45.5%', left: '76.5%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full font-black text-[12px] transition-all cursor-pointer flex items-center justify-center shadow-sm ${
              activeBadge === 'C'
                ? 'bg-[#f58220] text-black border-2 border-black scale-125 ring-2 ring-blue-600 z-30'
                : 'bg-[#f58220] text-black border-[1.5px] border-black hover:scale-115 hover:bg-[#ff9900]'
            }`}
            title="C: Temperatura de condensación"
          >
            C
          </button>

          {/* Badge D: Return gas temperature (directly under blue suction pipe connection outside compressor, left of expansion valve) */}
          <button
            type="button"
            onClick={() => onBadgeClick?.('D')}
            onMouseEnter={() => onBadgeHover?.('D')}
            onMouseLeave={() => onBadgeHover?.(null)}
            style={{ top: '87.5%', left: '58.0%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full font-black text-[12px] transition-all cursor-pointer flex items-center justify-center shadow-sm ${
              activeBadge === 'D'
                ? 'bg-[#f58220] text-black border-2 border-black scale-125 ring-2 ring-blue-600 z-30'
                : 'bg-[#f58220] text-black border-[1.5px] border-black hover:scale-115 hover:bg-[#ff9900]'
            }`}
            title="D: Temperatura del gas de retorno"
          >
            D
          </button>
        </div>
      ) : (
        <div className="w-full text-center text-gray-500 text-xs py-10">
          Diagrama de Circuito Frigorífico
        </div>
      )}
    </div>
  );
};

