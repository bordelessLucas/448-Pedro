import { NavLink } from "react-router-dom";
import { HiChartBar, HiClipboardCheck } from "react-icons/hi";
import { paths } from "../../routes/paths";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const menuItems = [
    { path: paths.dashboard, icon: HiChartBar, label: "Dashboard" },
    { path: paths.auditoria, icon: HiClipboardCheck, label: "Auditoria" },
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
            <span>Versão 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

