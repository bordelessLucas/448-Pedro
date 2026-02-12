import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiDocumentReport,
  HiPlus,
  HiDownload,
  HiShare,
  HiChartBar,
  HiCog
} from "react-icons/hi";
import Header from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import Button from "../../components/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGoToReports = () => {
    navigate('/auditoria');
  };

  const handleCreateReport = () => {
    navigate('/auditoria/new');
  };

  const handleExportReports = () => {
    // TODO: Implementar exportação de relatórios
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  const handleShareReports = () => {
    // TODO: Implementar compartilhamento
    alert('Funcionalidade de compartilhamento em desenvolvimento');
  };

  const handleViewAnalytics = () => {
    // TODO: Implementar analytics
    alert('Funcionalidade de analytics em desenvolvimento');
  };

  const handleSettings = () => {
    // TODO: Implementar configurações
    alert('Funcionalidade de configurações em desenvolvimento');
  };

  return (
    <div className="dashboard-layout">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="dashboard-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        <main className="dashboard">
          <div className="dashboard__container">
            <div className="dashboard__header">
              <div>
                <h1 className="dashboard__title">Dashboard</h1>
                <p className="dashboard__subtitle">
                  Visão geral do sistema de auditorias em campo
                </p>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="dashboard__section">
              <h2 className="dashboard__section-title">Ações Rápidas</h2>
              <div className="quick-actions">
                <button 
                  className="quick-action"
                  onClick={handleGoToReports}
                >
                  <div className="quick-action__icon">
                    <HiDocumentReport size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Relatórios de Inspeção</div>
                    <div className="quick-action__description">Visualizar e gerenciar relatórios</div>
                  </div>
                </button>

                <button 
                  className="quick-action"
                  onClick={handleCreateReport}
                >
                  <div className="quick-action__icon">
                    <HiPlus size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Novo Relatório</div>
                    <div className="quick-action__description">Criar nova inspeção em campo</div>
                  </div>
                </button>

                <button 
                  className="quick-action"
                  onClick={handleExportReports}
                >
                  <div className="quick-action__icon">
                    <HiDownload size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Exportar Relatórios</div>
                    <div className="quick-action__description">Baixar relatórios em PDF</div>
                  </div>
                </button>

                <button 
                  className="quick-action"
                  onClick={handleShareReports}
                >
                  <div className="quick-action__icon">
                    <HiShare size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Compartilhar</div>
                    <div className="quick-action__description">Compartilhar com auditores parceiros</div>
                  </div>
                </button>

                <button 
                  className="quick-action"
                  onClick={handleViewAnalytics}
                >
                  <div className="quick-action__icon">
                    <HiChartBar size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Analytics</div>
                    <div className="quick-action__description">Visualizar estatísticas e gráficos</div>
                  </div>
                </button>

                <button 
                  className="quick-action"
                  onClick={handleSettings}
                >
                  <div className="quick-action__icon">
                    <HiCog size={20} />
                  </div>
                  <div className="quick-action__content">
                    <div className="quick-action__title">Configurações</div>
                    <div className="quick-action__description">Ajustar preferências do sistema</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
