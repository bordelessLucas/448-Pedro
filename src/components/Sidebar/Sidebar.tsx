import { NavLink } from "react-router-dom";
import { HiChartBar, HiClipboardCheck, HiCog } from "react-icons/hi";
import { paths } from "../../routes/paths";
import { useSettings } from "../../contexts/SettingsContext";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useSettings();

  const menuItems = [
    { path: paths.dashboard,     icon: HiChartBar,       label: t('nav_dashboard') },
    { path: paths.auditoria,     icon: HiClipboardCheck, label: t('nav_audit') },
    { path: paths.configuracoes, icon: HiCog,            label: t('nav_settings') },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-version">
            <span>{t('version')} 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

