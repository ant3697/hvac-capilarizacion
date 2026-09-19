export type EnergyUnit = 'W' | 'Btu/hr';
export type TemperatureUnit = '°C' | '°F';
export type PressureUnit = 'psi' | 'Bar';
export type DiameterUnit = 'inches' | 'millimeters';
export type LengthUnit = 'inches' | 'meters';
export type FlowUnit = 'l/min' | 'CFM';
export type StandardTubeList = 'Europe' | 'USA';

export interface AppSettings {
  energy: EnergyUnit;
  temperature: TemperatureUnit;
  pressure: PressureUnit;
  diameter: DiameterUnit;
  length: LengthUnit;
  flow: FlowUnit;
  standardTubeList: StandardTubeList;
}

export interface InputValues {
  refrigerant: string;
  heatLoad: number; // in current energy unit
  evapTemp: number; // in current temp unit
  condTemp: number; // in current temp unit
  returnTemp: number; // in current temp unit
}

export interface CapillaryRecommendation {
  id: string;
  nominalDiameterMm: number;
  nominalDiameterIn: number;
  calculatedLengthM: number;
  calculatedLengthIn: number;
  lengthFormatted: string;
  diameterFormatted: string;
  // Anglo-Saxon / Imported market commercial trade fields
  inchesThousandths: string; // e.g. "0.031\""
  milesimas: number; // e.g. 31 (for 31 mils / thousandths of inch)
  gaugeNameUSA: string; // e.g. "Calibre 31 (#31)" or "Equiv. #31"
  angloCommercialDesc: string; // e.g. "0.031\" • Calibre 31 (31 milésimas)"
  isOptimal: boolean;
  flowDiscrepancyPercent: number;
  practicalStatus: 'optimal' | 'acceptable' | 'too_short' | 'too_long';
  statusReason: string;
}

export interface CalculationResult {
  isValid: boolean;
  errorMessage?: string;
  errorDetail?: string;
  flowRateCFM: number;
  flowRateLMin: number;
  flowRateFormatted: string;
  recommendations: CapillaryRecommendation[];
  thermoDetails?: {
    qWatts: number;
    tEvapC: number;
    tCondC: number;
    tReturnC: number;
    pCondBar: number;
    pEvapBar: number;
    massFlowKgH: number;
    subcoolingK: number;
    superheatK: number;
  };
}

export interface RefrigerantDefinition {
  name: string;
  displayName: string;
  description: string;
  minCondTempC: number;
  maxCondTempC: number;
  minEvapTempC: number;
  maxEvapTempC: number;
  // Saturated properties formulas / constants
  // P_sat(T_C) in Bar = 10^(A - B/(T_C + C)) or Antoine-like polynomial
  antoine: { A: number; B: number; C: number };
  // Latent heat / enthalpy approx
  h_vap_ref: number; // kJ/kg at 0°C
  cp_liquid: number; // kJ/kg·K
  cp_vapor: number; // kJ/kg·K
  n2ConversionFactor: number; // conversion from kg/h of refrigerant to CFM N2 @ 145 psi
}
