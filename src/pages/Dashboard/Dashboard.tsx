import { useState } from "react";
import { 
  HiPlus, 
  HiCheckCircle, 
  HiClock, 
  HiCollection, 
  HiDocumentReport,
  HiLocationMarker,
  HiPhotograph,
  HiUser,
  HiShare
} from "react-icons/hi";
import Header from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import Button from "../../components/Button";
import "./Dashboard.css";

interface Audit {
  id: string;
  title: string;
  status: "pendente" | "em-andamento" | "concluida";
  date: string;
  auditor: string;
  location: string;
  photos: number;
  lastUpdate: string;
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Dados mockados - serão substituídos por dados reais do backend
  const stats = {
    total: 24,
    pendentes: 8,
    emAndamento: 6,
    concluidas: 10,
  };

  const recentAudits: Audit[] = [
    {
      id: "1",
      title: "Auditoria - Construção Residencial",
      status: "em-andamento",
      date: "2024-01-15",
      auditor: "João Silva",
      location: "São Paulo, SP",
      photos: 12,
      lastUpdate: "Hoje às 14:30",
    },
    {
      id: "2",
      title: "Inspeção - Obra Comercial",
      status: "pendente",
      date: "2024-01-14",
      auditor: "Maria Santos",
      location: "Rio de Janeiro, RJ",
      photos: 0,
      lastUpdate: "Ontem às 10:15",
    },
    {
      id: "3",
      title: "Auditoria - Reforma Predial",
      status: "concluida",
      date: "2024-01-13",
      auditor: "Pedro Costa",
      location: "Belo Horizonte, MG",
      photos: 25,
      lastUpdate: "13/01 às 16:45",
    },
    {
      id: "4",
      title: "Inspeção - Estrutura Metálica",
      status: "em-andamento",
      date: "2024-01-12",
      auditor: "Ana Oliveira",
      location: "Curitiba, PR",
      photos: 8,
      lastUpdate: "12/01 às 11:20",
    },
    {
      id: "5",
      title: "Auditoria - Fundação",
      status: "pendente",
      date: "2024-01-11",
      auditor: "Carlos Mendes",
      location: "Porto Alegre, RS",
      photos: 0,
      lastUpdate: "11/01 às 09:00",
    },
  ];

  const getStatusLabel = (status: string) => {
    const labels = {
      pendente: "Pendente",
      "em-andamento": "Em Andamento",
      concluida: "Concluída",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    return `audit-status audit-status--${status}`;
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
            <Button variant="primary" icon={<HiPlus size={18} />}>
              Nova Auditoria
            </Button>
          </div>

          {/* Cards de Estatísticas */}
          <div className="dashboard__stats">
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--blue">
                <HiCollection size={24} />
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.total}</div>
                <div className="stat-card__label">Total de Auditorias</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--orange">
                <HiClock size={24} />
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.pendentes}</div>
                <div className="stat-card__label">Pendentes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--yellow">
                <HiCollection size={24} />
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.emAndamento}</div>
                <div className="stat-card__label">Em Andamento</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <HiCheckCircle size={24} />
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.concluidas}</div>
                <div className="stat-card__label">Concluídas</div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-title">Ações Rápidas</h2>
            <div className="quick-actions">
              <button className="quick-action">
                <div className="quick-action__icon">
                  <HiPlus size={20} />
                </div>
                <div className="quick-action__content">
                  <div className="quick-action__title">Nova Auditoria</div>
                  <div className="quick-action__description">Criar nova inspeção em campo</div>
                </div>
              </button>

              <button className="quick-action">
                <div className="quick-action__icon">
                  <HiDocumentReport size={20} />
                </div>
                <div className="quick-action__content">
                  <div className="quick-action__title">Relatórios</div>
                  <div className="quick-action__description">Visualizar e gerar PDFs</div>
                </div>
              </button>

              <button className="quick-action">
                <div className="quick-action__icon">
                  <HiLocationMarker size={20} />
                </div>
                <div className="quick-action__content">
                  <div className="quick-action__title">Auditorias no Mapa</div>
                  <div className="quick-action__description">Visualizar localizações</div>
                </div>
              </button>

              <button className="quick-action">
                <div className="quick-action__icon">
                  <HiShare size={20} />
                </div>
                <div className="quick-action__content">
                  <div className="quick-action__title">Compartilhar</div>
                  <div className="quick-action__description">Com auditores parceiros</div>
                </div>
              </button>
            </div>
          </div>

          {/* Auditorias Recentes */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Auditorias Recentes</h2>
              <Button variant="outline" size="small">Ver Todas</Button>
            </div>
            <div className="audits-list">
              {recentAudits.map((audit) => (
                <div key={audit.id} className="audit-card">
                  <div className="audit-card__header">
                    <div className="audit-card__title">{audit.title}</div>
                    <span className={getStatusClass(audit.status)}>
                      {getStatusLabel(audit.status)}
                    </span>
                  </div>
                  <div className="audit-card__body">
                    <div className="audit-card__info">
                      <div className="audit-card__info-item">
                        <HiUser size={16} />
                        <span>{audit.auditor}</span>
                      </div>
                      <div className="audit-card__info-item">
                        <HiLocationMarker size={16} />
                        <span>{audit.location}</span>
                      </div>
                      <div className="audit-card__info-item">
                        <HiPhotograph size={16} />
                        <span>{audit.photos} fotos</span>
                      </div>
                    </div>
                    <div className="audit-card__footer">
                      <span className="audit-card__date">Atualizado: {audit.lastUpdate}</span>
                      <Button variant="ghost" size="small">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
