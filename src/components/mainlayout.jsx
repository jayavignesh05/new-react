import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import "./app.css";
import { FiMenu } from "react-icons/fi";

function MainLayout({
  sidebarOpen,
  toggleSidebar,
  closeSidebar,
  formData,
  isSidebarCollapsed,
  toggleCollapse,
}) {
  return (
    <div className="layout">
      <aside className={`leftside ${isSidebarCollapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}`}>
        <Sidebar 
          onLinkClick={closeSidebar} 
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </aside>

      {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}

      <div className={`rightside ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <header className="app-header">
          <div>
            <button className="hamburger" onClick={toggleSidebar}>
              <FiMenu size={24} />
            </button>
          </div>
          <Header formData={formData} isSidebarCollapsed={isSidebarCollapsed} />
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;