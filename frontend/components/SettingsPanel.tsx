import { Settings, Volume2, Snowflake, Palette, Music, Globe, Calendar, Eye, Accessibility, Type, Maximize, Volume, Zap, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColorTheme } from '../lib/themes';
import NotificationSettings from './NotificationSettings';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { popularTimezones } from '../lib/timezone';
import { useState } from 'react';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snowIntensity: number;
  onSnowIntensityChange: (value: number) => void;
  musicVolume: number;
  onMusicVolumeChange: (value: number) => void;
  selectedTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  customMusicUrl: string;
  onCustomMusicUrlChange: (url: string) => void;
  notificationsEnabled: boolean;
  onNotificationsEnabledChange: (enabled: boolean) => void;
  customNotificationMessages: {
    oneWeek: string;
    threeDays: string;
    oneDay: string;
  };
  onCustomNotificationMessagesChange: (messages: { oneWeek: string; threeDays: string; oneDay: string }) => void;
  timezone?: string;
  onTimezoneChange?: (timezone: string) => void;
  targetDate?: string;
  onTargetDateChange?: (date: string) => void;
  targetEventName?: string;
  onTargetEventNameChange?: (name: string) => void;
  miniMode?: boolean;
  onMiniModeChange?: (enabled: boolean) => void;
  reducedMotion?: boolean;
  onReducedMotionChange?: (enabled: boolean) => void;
  colorBlindMode?: string;
  onColorBlindModeChange?: (mode: string) => void;
  accessibilityMode?: boolean;
  onAccessibilityModeChange?: (enabled: boolean) => void;
  highContrast?: boolean;
  onHighContrastChange?: (enabled: boolean) => void;
  largeText?: boolean;
  onLargeTextChange?: (enabled: boolean) => void;
  fontWeight?: number;
  onFontWeightChange?: (weight: number) => void;
  lineSpacing?: number;
  onLineSpacingChange?: (spacing: number) => void;
  dyslexiaFont?: boolean;
  onDyslexiaFontChange?: (enabled: boolean) => void;
  magnifierMode?: boolean;
  onMagnifierModeChange?: (enabled: boolean) => void;
  textToSpeech?: boolean;
  onTextToSpeechChange?: (enabled: boolean) => void;
  hapticFeedback?: boolean;
  onHapticFeedbackChange?: (enabled: boolean) => void;
  uiScale?: number;
  onUiScaleChange?: (scale: number) => void;
  audioAlerts?: boolean;
  onAudioAlertsChange?: (enabled: boolean) => void;
}

