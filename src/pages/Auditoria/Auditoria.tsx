import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import {
  HiPlus, HiDocumentText, HiCalendar, HiLocationMarker,
  HiPencil, HiTrash, HiDownload, HiSearch, HiOfficeBuilding,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../contexts/SettingsContext';
import { getUserReports, deleteReport, type InspectionReport } from '../../services/reportService';
import { generateReportPDF } from '../../services/pdfService';
import './Auditoria.css';

const PINE_LABELS: Record<string, string> = {
  pine100:   'Pine 100%',
  combiPine: 'Combi Pine',
  combiEuca: 'Combi Euca',
};

export default function Auditoria() {
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [reports, setReports]               = useState<InspectionReport[]>([]);
  const [loading, setLoading]               = useState(true);
  const [deletingId, setDeletingId]         = useState<string | null>(null);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);
  const [search, setSearch]                 = useState('');
  const [dateFilter, setDateFilter]         = useState('');

  const navigate        = useNavigate();
  const location        = useLocation();
  const { currentUser } = useAuth();
  const { t, formatDate, formatDisplayDate, settings } = useSettings();

  const highlightPdf = new URLSearchParams(location.search).get('highlight') === 'pdf';

  useEffect(() => {
    if (!currentUser) return;
    getUserReports(currentUser.uid)
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  /* ── actions ── */
  const handleViewReport = (id: string) => navigate(`/auditoria/${id}`);

  const handleEditReport = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/auditoria/${id}/edit`);
  };

  const handleExportPDF = async (e: React.MouseEvent, report: InspectionReport) => {
    e.stopPropagation();
    if (!report.id) return;
    setExportingPdfId(report.id);
    try { await generateReportPDF(report); }
    catch { alert('Error generating PDF. Please try again.'); }
    finally { setExportingPdfId(null); }
  };

  const handleDeleteReport = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!id) return;
    const msg = settings.language === 'en'
      ? 'Are you sure you want to delete this report? This action cannot be undone.'
      : 'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.';
    if (!window.confirm(msg)) return;
    setDeletingId(id);
    try {
      await deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch { alert(settings.language === 'en' ? 'Error deleting report.' : 'Erro ao excluir relatório.'); }
    finally { setDeletingId(null); }
  };

  /* ── filtered list ── */
  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const createdDate = r.createdAt?.toDate
      ? formatDisplayDate(r.createdAt.toDate())
      : '';
    const matchText =
      !q ||
      r.itemInspected.toLowerCase().includes(q) ||
      r.orderNumber.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.millSupplier.toLowerCase().includes(q) ||
      formatDate(r.inspectionDate).includes(q) ||
      r.inspectionDate.includes(q) ||
      createdDate.includes(q);

    // dateFilter is always yyyy-mm-dd (from <input type="date">)
    const matchDate = !dateFilter || r.inspectionDate === dateFilter ||
      formatDate(r.inspectionDate) === formatDate(dateFilter);

    return matchText && matchDate;
  });

  const resultsLabel = filtered.length === 1
    ? `1 ${t('aud_results_one')}`
    : `${filtered.length} ${t('aud_results_many')}`;

  return (
    <div className="auditoria-layout">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="auditoria-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="auditoria">
          <div className="auditoria__container">

            {/* ── Page header ── */}
            <div className="aud-hero">
              <div className="aud-hero__text">
                <h1 className="aud-hero__title">{t('aud_title')}</h1>
                <p className="aud-hero__sub">{t('aud_subtitle')}</p>
              </div>
              <button className="aud-hero__cta" onClick={() => navigate('/auditoria/new')}>
                <HiPlus size={18} /> {t('aud_newReport')}
              </button>
            </div>

            {/* ── Search bar ── */}
            <div className="aud-toolbar">
              <div className="aud-search">
                <HiSearch className="aud-search__icon" size={16} />
                <input
                  type="text"
                  className="aud-search__input"
                  placeholder={t('aud_searchPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="aud-date-filter">
                <HiCalendar className="aud-date-filter__icon" size={15} />
                <input
                  type="date"
                  className="aud-date-filter__input"
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  title={t('aud_dateFilterTitle')}
                />
                {dateFilter && (
                  <button
                    className="aud-date-filter__clear"
                    onClick={() => setDateFilter('')}
                    title="×"
                  >×</button>
                )}
              </div>
              {(search || dateFilter) && (
                <span className="aud-results">{resultsLabel}</span>
              )}
            </div>

            {/* ── Content ── */}
            {loading ? (
              <div className="aud-skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="aud-skeleton-card">
                    <div className="aud-skeleton-line aud-skeleton-line--short" />
                    <div className="aud-skeleton-line" />
                    <div className="aud-skeleton-line aud-skeleton-line--med" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="aud-empty">
                <div className="aud-empty__icon"><HiDocumentText size={40} /></div>
                <h3>{reports.length === 0 ? t('aud_emptyTitle') : t('aud_noResultTitle')}</h3>
                <p>
                  {reports.length === 0 ? t('aud_emptyDesc') : t('aud_noResultDesc')}
                </p>
                {reports.length === 0 && (
                  <button className="aud-empty__btn" onClick={() => navigate('/auditoria/new')}>
                    <HiPlus size={16} /> {t('aud_createFirstBtn')}
                  </button>
                )}
              </div>
            ) : (
              <div className="aud-grid">
                {filtered.map(report => (
                  <div
                    key={report.id}
                    className="aud-card"
                    onClick={() => report.id && handleViewReport(report.id)}
                  >
                    <div className="aud-card__accent" />

                    <div className="aud-card__head">
                      <div className="aud-card__icon-wrap">
                        <HiDocumentText size={20} />
                      </div>
                      <div className="aud-card__head-right">
                        <span className="aud-card__date-badge">
                          <HiCalendar size={12} />
                          {formatDate(report.inspectionDate)}
                        </span>
                        <span className="aud-card__order">Order {report.orderNumber}</span>
                      </div>
                    </div>

                    <div className="aud-card__body">
                      <h3 className="aud-card__title">{report.itemInspected}</h3>

                      <div className="aud-card__meta">
                        <div className="aud-card__meta-item">
                          <HiLocationMarker size={13} />
                          <span>{report.location}</span>
                        </div>
                        <div className="aud-card__meta-item">
                          <HiOfficeBuilding size={13} />
                          <span>{report.millSupplier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="aud-card__pine">
                      {PINE_LABELS[report.pineType] || report.pineType}
                    </div>

                    <div className="aud-card__footer">
                      <span className="aud-card__date">
                        {t('aud_createdOn')} {report.createdAt?.toDate
                          ? formatDisplayDate(report.createdAt.toDate())
                          : 'N/A'}
                      </span>
                      <div className="aud-card__actions" onClick={e => e.stopPropagation()}>
                        <button
                          className={`aud-action aud-action--pdf${highlightPdf ? ' aud-action--pdf-glow' : ''}`}
                          onClick={e => handleExportPDF(e, report)}
                          disabled={exportingPdfId === report.id}
                          title={t('aud_exportPDF')}
                        >
                          {exportingPdfId === report.id
                            ? <span className="aud-spinner" />
                            : <HiDownload size={15} />}
                        </button>
                        <button
                          className="aud-action aud-action--edit"
                          onClick={e => report.id && handleEditReport(e, report.id)}
                          title={t('aud_editReport')}
                        >
                          <HiPencil size={15} />
                        </button>
                        <button
                          className="aud-action aud-action--delete"
                          onClick={e => report.id && handleDeleteReport(e, report.id)}
                          disabled={deletingId === report.id}
                          title={t('aud_deleteReport')}
                        >
                          {deletingId === report.id
                            ? <span className="aud-spinner" />
                            : <HiTrash size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
