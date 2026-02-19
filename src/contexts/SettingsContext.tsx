import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n/translations';

export interface AppSettings {
  language: Language;
  defaultUnit: 'mm' | 'in' | 'cm';
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  pdfLogoVisible: boolean;
  compactCards: boolean;
  defaultPineType: 'pine100' | 'combiPine' | 'combiEuca';
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'pt',
  defaultUnit: 'mm',
  dateFormat: 'dd/mm/yyyy',
  pdfLogoVisible: true,
  compactCards: false,
  defaultPineType: 'pine100',
};

export const SETTINGS_KEY = 'phv_settings';

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  saveSettings: (s: AppSettings) => void;
  t: (key: TranslationKey) => string;
  formatDate: (dateStr: string) => string;
  formatDisplayDate: (date: Date) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const saveSettings = (s: AppSettings) => {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  /** Translate a UI key to the current language */
  const t = (key: TranslationKey): string => {
    return translations[settings.language][key] ?? key;
  };

  /**
   * Format a yyyy-mm-dd string according to the configured date format.
   * If the string is already not in yyyy-mm-dd, returns as-is.
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return dateStr;
    const [, y, m, d] = match;
    switch (settings.dateFormat) {
      case 'dd/mm/yyyy': return `${d}/${m}/${y}`;
      case 'mm/dd/yyyy': return `${m}/${d}/${y}`;
      case 'yyyy-mm-dd': return `${y}-${m}-${d}`;
      default:           return `${d}/${m}/${y}`;
    }
  };

  /** Format a JS Date object according to the configured date format */
  const formatDisplayDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return formatDate(`${y}-${m}-${d}`);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, saveSettings, t, formatDate, formatDisplayDate }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
};
