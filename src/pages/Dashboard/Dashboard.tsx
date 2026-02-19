import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiPlus, HiDownload, HiCog,
  HiLocationMarker, HiCalendar, HiChartBar, HiArrowRight,
  HiDocumentText, HiClipboardList, HiArrowNarrowRight,
} from "react-icons/hi";
import Header from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../contexts/SettingsContext";
import { getUserReports, type InspectionReport } from "../../services/reportService";
import "./Dashboard.css";

/* ── helpers ────────────────────────────────────────────────────────────── */
const getLast6Months = (locale: string) => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      label: d.toLocaleDateString(locale, { month: 'short' })
               .replace('.', '').replace(/^\w/, c => c.toUpperCase()),
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });
};

/* ── component ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t, formatDate, settings } = useSettings();

  const locale = settings.language === 'en' ? 'en-US' : 'pt-BR';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('goodMorning');
    if (h < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const todayLabel = () =>
    new Date().toLocaleDateString(locale, {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getUserReports(currentUser.uid)
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const total = reports.length;

  /* bar chart – last 6 months */
  const months6 = getLast6Months(locale);
  const barData = months6.map(({ label, year, month }) => ({
    label,
    count: reports.filter(r => {
      if (!r.createdAt?.toDate) return false;
      const d = r.createdAt.toDate();
      return d.getFullYear() === year && d.getMonth() === month;
    }).length,
  }));
  const barMax = Math.max(...barData.map(d => d.count), 1);

  /* recent reports */
  const recent = [...reports]
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
    .slice(0, 5);

  /* top suppliers */
  const supplierMap: Record<string, number> = {};
  reports.forEach(r => {
    supplierMap[r.millSupplier] = (supplierMap[r.millSupplier] || 0) + 1;
  });
  const topSuppliers = Object.entries(supplierMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const firstName = currentUser?.displayName?.split(" ")[0]
    || currentUser?.email?.split("@")[0]
    || "Usuário";

  /* view-reports description */
  const viewDesc = loading
    ? t('loading')
    : total === 0
      ? t('dash_viewDesc_zero')
      : `${total} ${total === 1 ? t('dash_viewDesc_one') : t('dash_viewDesc_many')}`;

  return (
    <div className="dashboard-layout">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="dashboard-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="dashboard">
          <div className="dashboard__container">

            {/* ── Welcome banner ───────────────────────────────────── */}
            <div className="dash-welcome">
              <div className="dash-welcome__text">
                <h1 className="dash-welcome__title">
                  {greeting()}, <span>{firstName}!</span>
                </h1>
                <p className="dash-welcome__date">{todayLabel()}</p>
              </div>
              <button className="dash-welcome__cta" onClick={() => navigate("/auditoria/new")}>
                <HiPlus size={18} />
                {t('dash_newReport')}
              </button>
            </div>

            {/* ── Quick action cards ───────────────────────────────── */}
            <div className="dash-actions-grid">

              <button className="dash-action-card dash-action-card--new" onClick={() => navigate("/auditoria/new")}>
                <div className="dash-action-card__bg" />
                <div className="dash-action-card__icon-wrap">
                  <HiPlus size={28} />
                </div>
                <div className="dash-action-card__body">
                  <span className="dash-action-card__title">{t('dash_newReport')}</span>
                  <span className="dash-action-card__desc">{t('dash_newDesc')}</span>
                </div>
                <HiArrowNarrowRight className="dash-action-card__arrow" size={20} />
              </button>

              <button className="dash-action-card dash-action-card--list" onClick={() => navigate("/auditoria")}>
                <div className="dash-action-card__bg" />
                <div className="dash-action-card__icon-wrap">
                  <HiClipboardList size={28} />
                </div>
                <div className="dash-action-card__body">
                  <span className="dash-action-card__title">{t('dash_viewReports')}</span>
                  <span className="dash-action-card__desc">{viewDesc}</span>
                </div>
                <HiArrowNarrowRight className="dash-action-card__arrow" size={20} />
              </button>

              <button className="dash-action-card dash-action-card--pdf" onClick={() => navigate("/auditoria?highlight=pdf")}>
                <div className="dash-action-card__bg" />
                <div className="dash-action-card__icon-wrap">
                  <HiDownload size={28} />
                </div>
                <div className="dash-action-card__body">
                  <span className="dash-action-card__title">{t('dash_exportPDF')}</span>
                  <span className="dash-action-card__desc">{t('dash_exportDesc')}</span>
                </div>
                <HiArrowNarrowRight className="dash-action-card__arrow" size={20} />
              </button>

              <button className="dash-action-card dash-action-card--settings" onClick={() => navigate("/configuracoes")}>
                <div className="dash-action-card__bg" />
                <div className="dash-action-card__icon-wrap">
                  <HiCog size={28} />
                </div>
                <div className="dash-action-card__body">
                  <span className="dash-action-card__title">{t('dash_settings')}</span>
                  <span className="dash-action-card__desc">{t('dash_settingsDesc')}</span>
                </div>
                <HiArrowNarrowRight className="dash-action-card__arrow" size={20} />
              </button>

            </div>

            {/* ── Bar chart ────────────────────────────────────────── */}
            <div className="dash-card dash-card--bar">
              <div className="dash-card__header">
                <div>
                  <h3 className="dash-card__title">{t('dash_chartTitle')}</h3>
                  <p className="dash-card__sub">{t('dash_chartSub')}</p>
                </div>
                <HiChartBar className="dash-card__icon" size={20} />
              </div>
              <div className="dash-bar-chart">
                {barData.map((d, i) => (
                  <div key={i} className="dash-bar-col">
                    <span className="dash-bar-value">{d.count > 0 ? d.count : ""}</span>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill"
                        style={{ height: `${Math.max((d.count / barMax) * 100, d.count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                    <span className="dash-bar-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom row ───────────────────────────────────────── */}
            <div className="dash-bottom">

              {/* Recent reports */}
              <div className="dash-card dash-card--recent">
                <div className="dash-card__header">
                  <div>
                    <h3 className="dash-card__title">{t('dash_recentTitle')}</h3>
                    <p className="dash-card__sub">{t('dash_recentSub')}</p>
                  </div>
                  <button className="dash-see-all" onClick={() => navigate("/auditoria")}>
                    {t('dash_viewAll')} <HiArrowRight size={14} />
                  </button>
                </div>

                {loading ? (
                  <div className="dash-loading">{t('loading')}</div>
                ) : recent.length === 0 ? (
                  <div className="dash-empty">
                    <HiDocumentText size={32} />
                    <p>{t('dash_noReports')}</p>
                    <button onClick={() => navigate("/auditoria/new")}>{t('dash_createFirst')}</button>
                  </div>
                ) : (
                  <div className="dash-report-list">
                    {recent.map(rep => (
                      <div
                        key={rep.id}
                        className="dash-report-item"
                        onClick={() => rep.id && navigate(`/auditoria/${rep.id}`)}
                      >
                        <div className="dash-report-status-dot" />
                        <div className="dash-report-info">
                          <span className="dash-report-name">{rep.itemInspected}</span>
                          <span className="dash-report-meta">
                            <HiLocationMarker size={11} /> {rep.location}
                            &nbsp;·&nbsp;
                            <HiCalendar size={11} /> {formatDate(rep.inspectionDate)}
                          </span>
                        </div>
                        <HiArrowRight size={14} className="dash-report-arrow" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="dash-right-col">

                {/* Top suppliers */}
                <div className="dash-card dash-card--suppliers">
                  <div className="dash-card__header">
                    <div>
                      <h3 className="dash-card__title">{t('dash_suppliersTitle')}</h3>
                      <p className="dash-card__sub">{t('dash_suppliersSub')}</p>
                    </div>
                  </div>
                  {topSuppliers.length === 0 ? (
                    <div className="dash-empty dash-empty--sm">{t('dash_noData')}</div>
                  ) : (
                    <div className="dash-supplier-list">
                      {topSuppliers.map(([name, count], i) => (
                        <div key={name} className="dash-supplier-item">
                          <span className="dash-supplier-rank">#{i + 1}</span>
                          <span className="dash-supplier-name">{name}</span>
                          <div className="dash-supplier-bar-wrap">
                            <div
                              className="dash-supplier-bar"
                              style={{ width: `${(count / (topSuppliers[0][1])) * 100}%` }}
                            />
                          </div>
                          <span className="dash-supplier-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
