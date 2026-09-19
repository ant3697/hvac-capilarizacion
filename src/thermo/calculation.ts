import {
  AppSettings,
  CalculationResult,
  CapillaryRecommendation,
  InputValues,
  LengthUnit,
  DiameterUnit,
} from '../types';
import {
  REFRIGERANTS,
  TUBE_CATALOG_SPAIN,
  TUBE_CATALOG_EUROPE,
  TUBE_CATALOG_USA,
} from './refrigerants';

/**
 * Format length in inches to classic imperial vulgar fraction:
 * e.g., 50.625 -> "50 5/8 in.", 64.5 -> "64 1/2 in.", 213 -> "213 in."
 */
export function formatInchFraction(inches: number): string {
  if (!isFinite(inches) || inches <= 0) return '0 in.';

  // Round to nearest 1/8 inch
  const roundedEighths = Math.round(inches * 8);
  const wholeInches = Math.floor(roundedEighths / 8);
  const eighths = roundedEighths % 8;

  let fraction = '';
  switch (eighths) {
    case 1:
      fraction = '1/8';
      break;
    case 2:
      fraction = '1/4';
      break;
    case 3:
      fraction = '3/8';
      break;
    case 4:
      fraction = '1/2';
      break;
    case 5:
      fraction = '5/8';
      break;
    case 6:
      fraction = '3/4';
      break;
    case 7:
      fraction = '7/8';
      break;
    default:
      fraction = '';
  }

  if (fraction && wholeInches > 0) {
    return `${wholeInches} ${fraction} in.`;
  } else if (fraction && wholeInches === 0) {
    return `${fraction} in.`;
  } else {
    return `${wholeInches} in.`;
  }
}

/**
 * Format length according to user setting (inches or meters)
 */
export function formatLength(inches: number, unit: LengthUnit): string {
  if (unit === 'inches') {
    return formatInchFraction(inches);
  } else {
    const meters = inches * 0.0254;
    return `${meters.toFixed(2)} m`;
  }
}

/**
 * Format diameter according to user setting (millimeters or inches)
 */
export function formatDiameter(diameterMm: number, unit: DiameterUnit): string {
  if (unit === 'millimeters') {
    return `${diameterMm.toFixed(2)} mm`;
  } else {
    const inches = diameterMm / 25.4;
    return `${inches.toFixed(3)} in.`;
  }
}

/**
 * Convert temperature between units
 */
export function convertTemp(val: number, from: '°C' | '°F', to: '°C' | '°F'): number {
  if (from === to) return val;
  if (from === '°C' && to === '°F') return val * 1.8 + 32;
  return (val - 32) / 1.8;
}

/**
 * Convert heat load / energy between units
 */
export function convertEnergy(val: number, from: 'W' | 'Btu/hr', to: 'W' | 'Btu/hr'): number {
  if (from === to) return val;
  if (from === 'W' && to === 'Btu/hr') return val * 3.412142;
  return val / 3.412142;
}

/**
 * Convert flow between units
 */
export function convertFlow(val: number, from: 'l/min' | 'CFM', to: 'l/min' | 'CFM'): number {
  if (from === to) return val;
  if (from === 'CFM' && to === 'l/min') return val * 28.31685;
  return val / 28.31685;
}

/**
 * Convert pressure between units
 */
export function convertPressure(val: number, from: 'psi' | 'Bar', to: 'psi' | 'Bar'): number {
  if (from === to) return val;
  if (from === 'Bar' && to === 'psi') return val * 14.50377;
  return val / 14.50377;
}

/**
 * Core thermodynamic and empirical sizing calculation
 */
