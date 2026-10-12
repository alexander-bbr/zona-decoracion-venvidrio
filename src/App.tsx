import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./config/AppRoutes";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
        <div className="appContent">
          <Sidebar isOpen={isSidebarOpen} />
          {isSidebarOpen && (
            <button
              type="button"
              className="sidebarOverlay"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Cerrar menú"
            />
          )}
          <main id="main">
            <AppRoutes />
          </main>
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
