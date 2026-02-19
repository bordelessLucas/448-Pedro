import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import {
  HiCog,
  HiDocumentText,
  HiInformationCircle,
  HiCheckCircle,
  HiTranslate,
  HiTemplate,
  HiCollection,
  HiRefresh,
} from 'react-icons/hi';
import { useSettings, DEFAULT_SETTINGS, type AppSettings } from '../../contexts/SettingsContext';
import './Settings.css';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { settings, updateSetting, saveSettings, t } = useSettings();
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSetting(key, value);
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm(t('set_resetConfirm'))) {
      saveSettings(DEFAULT_SETTINGS);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="settings-layout">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="settings-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="settings-main">
          <div className="settings-container">

            {/* Page header */}
            <div className="settings-page-header">
              <div>
                <h1 className="settings-page-title">{t('set_title')}</h1>
                <p className="settings-page-subtitle">{t('set_subtitle')}</p>
              </div>
              <div className="settings-header-actions">
                <Button variant="outline" size="medium" icon={<HiRefresh />} iconPosition="left" onClick={handleReset}>
                  {t('set_resetBtn')}
                </Button>
                <Button variant="primary" size="medium" icon={<HiCheckCircle />} iconPosition="left" onClick={handleSave}>
                  {t('set_saveBtn')}
                </Button>
              </div>
            </div>

            {saved && (
              <div className="settings-toast">
                <HiCheckCircle /> {t('set_saved')}
              </div>
            )}

            <div className="settings-grid">

              {/* ── Geral ───────────────────────────────────────────────── */}
              <div className="settings-card">
                <div className="settings-card__header">
                  <HiCog className="settings-card__icon" />
                  <h3 className="settings-card__title">{t('set_general')}</h3>
                </div>

                <div className="settings-section">
                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiTranslate className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_language')}</span>
                        <span className="settings-row__desc">{t('set_languageDesc')}</span>
                      </div>
                    </div>
                    <select
                      className="settings-select"
                      value={settings.language}
                      onChange={e => set('language', e.target.value as AppSettings['language'])}
                    >
                      <option value="pt">Português (BR)</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiTemplate className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_dateFormat')}</span>
                        <span className="settings-row__desc">{t('set_dateFormatDesc')}</span>
                      </div>
                    </div>
                    <select
                      className="settings-select"
                      value={settings.dateFormat}
                      onChange={e => set('dateFormat', e.target.value as AppSettings['dateFormat'])}
                    >
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiCollection className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_compactCards')}</span>
                        <span className="settings-row__desc">{t('set_compactDesc')}</span>
                      </div>
                    </div>
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settings.compactCards}
                        onChange={e => set('compactCards', e.target.checked)}
                      />
                      <span className="settings-toggle__slider" />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Relatórios ──────────────────────────────────────────── */}
              <div className="settings-card">
                <div className="settings-card__header">
                  <HiDocumentText className="settings-card__icon" />
                  <h3 className="settings-card__title">{t('set_reports')}</h3>
                </div>

                <div className="settings-section">
                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiTemplate className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_defaultUnit')}</span>
                        <span className="settings-row__desc">{t('set_unitDesc')}</span>
                      </div>
                    </div>
                    <select
                      className="settings-select"
                      value={settings.defaultUnit}
                      onChange={e => set('defaultUnit', e.target.value as AppSettings['defaultUnit'])}
                    >
                      <option value="mm">Millimeters (mm)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                    </select>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiCollection className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_defaultPine')}</span>
                        <span className="settings-row__desc">{t('set_pineDesc')}</span>
                      </div>
                    </div>
                    <select
                      className="settings-select"
                      value={settings.defaultPineType}
                      onChange={e => set('defaultPineType', e.target.value as AppSettings['defaultPineType'])}
                    >
                      <option value="pine100">Pine 100%</option>
                      <option value="combiPine">Combi Pine</option>
                      <option value="combiEuca">Combi Euca</option>
                    </select>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-row">
                    <div className="settings-row__info">
                      <HiDocumentText className="settings-row__icon" />
                      <div>
                        <span className="settings-row__label">{t('set_pdfLogo')}</span>
                        <span className="settings-row__desc">{t('set_pdfLogoDesc')}</span>
                      </div>
                    </div>
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settings.pdfLogoVisible}
                        onChange={e => set('pdfLogoVisible', e.target.checked)}
                      />
                      <span className="settings-toggle__slider" />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Sobre ───────────────────────────────────────────────── */}
              <div className="settings-card settings-card--full">
                <div className="settings-card__header">
                  <HiInformationCircle className="settings-card__icon" />
                  <h3 className="settings-card__title">{t('set_about')}</h3>
                </div>

                <div className="settings-about-grid">
                  <div className="settings-about-item">
                    <span className="settings-about-label">
                      {settings.language === 'en' ? 'Application' : 'Aplicação'}
                    </span>
                    <span className="settings-about-value">PHV Inspection System</span>
                  </div>
                  <div className="settings-about-item">
                    <span className="settings-about-label">{settings.language === 'en' ? 'Version' : 'Versão'}</span>
                    <span className="settings-about-value">
                      <span className="settings-badge">v1.0.0</span>
                    </span>
                  </div>
                  <div className="settings-about-item">
                    <span className="settings-about-label">Website</span>
                    <span className="settings-about-value">
                      <a href="https://phvbr.com" target="_blank" rel="noreferrer" className="settings-link">
                        phvbr.com
                      </a>
                    </span>
                  </div>
                  <div className="settings-about-item">
                    <span className="settings-about-label">{settings.language === 'en' ? 'Technology' : 'Tecnologia'}</span>
                    <span className="settings-about-value">React + Firebase</span>
                  </div>
                  <div className="settings-about-item">
                    <span className="settings-about-label">{settings.language === 'en' ? 'Environment' : 'Ambiente'}</span>
                    <span className="settings-about-value">
                      <span className="settings-badge settings-badge--green">
                        {settings.language === 'en' ? 'Production' : 'Produção'}
                      </span>
                    </span>
                  </div>
                  <div className="settings-about-item">
                    <span className="settings-about-label">{settings.language === 'en' ? 'Support' : 'Suporte'}</span>
                    <span className="settings-about-value">
                      <button className="settings-link" onClick={() => navigate(-1)}>
                        {settings.language === 'en' ? 'Go back' : 'Voltar'}
                      </button>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
