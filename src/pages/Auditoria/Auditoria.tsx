import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import { HiPlus, HiDocumentText, HiCalendar, HiLocationMarker, HiCheckCircle, HiXCircle, HiClock, HiPencil, HiTrash, HiDownload } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { getUserReports, deleteReport, type InspectionReport } from '../../services/reportService';
import { generateReportPDF } from '../../services/pdfService';
import './Auditoria.css';

export default function Auditoria() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadReports = async () => {
      if (!currentUser) return;
      
      try {
        const userReports = await getUserReports(currentUser.uid);
        setReports(userReports);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [currentUser]);

  const handleCreateReport = () => {
    navigate('/auditoria/new');
  };

  const handleViewReport = (id: string) => {
    navigate(`/auditoria/${id}`);
  };

  const handleEditReport = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevenir que o card seja clicado
    navigate(`/auditoria/${id}/edit`);
  };

  const handleExportPDF = async (e: React.MouseEvent, report: InspectionReport) => {
    e.stopPropagation();
    if (!report.id) return;
    setExportingPdfId(report.id);
    try {
      await generateReportPDF(report);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setExportingPdfId(null);
    }
  };

  const handleDeleteReport = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevenir que o card seja clicado
    
    if (!id) return;
    
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.'
    );
    
    if (!confirmed) return;
    
    setDeletingId(id);
    
    try {
      await deleteReport(id);
      // Remover o relatório da lista local
      setReports(reports.filter(report => report.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Erro ao excluir relatório. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <HiCheckCircle />;
      case 'rejected':
        return <HiXCircle />;
      case 'pending':
        return <HiClock />;
      default:
        return <HiDocumentText />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="auditoria-layout">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="auditoria-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="auditoria">
          <div className="auditoria__header">
            <div>
              <h1 className="auditoria__title">Relatórios de Inspeção</h1>
              <p className="auditoria__subtitle">Gerencie e crie relatórios de inspeção em campo</p>
            </div>
            <Button
              variant="primary"
              size="medium"
              icon={<HiPlus />}
              iconPosition="left"
              onClick={handleCreateReport}
            >
              Novo Relatório
            </Button>
          </div>

          <div className="auditoria__content">
            {loading ? (
              <div className="auditoria__loading">
                <p>Carregando relatórios...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="auditoria__empty">
                <HiDocumentText />
                <h3>Nenhum relatório ainda</h3>
                <p>Crie seu primeiro relatório de inspeção para começar</p>
                <Button
                  variant="primary"
                  size="medium"
                  icon={<HiPlus />}
                  iconPosition="left"
                  onClick={handleCreateReport}
                >
                  Criar Primeiro Relatório
                </Button>
              </div>
            ) : (
              <div className="reports-grid">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="report-card"
                    onClick={() => report.id && handleViewReport(report.id)}
                  >
                    <div className="report-card__header">
                      <div className="report-card__icon">
                        <HiDocumentText />
                      </div>
                      <div className={`report-card__status report-card__status--${report.status}`}>
                        {getStatusIcon(report.status)}
                        <span>{getStatusText(report.status)}</span>
                      </div>
                    </div>

                    <div className="report-card__body">
                      <h3 className="report-card__title">{report.itemInspected}</h3>
                      
                      <div className="report-card__info">
                        <div className="report-card__info-item">
                          <HiDocumentText />
                          <span>Order: {report.orderNumber}</span>
                        </div>
                        <div className="report-card__info-item">
                          <HiCalendar />
                          <span>{report.inspectionDate}</span>
                        </div>
                        <div className="report-card__info-item">
                          <HiLocationMarker />
                          <span>{report.location}</span>
                        </div>
                      </div>

                      <div className="report-card__supplier">
                        <strong>Supplier:</strong> {report.millSupplier}
                      </div>
                    </div>

                    <div className="report-card__footer">
                      <span className="report-card__date">
                        Criado em {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString('pt-BR') : 'N/A'}
                      </span>
                      <div className="report-card__actions">
                        <button
                          className="report-card__action report-card__action--pdf"
                          onClick={(e) => handleExportPDF(e, report)}
                          disabled={exportingPdfId === report.id}
                          title="Exportar como PDF"
                        >
                          {exportingPdfId === report.id ? (
                            <span className="spinner"></span>
                          ) : (
                            <HiDownload />
                          )}
                        </button>
                        <button
                          className="report-card__action report-card__action--edit"
                          onClick={(e) => report.id && handleEditReport(e, report.id)}
                          title="Editar relatório"
                        >
                          <HiPencil />
                        </button>
                        <button
                          className="report-card__action report-card__action--delete"
                          onClick={(e) => report.id && handleDeleteReport(e, report.id)}
                          disabled={deletingId === report.id}
                          title="Excluir relatório"
                        >
                          {deletingId === report.id ? (
                            <span className="spinner"></span>
                          ) : (
                            <HiTrash />
                          )}
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