export default function SettingsPanel({
  open,
  onOpenChange,
  snowIntensity,
  onSnowIntensityChange,
  musicVolume,
  onMusicVolumeChange,
  selectedTheme,
  onThemeChange,
  customMusicUrl,
  onCustomMusicUrlChange,
  notificationsEnabled,
  onNotificationsEnabledChange,
  customNotificationMessages,
  onCustomNotificationMessagesChange,
  timezone,
  onTimezoneChange,
  targetDate,
  onTargetDateChange,
  targetEventName,
  onTargetEventNameChange,
  miniMode,
  onMiniModeChange,
  reducedMotion,
  onReducedMotionChange,
  colorBlindMode,
  onColorBlindModeChange,
  accessibilityMode,
  onAccessibilityModeChange,
  highContrast,
  onHighContrastChange,
  largeText,
  onLargeTextChange,
  fontWeight,
  onFontWeightChange,
  lineSpacing,
  onLineSpacingChange,
  dyslexiaFont,
  onDyslexiaFontChange,
  magnifierMode,
  onMagnifierModeChange,
  textToSpeech,
  onTextToSpeechChange,
  hapticFeedback,
  onHapticFeedbackChange,
  uiScale,
  onUiScaleChange,
  audioAlerts,
  onAudioAlertsChange,
}: SettingsPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'datetime' | 'accessibility' | 'display' | 'customdate'>('general');
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-background/95 backdrop-blur-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('settings.title')}
          </SheetTitle>
          <SheetDescription>
            {t('settings.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2 mt-4 border-b border-white/10 pb-2">
          <Button
            variant={activeTab === 'general' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('general')}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            General
          </Button>
          <Button
            variant={activeTab === 'datetime' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('datetime')}
            className="flex-1"
          >
            <CalendarClock className="w-4 h-4 mr-1" />
            Date
          </Button>
          <Button
            variant={activeTab === 'accessibility' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('accessibility')}
            className="flex-1"
          >
            <Accessibility className="w-4 h-4 mr-1" />
            A11y
          </Button>
          <Button
            variant={activeTab === 'customdate' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('customdate')}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Custom
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === 'general' && (
            <>
              <LanguageSelector />

          <div className="space-y-3">
            <Label className="flex items-center gap-2" htmlFor="theme-select">
              <Palette className="w-4 h-4" />
              {t('settings.colorTheme')}
            </Label>
            <Select value={selectedTheme} onValueChange={onThemeChange}>
              <SelectTrigger id="theme-select" aria-label={t('settings.colorTheme')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">{t('themes.classic')}</SelectItem>
                <SelectItem value="winter">{t('themes.winter')}</SelectItem>
                <SelectItem value="royal">{t('themes.royal')}</SelectItem>
                <SelectItem value="candy">{t('themes.candy')}</SelectItem>
                <SelectItem value="golden">{t('themes.golden')}</SelectItem>
                <SelectItem value="icy">{t('themes.icy')}</SelectItem>
                <SelectItem value="forest">{t('themes.forest')}</SelectItem>
                <SelectItem value="sunset">{t('themes.sunset')}</SelectItem>
                <SelectItem value="aurora">{t('themes.aurora')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2" htmlFor="snow-intensity">
              <Snowflake className="w-4 h-4" />
              {t('settings.snowIntensity')}
            </Label>
            <Slider
              id="snow-intensity"
              value={[snowIntensity]}
              onValueChange={(value) => onSnowIntensityChange(value[0])}
              max={100}
              step={10}
              className="w-full"
              aria-label={t('settings.snowIntensity')}
            />
            <div className="text-sm text-muted-foreground text-right">
              {snowIntensity}%
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2" htmlFor="music-volume">
              <Volume2 className="w-4 h-4" />
              {t('settings.musicVolume')}
            </Label>
            <Slider
              id="music-volume"
              value={[musicVolume]}
              onValueChange={(value) => onMusicVolumeChange(value[0])}
              max={100}
              step={10}
              className="w-full"
              aria-label={t('settings.musicVolume')}
            />
            <div className="text-sm text-muted-foreground text-right">
              {musicVolume}%
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2" htmlFor="custom-music">
              <Music className="w-4 h-4" />
              {t('settings.customMusic')}
            </Label>
            <input
              id="custom-music"
              type="url"
              value={customMusicUrl}
              onChange={(e) => onCustomMusicUrlChange(e.target.value)}
              placeholder={t('settings.customMusicPlaceholder')}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              aria-label={t('settings.customMusic')}
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.customMusicHelp')}
            </p>
          </div>

          <NotificationSettings
            enabled={notificationsEnabled}
            onEnabledChange={onNotificationsEnabledChange}
            customMessages={customNotificationMessages}
            onCustomMessagesChange={onCustomNotificationMessagesChange}
          />

          {onMiniModeChange && (
            <div className="flex items-center justify-between">
              <Label htmlFor="mini-mode">Mini Mode Widget</Label>
              <Switch
                id="mini-mode"
                checked={miniMode}
                onCheckedChange={onMiniModeChange}
              />
            </div>
          )}
            </>
          )}

          {activeTab === 'datetime' && (
            <div className="space-y-6">
              {onTimezoneChange && (
                <div className="space-y-3 mb-4">
                  <Label className="flex items-center gap-2" htmlFor="timezone-select">
                    <Globe className="w-4 h-4" />
                    Timezone
                  </Label>
                  <Select value={timezone || 'auto'} onValueChange={onTimezoneChange}>
                    <SelectTrigger id="timezone-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      {popularTimezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {onTargetDateChange && (
                <div className="space-y-3 mb-4">
                  <Label htmlFor="target-date">Custom Target Date</Label>
                  <input
                    id="target-date"
                    type="date"
                    value={targetDate || ''}
                    onChange={(e) => onTargetDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>
              )}

              {onTargetEventNameChange && (
                <div className="space-y-3">
                  <Label htmlFor="event-name">Event Name</Label>
                  <input
                    id="event-name"
                    type="text"
                    value={targetEventName || ''}
                    onChange={(e) => onTargetEventNameChange(e.target.value)}
                    placeholder="e.g., Birthday, New Year"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              {onAccessibilityModeChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="accessibility-mode" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Accessibility Mode
                </Label>
                <Switch
                  id="accessibility-mode"
                  checked={accessibilityMode}
                  onCheckedChange={onAccessibilityModeChange}
                />
              </div>
            )}

            {onHighContrastChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={onHighContrastChange}
                />
              </div>
            )}

            {onLargeTextChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="large-text">Large Text</Label>
                <Switch
                  id="large-text"
                  checked={largeText}
                  onCheckedChange={onLargeTextChange}
                />
              </div>
            )}

            {onFontWeightChange && (
              <div className="space-y-3 mb-4">
                <Label htmlFor="font-weight" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Weight
                </Label>
                <Slider
                  id="font-weight"
                  value={[fontWeight || 400]}
                  onValueChange={(value) => onFontWeightChange(value[0])}
                  min={300}
                  max={700}
                  step={100}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {fontWeight || 400}
                </div>
              </div>
            )}

            {onLineSpacingChange && (
              <div className="space-y-3 mb-4">
                <Label htmlFor="line-spacing">Line Spacing</Label>
                <Slider
                  id="line-spacing"
                  value={[lineSpacing || 1.5]}
                  onValueChange={(value) => onLineSpacingChange(value[0])}
                  min={1}
                  max={2.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {(lineSpacing || 1.5).toFixed(1)}
                </div>
              </div>
            )}

            {onDyslexiaFontChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                <Switch
                  id="dyslexia-font"
                  checked={dyslexiaFont}
                  onCheckedChange={onDyslexiaFontChange}
                />
              </div>
            )}

            {onMagnifierModeChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="magnifier-mode" className="flex items-center gap-2">
                  <Maximize className="w-4 h-4" />
                  Magnifier Mode
                </Label>
                <Switch
                  id="magnifier-mode"
                  checked={magnifierMode}
                  onCheckedChange={onMagnifierModeChange}
                />
              </div>
            )}

            {onTextToSpeechChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="text-to-speech" className="flex items-center gap-2">
                  <Volume className="w-4 h-4" />
                  Text-to-Speech
                </Label>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeech}
                  onCheckedChange={onTextToSpeechChange}
                />
              </div>
            )}

            {onColorBlindModeChange && (
              <div className="space-y-3 mb-4">
                <Label htmlFor="colorblind-mode">Color Blind Mode</Label>
                <Select value={colorBlindMode || 'none'} onValueChange={onColorBlindModeChange}>
                  <SelectTrigger id="colorblind-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {onHapticFeedbackChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="haptic-feedback" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Haptic Feedback
                </Label>
                <Switch
                  id="haptic-feedback"
                  checked={hapticFeedback}
                  onCheckedChange={onHapticFeedbackChange}
                />
              </div>
            )}

            {onAudioAlertsChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="audio-alerts">Audio Alerts</Label>
                <Switch
                  id="audio-alerts"
                  checked={audioAlerts}
                  onCheckedChange={onAudioAlertsChange}
                />
              </div>
            )}
            </div>
          )}

          {activeTab === 'customdate' && (
            <div className="space-y-6">
              {onTargetDateChange && (
                <div className="space-y-3 mb-4">
                  <Label htmlFor="custom-target-date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Custom Target Date
                  </Label>
                  <input
                    id="custom-target-date"
                    type="date"
                    value={targetDate || ''}
                    onChange={(e) => onTargetDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>
              )}

              {onTargetEventNameChange && (
                <div className="space-y-3">
                  <Label htmlFor="custom-event-name">Event Name</Label>
                  <input
                    id="custom-event-name"
                    type="text"
                    value={targetEventName || ''}
                    onChange={(e) => onTargetEventNameChange(e.target.value)}
                    placeholder="e.g., Birthday, New Year, Vacation"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set a custom date to countdown to any event, not just Christmas!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              {onReducedMotionChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={onReducedMotionChange}
                />
              </div>
            )}

            {onMiniModeChange && (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="mini-mode">Mini Mode Widget</Label>
                <Switch
                  id="mini-mode"
                  checked={miniMode}
                  onCheckedChange={onMiniModeChange}
                />
              </div>
            )}

            {onUiScaleChange && (
              <div className="space-y-3">
                <Label htmlFor="ui-scale">UI Scale</Label>
                <Slider
                  id="ui-scale"
                  value={[uiScale || 1]}
                  onValueChange={(value) => onUiScaleChange(value[0])}
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {((uiScale || 1) * 100).toFixed(0)}%
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
