import React, { useState, useMemo, useEffect } from 'react';
import {
  AppSettings,
  CalculationResult,
  CapillaryRecommendation,
  InputValues,
} from './types';
import { calculateCapillary, convertEnergy, convertTemp } from './thermo/calculation';
import { RefrigerationDiagram } from './components/RefrigerationDiagram';
import { InputDataPanel } from './components/InputDataPanel';
import { RecommendationTable } from './components/RecommendationTable';
import { TheoryPanel } from './components/TheoryPanel';
import { SettingsDialog } from './components/SettingsDialog';
import { HelpDialog } from './components/HelpDialog';
import { DisclaimerDialog } from './components/DisclaimerDialog';
import { PrintReportDialog } from './components/PrintReportDialog';
import { TheoryVideoDialog } from './components/TheoryVideoDialog';
import { EquivalentCapillaryDialog } from './components/EquivalentCapillaryDialog';
import { BancoN2Panel } from './components/BancoN2Panel';
import { EquationsDialog } from './components/EquationsDialog';

export default function App() {
  // Theme state: dark | light (default: dark for professional CAD/engineering workstation look)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Settings state (Defaults: S.I. Units: W, °C, Bar, mm, m, l/min, Europe)
  const [settings, setSettings] = useState<AppSettings>({
    energy: 'W',
    temperature: '°C',
    pressure: 'Bar',
    diameter: 'millimeters',
    length: 'meters',
    flow: 'l/min',
    standardTubeList: 'Europe',
  });

  // Input data state (Default: R134a, 125 W, -25°C evap, 45°C cond, 18°C return - standard SI case)
  const [inputs, setInputs] = useState<InputValues>({
    refrigerant: 'R134a',
    heatLoad: 125,
    evapTemp: -25,
    condTemp: 45,
    returnTemp: 18,
  });

  // Active highlighted badge ('A', 'B', 'C', 'D')
  const [activeBadge, setActiveBadge] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Active container tab: 'inputs' (1), 'recommendations' (2), 'theory' (3), 'bancoN2' (4), or 'all'
  const [activeRightTab, setActiveRightTab] = useState<'inputs' | 'recommendations' | 'theory' | 'bancoN2' | 'all'>('inputs');

  // Selected row in table
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null);

  // Modals visibility
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [showEquivalent, setShowEquivalent] = useState(false);
  const [showEquations, setShowEquations] = useState(false);

  // Perform thermodynamic calculation
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateCapillary(inputs, settings);
  }, [inputs, settings]);

  const optimalTube = useMemo(() => {
    return calculationResult.recommendations.find((r) => r.isOptimal);
  }, [calculationResult]);

  // Handle settings change with automatic unit conversion of numeric inputs
  const handleSaveSettings = (newSettings: AppSettings) => {
    let convertedHeat = inputs.heatLoad;
    let convertedEvap = inputs.evapTemp;
    let convertedCond = inputs.condTemp;
    let convertedReturn = inputs.returnTemp;

    // Convert energy unit if changed
    if (newSettings.energy !== settings.energy) {
      convertedHeat = Number(
        convertEnergy(inputs.heatLoad, settings.energy, newSettings.energy).toFixed(1)
      );
    }

    // Convert temperature units if changed
    if (newSettings.temperature !== settings.temperature) {
      convertedEvap = Math.round(
        convertTemp(inputs.evapTemp, settings.temperature, newSettings.temperature)
      );
      convertedCond = Math.round(
        convertTemp(inputs.condTemp, settings.temperature, newSettings.temperature)
      );
      convertedReturn = Math.round(
        convertTemp(inputs.returnTemp, settings.temperature, newSettings.temperature)
      );
    }

    setInputs({
      ...inputs,
      heatLoad: convertedHeat,
      evapTemp: convertedEvap,
      condTemp: convertedCond,
      returnTemp: convertedReturn,
    });

    setSettings(newSettings);
  };

  // Badge click handler
  const handleBadgeClick = (badge: 'A' | 'B' | 'C' | 'D') => {
    setActiveBadge(badge);
    if (activeRightTab !== 'all') {
      setActiveRightTab('inputs');
    }
    setTimeout(() => {
      const inputMap = {
        A: 'input-heat-load',
        B: 'input-evap-temp',
        C: 'input-cond-temp',
        D: 'input-return-temp',
      };
      const element = document.getElementById(inputMap[badge]);
      if (element) {
        element.focus();
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 font-inter antialiased select-none transition-colors duration-200">
      {/* Main Glass Panel (panelGlass from Custom Design System) */}
      <div className="w-full max-w-[940px] bg-[var(--bg-glass)] backdrop-blur-[12px] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] flex flex-col overflow-hidden transition-all duration-200">
        
        {/* Navigation & Header Bar */}
        <div className="h-[46px] px-3.5 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex items-center justify-between gap-2">
          {/* Brand & Identity */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-[6px] bg-[var(--accent-base)] flex items-center justify-center p-1 shrink-0 shadow-xs">
              <span className="material-symbols-rounded text-white text-[18px]">ac_unit</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-condensed font-extrabold text-[18px] text-[var(--text-primary)] tracking-tight">
                Selector de Tubos Capilares
              </span>
              <span className="hidden sm:inline text-[11px] font-medium text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-2">
                Refrigeración Comercial y Doméstica
              </span>
            </div>
          </div>

          {/* Right Actions: Quick Tools & Theme Switcher */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1.5 bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
              title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              <span className="material-symbols-rounded text-[15px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="hidden md:inline font-inter">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            {/* Config & Help Icons */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
              title="Configuración de Unidades"
            >
              <span className="material-symbols-rounded text-[15px]">tune</span>
              <span className="hidden sm:inline font-inter">Unidades</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrint(true)}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-semibold flex items-center gap-1 bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
              title="Imprimir / Exportar Reporte"
            >
              <span className="material-symbols-rounded text-[15px]">print</span>
              <span className="hidden sm:inline font-inter">Reporte</span>
            </button>
          </div>
        </div>

        {/* Interior Window Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          {/* Header Subtitle Area */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-condensed font-bold text-[20px] text-[var(--text-primary)] leading-tight">
                  Cálculo y Dimensionamiento de Capilares
                </h1>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Sistema de diseño Pro • Ecuaciones termodinámicas de flujo bifásico
                </p>
              </div>
            </div>
          </div>

          {/* Main Grid: Left (Diagram) & Right (Inputs + Table) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Panel: Refrigeration Schematic Diagram (~5/12) */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center justify-center border border-[var(--border-default)] bg-white rounded-[8px] p-2 shadow-[var(--shadow-soft)]">
              <RefrigerationDiagram
                activeBadge={activeBadge}
                onBadgeClick={handleBadgeClick}
                onBadgeHover={setActiveBadge}
                tCondC={calculationResult.thermoDetails?.tCondC}
                tEvapC={calculationResult.thermoDetails?.tEvapC}
                isError={!calculationResult.isValid}
              />
            </div>

            {/* Right Panel: Tabbed Container with 3 tabs:
                1. DATOS.
                2. RECOMENDACIONES.
                3. TEORIA.
            */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col min-w-0">
              {/* 4 Container Tabs Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-alt)] px-1 sm:px-2 pt-1.5 rounded-t-[8px] overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-1">
                  {/* Tab 1: 1. DATOS. */}
                  <button
                    type="button"
                    id="tab-inputs"
                    onClick={() => setActiveRightTab('inputs')}
                    className={`px-2.5 sm:px-3 py-2 text-[12px] font-condensed font-bold tracking-tight rounded-t-[6px] border-t-2 border-x transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRightTab === 'inputs'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent-base)] border-t-[var(--accent-base)] border-x-[var(--border-default)] -mb-[1px] shadow-xs z-10'
                        : 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent'
                    }`}
                  >
                    <span className="whitespace-nowrap">1. DATOS.</span>
                  </button>

                  {/* Tab 2: 2. RECOMENDACIONES. */}
                  <button
                    type="button"
                    id="tab-recommendations"
                    onClick={() => setActiveRightTab('recommendations')}
                    className={`px-2.5 sm:px-3 py-2 text-[12px] font-condensed font-bold tracking-tight rounded-t-[6px] border-t-2 border-x transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRightTab === 'recommendations'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent-base)] border-t-[var(--accent-base)] border-x-[var(--border-default)] -mb-[1px] shadow-xs z-10'
                        : 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent'
                    }`}
                  >
                    <span className="whitespace-nowrap">2. RECOMENDACIONES.</span>
                  </button>

                  {/* Tab 3: 3. TEORIA. */}
                  <button
                    type="button"
                    id="tab-theory"
                    onClick={() => setActiveRightTab('theory')}
                    className={`px-2.5 sm:px-3 py-2 text-[12px] font-condensed font-bold tracking-tight rounded-t-[6px] border-t-2 border-x transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRightTab === 'theory'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent-base)] border-t-[var(--accent-base)] border-x-[var(--border-default)] -mb-[1px] shadow-xs z-10'
                        : 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent'
                    }`}
                  >
                    <span className="whitespace-nowrap">3. TEORIA.</span>
                  </button>

                  {/* Tab 4: 4. BANCO N2. */}
                  <button
                    type="button"
                    id="tab-banco-n2"
                    onClick={() => setActiveRightTab('bancoN2')}
                    className={`px-2.5 sm:px-3 py-2 text-[12px] font-condensed font-bold tracking-tight rounded-t-[6px] border-t-2 border-x transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRightTab === 'bancoN2'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent-base)] border-t-[var(--accent-base)] border-x-[var(--border-default)] -mb-[1px] shadow-xs z-10'
                        : 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent'
                    }`}
                  >
                    <span className="whitespace-nowrap">4. BANCO N2.</span>
                  </button>
                </div>

                {/* Combined 1+2 View Toggle */}
                <button
                  type="button"
                  onClick={() => setActiveRightTab(activeRightTab === 'all' ? 'inputs' : 'all')}
                  className={`hidden xl:flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-[4px] cursor-pointer transition-colors border shrink-0 ${
                    activeRightTab === 'all'
                      ? 'bg-[var(--accent-base)] text-[var(--accent-text)] border-[var(--accent-base)]'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                  }`}
                  title="Ver Datos de Entrada y Tabla de Recomendaciones simultáneamente"
                >
                  <span className="material-symbols-rounded text-[13px]">splitscreen</span>
                  <span>1+2</span>
                </button>
              </div>

              {/* Tab Container Body */}
              <div className="border border-t-0 border-[var(--border-default)] bg-[var(--bg-surface)] p-3.5 rounded-b-[8px] shadow-[var(--shadow-soft)] transition-colors min-h-[440px] flex flex-col justify-start">
                {/* Tab 1: Datos de Entrada */}
                {(activeRightTab === 'inputs' || activeRightTab === 'all') && (
                  <div className={activeRightTab === 'all' ? 'mb-4 pb-4 border-b border-[var(--border-subtle)]' : ''}>
                    <InputDataPanel
                      inputs={inputs}
                      settings={settings}
                      onChange={setInputs}
                      activeBadge={activeBadge}
                      onBadgeHover={setActiveBadge}
                      onBadgeClick={handleBadgeClick}
                      hideHeader={true}
                      noBorder={true}
                      resultPreview={
                        activeRightTab === 'inputs' ? (
                          <div className="mt-1 p-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[8px] flex flex-col gap-2 text-[11px] shadow-xs">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[var(--accent-base)] flex items-center gap-1">
                                  <span className="material-symbols-rounded text-[15px]">speed</span>
                                  <span>Caudal N₂:</span>
                                </span>
                                <span className="font-code font-bold text-[var(--text-primary)]">
                                  {calculationResult.flowRateFormatted}
                                </span>
                                <span className="text-[var(--text-muted)]">•</span>
                                <span className="text-[var(--text-secondary)]">
                                  Óptimo:{' '}
                                  <strong className="text-emerald-500 font-code font-bold">
                                    {optimalTube
                                      ? `${optimalTube.diameterFormatted} (${optimalTube.lengthFormatted})`
                                      : 'Calculando...'}
                                  </strong>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setShowEquations(true)}
                                  className="px-2 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] text-[var(--accent-base)] rounded-[4px] font-semibold flex items-center gap-1 cursor-pointer text-[11px] shadow-xs transition-colors"
                                  title="Ver ecuaciones y fórmulas aplicadas al cálculo"
                                >
                                  <span className="material-symbols-rounded text-[14px]">functions</span>
                                  <span>Ecuaciones</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setActiveRightTab('recommendations')}
                                  className="px-2.5 py-1 bg-[var(--accent-base)] text-[var(--accent-text)] rounded-[4px] font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer text-[11px] shadow-xs transition-opacity"
                                >
                                  <span>Ver recomendaciones (2)</span>
                                  <span className="material-symbols-rounded text-[13px]">arrow_forward</span>
                                </button>
                              </div>
                            </div>

                            <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 text-[10px] text-[var(--text-muted)] font-code">
                              <span className="truncate">Fórmula: V̇_N₂ = ṁ_ref × k_N₂ × (p_cond / 13.5)⁰·²⁵</span>
                              <button
                                type="button"
                                onClick={() => setShowEquations(true)}
                                className="text-[var(--accent-base)] hover:underline font-inter text-[10px] shrink-0 font-semibold cursor-pointer"
                              >
                                Ver desglose paso a paso ↗
                              </button>
                            </div>
                          </div>
                        ) : undefined
                      }
                    />
                  </div>
                )}

                {/* Tab 2: Recomendaciones de Tubo Capilar */}
                {(activeRightTab === 'recommendations' || activeRightTab === 'all') && (
                  <RecommendationTable
                    result={calculationResult}
                    selectedTubeId={selectedTubeId}
                    onSelectTube={(tube: CapillaryRecommendation) => setSelectedTubeId(tube.id)}
                    onOpenTestBench={() => setActiveRightTab('bancoN2')}
                    noBorder={true}
                    onGoToInputs={() => setActiveRightTab('inputs')}
                  />
                )}

                {/* Tab 3: Teoría */}
                {activeRightTab === 'theory' && (
                  <TheoryPanel
                    onOpenTestBench={() => setActiveRightTab('bancoN2')}
                  />
                )}

                {/* Tab 4: Banco N2 */}
                {activeRightTab === 'bancoN2' && (
                  <BancoN2Panel
                    result={calculationResult}
                    onGoToRecommendations={() => setActiveRightTab('recommendations')}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
            {/* Left Link & Credits */}
            <div className="text-left flex items-center gap-2 text-[var(--text-muted)]">
              <span>Selector Pro</span>
              <span>•</span>
              <span>Software de Selección de Tubos Capilares</span>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => setShowEquations(true)}
                className="px-3 py-1.5 rounded-[6px] bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-strong)] text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Ver fórmulas matemáticas y ecuaciones del cálculo"
              >
                <span className="material-symbols-rounded text-[15px] text-[var(--accent-base)]">functions</span>
                <span>Ecuaciones</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="px-3 py-1.5 rounded-[6px] bg-[var(--bg-alt)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-strong)] text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-rounded text-[15px]">help</span>
                <span>Ayuda</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EquationsDialog
        isOpen={showEquations}
        inputs={inputs}
        settings={settings}
        result={calculationResult}
        onClose={() => setShowEquations(false)}
      />

      <SettingsDialog
        isOpen={showSettings}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setShowSettings(false)}
      />

      <HelpDialog
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onOpenDisclaimer={() => {
          setShowHelp(false);
          setShowDisclaimer(true);
        }}
      />

      <DisclaimerDialog
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />

      <PrintReportDialog
        isOpen={showPrint}
        inputs={inputs}
        settings={settings}
        result={calculationResult}
        onClose={() => setShowPrint(false)}
      />

      {/* Video Theory & Practical Criteria Modal */}
      <TheoryVideoDialog
        isOpen={showTheory}
        onClose={() => setShowTheory(false)}
        onOpenTestBench={() => {
          setShowTheory(false);
          setShowEquivalent(true);
        }}
      />

      {/* Nitrogen Flow Rate Bench & Equivalent Workshop Calculator Modal */}
      <EquivalentCapillaryDialog
        isOpen={showEquivalent}
        result={calculationResult}
        settings={settings}
        onClose={() => setShowEquivalent(false)}
      />
    </div>
  );
}