export function calculateCapillary(inputs: InputValues, settings: AppSettings): CalculationResult {
  const refDef = REFRIGERANTS[inputs.refrigerant] || REFRIGERANTS['R12'];

  // 1. Convert all inputs to base SI units:
  // Heat load -> Watts
  const qWatts = settings.energy === 'W' ? inputs.heatLoad : inputs.heatLoad / 3.412142;

  // Temperatures -> Celsius
  const tEvapC = settings.temperature === '°C' ? inputs.evapTemp : (inputs.evapTemp - 32) / 1.8;
  const tCondC = settings.temperature === '°C' ? inputs.condTemp : (inputs.condTemp - 32) / 1.8;
  const tReturnC = settings.temperature === '°C' ? inputs.returnTemp : (inputs.returnTemp - 32) / 1.8;

  // Defensive check for NaN or infinite values
  if (!Number.isFinite(qWatts) || !Number.isFinite(tEvapC) || !Number.isFinite(tCondC) || !Number.isFinite(tReturnC)) {
    return {
      isValid: false,
      errorMessage: 'Valores no válidos',
      errorDetail: 'Por favor, introduzca valores numéricos válidos en todos los campos',
      flowRateCFM: 0,
      flowRateLMin: 0,
      flowRateFormatted: settings.flow === 'CFM' ? '0.00 CFM (N₂ a delta p 145 psi)' : '0.00 l/min (N₂ a delta p 10 bar)',
      recommendations: [],
    };
  }

  // Saturated pressures in Bar (Antoine approx with zero-denominator safety)
  const denomCond = tCondC + refDef.antoine.C;
  const denomEvap = tEvapC + refDef.antoine.C;
  const pCondBar = denomCond !== 0 ? Math.max(0.01, Math.pow(10, refDef.antoine.A - refDef.antoine.B / denomCond)) : 1;
  const pEvapBar = denomEvap !== 0 ? Math.max(0.01, Math.pow(10, refDef.antoine.A - refDef.antoine.B / denomEvap)) : 1;

  // 2. Validation Checks
  // Check condensing temperature range
  const minCondDisplay = settings.temperature === '°C'
    ? `${refDef.minCondTempC.toFixed(1)}°C`
    : `${(refDef.minCondTempC * 1.8 + 32).toFixed(1)}°F`;

  const maxCondDisplay = settings.temperature === '°C'
    ? `${refDef.maxCondTempC.toFixed(1)}°C`
    : `${(refDef.maxCondTempC * 1.8 + 32).toFixed(1)}°F`;

  // Check valid condensing temperature
  if (tCondC > refDef.maxCondTempC || tCondC < refDef.minCondTempC) {
    // Calculates flow rate for the given heat load
    const approxCFM = Math.max(0, (qWatts * 0.00392 * (refDef.n2ConversionFactor / 0.165)));
    const approxLMin = approxCFM * 28.31685;
    const flowFormatted = settings.flow === 'CFM'
      ? `${approxCFM.toFixed(2)} CFM (N₂ a delta p 145 psi)`
      : `${approxLMin.toFixed(2)} l/min (N₂ a delta p 10 bar)`;

    return {
      isValid: false,
      errorMessage: 'Temp. condensación no válida',
      errorDetail: `${minCondDisplay} a ${maxCondDisplay}`,
      flowRateCFM: approxCFM,
      flowRateLMin: approxLMin,
      flowRateFormatted: flowFormatted,
      recommendations: [],
    };
  }

  // Check evaporating temperature
  if (tEvapC >= tCondC) {
    return {
      isValid: false,
      errorMessage: 'T. Evap >= T. Cond',
      errorDetail: 'La temp. de evaporación debe ser menor a la de condensación',
      flowRateCFM: 0,
      flowRateLMin: 0,
      flowRateFormatted: settings.flow === 'CFM' ? '0.00 CFM (N₂ a delta p 145 psi)' : '0.00 l/min (N₂ a delta p 10 bar)',
      recommendations: [],
    };
  }

  // Check heat load
  if (qWatts <= 0) {
    return {
      isValid: false,
      errorMessage: 'Carga térmica no válida',
      errorDetail: 'La carga térmica debe ser superior a 0',
      flowRateCFM: 0,
      flowRateLMin: 0,
      flowRateFormatted: settings.flow === 'CFM' ? '0.00 CFM (N₂ a delta p 145 psi)' : '0.00 l/min (N₂ a delta p 10 bar)',
      recommendations: [],
    };
  }

  // 3. Thermodynamic Enthalpies and Mass Flow:
  // Vapor enthalpy leaving evaporator / suction line heat exchanger:
  // h1 = h_vap_ref + cp_vapor * (T_return)
  const h1 = refDef.h_vap_ref + refDef.cp_vapor * tReturnC; // kJ/kg

  // Liquid enthalpy entering capillary:
  // h4 = h_liquid(T_cond) approx cp_liquid * T_cond
  const h4 = refDef.cp_liquid * tCondC; // kJ/kg

  const deltaH = Math.max(10, h1 - h4); // kJ/kg refrigerating effect
  const massFlowKgS = (qWatts / 1000) / deltaH; // kg/s
  const massFlowKgH = massFlowKgS * 3600; // kg/h

  // 4. Nitrogen Flow Rate (Factory Test Benchmark at 145 psi / 10 Bar delta P):
  // Flow rate CFM N2 at delta P 145 psi based on required mass flow and refrigerant properties
  // Empirical calibration: 200 Btu/hr R12 at -20°C evap, 55°C cond, 0°C return -> ~0.24 CFM N2
  const pressureRatioCorrection = Math.pow(Math.max(0.01, pCondBar) / 13.5, 0.25);
  const flowRateCFM = Number(
    (massFlowKgH * refDef.n2ConversionFactor * pressureRatioCorrection).toFixed(2)
  );
  const flowRateLMin = flowRateCFM * 28.31685;

  const flowRateFormatted = settings.flow === 'CFM'
    ? `${flowRateCFM.toFixed(2)} CFM (N₂ a delta p 145 psi)`
    : `${flowRateLMin.toFixed(2)} l/min (N₂ a delta p 10 bar)`;

  // 5. Capillary Tube Sizing Engine:
  // Empirical formulation for standard capillary tubes:
  // Reference benchmark: at V_N2 = 0.24 CFM:
  // D = 0.63 mm -> L = 64.5 inches (1.638 m)
  // General law: L = L_ref * (D / D_ref)^4.65 * (V_ref / V_N2)^1.82
  const catalog = settings.standardTubeList === 'USA' ? TUBE_CATALOG_USA : TUBE_CATALOG_SPAIN;
  const D_ref = 0.63; // mm
  const L_ref_inches = 64.5; // inches for 0.24 CFM
  const V_ref_CFM = 0.24;

  const effectiveCFM = Math.max(0.001, Number.isFinite(flowRateCFM) ? flowRateCFM : 0.001);
  const flowRatio = V_ref_CFM / effectiveCFM;
  const flowFactor = Math.pow(flowRatio, 1.82);

  const recommendations: CapillaryRecommendation[] = catalog.map((tube, index) => {
    const dMm = tube.innerDiameterMm;
    const dIn = tube.innerDiameterIn;

    const diameterRatio = dMm / D_ref;
    const calculatedLengthIn = L_ref_inches * Math.pow(diameterRatio, 4.65) * flowFactor;
    const calculatedLengthM = calculatedLengthIn * 0.0254;

    const lengthFormatted = formatLength(calculatedLengthIn, settings.length);
    const diameterFormatted = formatDiameter(dMm, settings.diameter);

    const inchesThousandths = `${dIn.toFixed(3)}"`;
    const milesimas = tube.milesimas || Math.round(dIn * 1000);
    const gaugeNameUSA = tube.gaugeName || `Calibre ${milesimas} (#${milesimas})`;
    const angloCommercialDesc = `${inchesThousandths} • ${gaugeNameUSA} (${milesimas} mils)`;

    let practicalStatus: 'optimal' | 'acceptable' | 'too_short' | 'too_long' = 'acceptable';
    let statusReason = '';

    if (calculatedLengthM < 1.5) {
      practicalStatus = 'too_short';
      statusReason = 'Longitud menor a 1.5 m: No aconsejado. Riesgo de ruido/siseo, expansión violenta, poco intercambio con la succión y peligro de golpe de líquido.';
    } else if (calculatedLengthM > 4.0) {
      practicalStatus = 'too_long';
      statusReason = 'Longitud mayor a 4.0 m: No aconsejado. Elevado riesgo de taponamiento por impurezas/aceite, caída de presión excesiva y bobinado difícil.';
    } else if (calculatedLengthM >= 1.6 && calculatedLengthM <= 3.0) {
      practicalStatus = 'optimal';
      statusReason = 'Rango recomendado (óptimo 2.0 a 3.0 m): Excelente amortiguación acústica, expansión progresiva y máximo rendimiento del intercambiador.';
    } else {
      practicalStatus = 'acceptable';
      statusReason = 'Rango funcional admisible (1.5 m a 4.0 m según criterio práctico de taller).';
    }

    return {
      id: `tube-${index}-${dMm}`,
      nominalDiameterMm: dMm,
      nominalDiameterIn: dIn,
      calculatedLengthM,
      calculatedLengthIn,
      lengthFormatted,
      diameterFormatted,
      inchesThousandths,
      milesimas,
      gaugeNameUSA,
      angloCommercialDesc,
      isOptimal: false, // will mark below
      flowDiscrepancyPercent: 0,
      practicalStatus,
      statusReason,
    };
  });

  // Pick the optimal selection: standard refrigeration practice benchmark
  // prefer tube lengths around 1.6 m to 2.5 m (60 to 100 inches, ~2.0-2.5 m target).
  let closestIndex = -1;
  let minDiff = Infinity;
  const targetOptimalLengthIn = 65.0; // ~1.65 meters benchmark reference

  recommendations.forEach((rec, idx) => {
    const diff = Math.abs(rec.calculatedLengthIn - targetOptimalLengthIn);
    if (diff < minDiff && rec.calculatedLengthIn >= 45 && rec.calculatedLengthIn <= 160) {
      minDiff = diff;
      closestIndex = idx;
    }
  });

  // If none fell strictly in range, pick closest overall
  if (closestIndex === -1 && recommendations.length > 0) {
    recommendations.forEach((rec, idx) => {
      const diff = Math.abs(rec.calculatedLengthIn - targetOptimalLengthIn);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
  }

  if (closestIndex >= 0 && closestIndex < recommendations.length) {
    recommendations[closestIndex].isOptimal = true;
  }

  return {
    isValid: true,
    flowRateCFM,
    flowRateLMin,
    flowRateFormatted,
    recommendations,
    thermoDetails: {
      qWatts,
      tEvapC,
      tCondC,
      tReturnC,
      pCondBar,
      pEvapBar,
      massFlowKgH,
      subcoolingK: 0,
      superheatK: Math.max(0, tReturnC - tEvapC),
    },
  };
}
