import { useState, useEffect } from 'react';
import './lib/i18n';
import { useTranslation } from 'react-i18next';
import CountdownTimer from './components/CountdownTimer';
import Snowfall from './components/Snowfall';
import Sparkles from './components/Sparkles';
import ConfettiEffect from './components/ConfettiEffect';
import ProgressCircle from './components/ProgressCircle';
import GiftBoxes from './components/GiftBoxes';
import HolidayQuotes from './components/HolidayQuotes';
import SettingsPanel from './components/SettingsPanel';
import MusicPlayer from './components/MusicPlayer';
import MenuButton from './components/MenuButton';
import ChristmasTree from './components/ChristmasTree';
import GamesHub from './components/GamesHub';
import GiftPlanner from './components/GiftPlanner';
import MiniMode from './components/MiniMode';
import TrackSanta from './components/TrackSanta';
import ViewCodeModal from './components/ViewCodeModal';
import type { ColorTheme } from './lib/themes';
import { themes } from './lib/themes';
import { loadSettings, saveSettings } from './lib/storage';
import { registerServiceWorker, checkAndScheduleNotifications } from './lib/notifications';
import { ColorBlindFilters } from './lib/accessibility';
import { getSystemTimezone } from './lib/timezone';

export default function App() {
  const { t } = useTranslation();
  const settings = loadSettings();
  
  const [selectedYear, setSelectedYear] = useState(settings.selectedYear || new Date().getFullYear());
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>((settings.selectedTheme as ColorTheme) || 'classic');
  const [snowIntensity, setSnowIntensity] = useState(settings.snowIntensity ?? 50);
  const [musicVolume, setMusicVolume] = useState(settings.musicVolume ?? 50);
  const [customMusicUrl, setCustomMusicUrl] = useState(settings.customMusicUrl || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled ?? false);
  const [customNotificationMessages, setCustomNotificationMessages] = useState(
    settings.customNotificationMessages || {
      oneWeek: '',
      threeDays: '',
      oneDay: ''
    }
  );
  const [timezone, setTimezone] = useState(settings.timezone || 'auto');
  const [targetDate, setTargetDate] = useState(settings.targetDate || '');
  const [targetEventName, setTargetEventName] = useState(settings.targetEventName || '');
  const [miniMode, setMiniMode] = useState(settings.miniMode ?? false);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion ?? false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>(
    (settings.colorBlindMode as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') || 'none'
  );
  const [accessibilityMode, setAccessibilityMode] = useState(settings.accessibilityMode ?? false);
  const [highContrast, setHighContrast] = useState(settings.highContrast ?? false);
  const [largeText, setLargeText] = useState(settings.largeText ?? false);
  const [fontWeight, setFontWeight] = useState(settings.fontWeight ?? 400);
  const [lineSpacing, setLineSpacing] = useState(settings.lineSpacing ?? 1.5);
  const [dyslexiaFont, setDyslexiaFont] = useState(settings.dyslexiaFont ?? false);
  const [magnifierMode, setMagnifierMode] = useState(settings.magnifierMode ?? false);
  const [textToSpeech, setTextToSpeech] = useState(settings.textToSpeech ?? false);
  const [hapticFeedback, setHapticFeedback] = useState(settings.hapticFeedback ?? false);
  const [uiScale, setUiScale] = useState(settings.uiScale ?? 1);
  const [audioAlerts, setAudioAlerts] = useState(settings.audioAlerts ?? false);

  const [showSettings, setShowSettings] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showGiftPlanner, setShowGiftPlanner] = useState(false);
  const [showTrackSanta, setShowTrackSanta] = useState(false);
  const [showViewCode, setShowViewCode] = useState(false);
  const [isChristmas, setIsChristmas] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isChristmasEve, setIsChristmasEve] = useState(false);
  const [treeProgress, setTreeProgress] = useState(0);
  const [daysUntilChristmas, setDaysUntilChristmas] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const theme = themes[selectedTheme];
  const effectiveTimezone = timezone === 'auto' ? getSystemTimezone() : timezone;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    saveSettings({
      selectedYear,
      selectedTheme,
      snowIntensity,
      musicVolume,
      customMusicUrl,
      notificationsEnabled,
      customNotificationMessages,
      timezone,
      targetDate,
      targetEventName,
      miniMode,
      reducedMotion,
      colorBlindMode,
      accessibilityMode,
      highContrast,
      largeText,
      fontWeight,
      lineSpacing,
      dyslexiaFont,
      magnifierMode,
      textToSpeech,
      hapticFeedback,
      uiScale,
      audioAlerts,
    });
  }, [
    selectedYear, selectedTheme, snowIntensity, musicVolume, customMusicUrl, 
    notificationsEnabled, customNotificationMessages, timezone, targetDate,
    targetEventName, miniMode, reducedMotion, colorBlindMode, accessibilityMode,
    highContrast, largeText, fontWeight, lineSpacing, dyslexiaFont, magnifierMode,
    textToSpeech, hapticFeedback, uiScale, audioAlerts
  ]);

  useEffect(() => {
    const calculateDaysUntilChristmas = () => {
      const now = new Date();
      const christmas = new Date(selectedYear, 11, 25);
      const difference = christmas.getTime() - now.getTime();
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      setDaysUntilChristmas(days);
      
      checkAndScheduleNotifications(days, notificationsEnabled, customNotificationMessages);
    };

    calculateDaysUntilChristmas();
    const interval = setInterval(calculateDaysUntilChristmas, 60000);
    return () => clearInterval(interval);
  }, [selectedYear, notificationsEnabled, customNotificationMessages]);

  useEffect(() => {
    const checkChristmasEve = () => {
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();
      const hours = now.getHours();
      
      if (month === 11 && day >= 24) {
        setIsChristmasEve(true);
        
        if (day === 24 && hours === 0) {
          const totalSeconds = 3600;
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          const secondsElapsed = minutes * 60 + seconds;
          const progress = (secondsElapsed / totalSeconds) * 100;
          setTreeProgress(progress);
        } else if (day === 24 && hours > 0) {
          setTreeProgress(100);
        } else {
          setTreeProgress(100);
        }
      } else {
        setIsChristmasEve(false);
        setTreeProgress(0);
      }
    };

    checkChristmasEve();
    const eveTimer = setInterval(checkChristmasEve, 1000);

    return () => clearInterval(eveTimer);
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const appStyle: React.CSSProperties = {
    fontWeight: accessibilityMode ? fontWeight : undefined,
    lineHeight: accessibilityMode ? lineSpacing : undefined,
  };

  return (
    <div className="dark min-h-screen relative overflow-hidden" style={appStyle}>
      <ColorBlindFilters />
      <div
        className={`min-h-screen transition-all duration-1000 ${theme.gradient}`}
        style={{
          filter: colorBlindMode !== 'none' ? `url(#${colorBlindMode}-filter)` : undefined,
        }}
      >
        {!reducedMotion && snowIntensity > 0 && <Snowfall intensity={snowIntensity} theme={selectedTheme} />}
        {!reducedMotion && <Sparkles theme={selectedTheme} />}
        {isChristmas && !reducedMotion && <ConfettiEffect />}

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-white drop-shadow-lg`}>
                🎄 {t('app.title')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <MenuButton
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                onSettingsClick={() => setShowSettings(true)}
                onGamesClick={() => setShowGames(!showGames)}
                onGiftPlannerClick={() => setShowGiftPlanner(!showGiftPlanner)}
                onTrackSantaClick={() => setShowTrackSanta(!showTrackSanta)}
                onViewCodeClick={() => setShowViewCode(true)}
                isMobile={isMobile}
              />
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8">
            {showGames && !isMobile ? (
              <GamesHub daysUntilChristmas={daysUntilChristmas} />
            ) : showGiftPlanner && !isMobile ? (
              <div className="w-full max-w-6xl">
                <GiftPlanner />
              </div>
            ) : showTrackSanta && !isMobile ? (
              <div className="w-full max-w-7xl">
                <TrackSanta />
              </div>
            ) : (
              <>
                <HolidayQuotes />



                {isChristmasEve ? (
                  <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
                    {!isMobile && (
                      <div 
                        className="w-full lg:w-1/2 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setShowGames(false);
                          setShowGiftPlanner(false);
                        }}
                      >
                        <ChristmasTree progress={treeProgress} theme={selectedTheme} />
                      </div>
                    )}
                    <div className={`w-full ${isMobile ? '' : 'lg:w-1/2'}`}>
                      <CountdownTimer
                        selectedYear={selectedYear}
                        onChristmas={setIsChristmas}
                        theme={selectedTheme}
                        onYearChange={handleYearChange}
                        isMobile={isMobile}
                        timezone={effectiveTimezone}
                        targetDate={targetDate}
                        targetEventName={targetEventName}
                        textToSpeech={textToSpeech}
                        magnifierMode={magnifierMode}
                        hapticFeedback={hapticFeedback}
                        reducedMotion={reducedMotion}
                        largeText={largeText}
                        highContrast={highContrast}
                        fontWeight={fontWeight}
                        lineSpacing={lineSpacing}
                        dyslexiaFont={dyslexiaFont}
                        uiScale={uiScale}
                      />
                      {treeProgress > 0 && !isMobile && (
                        <div className="mt-4 text-center">
                          <p className="text-white text-lg font-semibold drop-shadow-lg">
                            🎄 Tree Decoration Progress: {Math.floor(treeProgress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`w-full max-w-6xl flex ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'} items-center justify-center gap-8`}>
                    {!isMobile && <ProgressCircle selectedYear={selectedYear} theme={selectedTheme} />}
                    <CountdownTimer
                      selectedYear={selectedYear}
                      onChristmas={setIsChristmas}
                      theme={selectedTheme}
                      onYearChange={handleYearChange}
                      isMobile={isMobile}
                      timezone={effectiveTimezone}
                      targetDate={targetDate}
                      targetEventName={targetEventName}
                      textToSpeech={textToSpeech}
                      magnifierMode={magnifierMode}
                      hapticFeedback={hapticFeedback}
                      reducedMotion={reducedMotion}
                      largeText={largeText}
                      highContrast={highContrast}
                      fontWeight={fontWeight}
                      lineSpacing={lineSpacing}
                      dyslexiaFont={dyslexiaFont}
                      uiScale={uiScale}
                    />
                  </div>
                )}

                {!isMobile && <GiftBoxes />}
              </>
            )}
          </main>

          <footer className="p-4 text-center text-white/80 text-sm">
            {t('app.footer') && <p>{t('app.footer')}</p>}
          </footer>
        </div>

        <SettingsPanel
          open={showSettings}
          onOpenChange={setShowSettings}
          snowIntensity={snowIntensity}
          onSnowIntensityChange={setSnowIntensity}
          musicVolume={musicVolume}
          onMusicVolumeChange={setMusicVolume}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          customMusicUrl={customMusicUrl}
          onCustomMusicUrlChange={setCustomMusicUrl}
          notificationsEnabled={notificationsEnabled}
          onNotificationsEnabledChange={setNotificationsEnabled}
          customNotificationMessages={customNotificationMessages}
          onCustomNotificationMessagesChange={setCustomNotificationMessages}
          timezone={timezone}
          onTimezoneChange={setTimezone}
          targetDate={targetDate}
          onTargetDateChange={setTargetDate}
          targetEventName={targetEventName}
          onTargetEventNameChange={setTargetEventName}
          miniMode={miniMode}
          onMiniModeChange={setMiniMode}
          reducedMotion={reducedMotion}
          onReducedMotionChange={setReducedMotion}
          colorBlindMode={colorBlindMode}
          onColorBlindModeChange={(mode) => setColorBlindMode(mode as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia')}
          accessibilityMode={accessibilityMode}
          onAccessibilityModeChange={setAccessibilityMode}
          highContrast={highContrast}
          onHighContrastChange={setHighContrast}
          largeText={largeText}
          onLargeTextChange={setLargeText}
          fontWeight={fontWeight}
          onFontWeightChange={setFontWeight}
          lineSpacing={lineSpacing}
          onLineSpacingChange={setLineSpacing}
          dyslexiaFont={dyslexiaFont}
          onDyslexiaFontChange={setDyslexiaFont}
          magnifierMode={magnifierMode}
          onMagnifierModeChange={setMagnifierMode}
          textToSpeech={textToSpeech}
          onTextToSpeechChange={setTextToSpeech}
          hapticFeedback={hapticFeedback}
          onHapticFeedbackChange={setHapticFeedback}
          uiScale={uiScale}
          onUiScaleChange={setUiScale}
          audioAlerts={audioAlerts}
          onAudioAlertsChange={setAudioAlerts}
        />

        {miniMode && (
          <MiniMode 
            selectedYear={selectedYear} 
            onToggle={() => setMiniMode(false)}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
          />
        )}

        <MusicPlayer 
          volume={musicVolume} 
          autoPlay={hasInteracted}
          customUrl={customMusicUrl || undefined}
        />

        <ViewCodeModal
          open={showViewCode}
          onOpenChange={setShowViewCode}
        />
      </div>
    </div>
  );
}
