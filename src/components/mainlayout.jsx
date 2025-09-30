import { Outlet } from "react-router-dom";
import Header from "./header";
import Lsidebar from "./sidebar";
import "./app.css";
import { FiMenu } from "react-icons/fi";


function MainLayout({ sidebarOpen, toggleSidebar, closeSidebar, formData }) {
  return (
    <div className="layout">
      <aside className={`leftside ${sidebarOpen ? "open" : ""}`}>
        <Lsidebar onLinkClick={closeSidebar} />
      </aside>

      {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}

      <div className="rightside">
        <header className="app-header">
         <div>
        <button className="hamburger" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
      </div>
          <Header  formData={formData} />
        </header>

        <main className="app-content">
         
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;