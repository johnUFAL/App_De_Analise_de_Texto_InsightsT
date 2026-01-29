import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, User, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { path: "/perfil", icon: <User className="w-5 h-5" />, label: "Perfil" },
  ];

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 px-6 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-InsightsT-blue text-white"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className=" text-neutral-400 hover:text-white">
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
