import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Download,
  Edit,
  Settings,
  LogOut,
  Mail,
  Phone,
  Building,
  Briefcase,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

const Perfil = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [usuario, setUsuario] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: "Edite..",
    empresa: "Edite..",
    cargo: "Edite...",
  });

  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (user) {
      setUsuario((prev) => ({
        ...prev,
        nome: user.nome || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setUsuario((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const salvarPerfil = () => {
    setEditando(false);
    alert("Perfil atualizado com sucesso!");
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 font-inter">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className=" bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
                <p className="text-neutral-400">
                  Gerencie suas informações pessoais e preferências
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                Perfil Ativo
              </span>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar Dados</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Avatar e Info */}
          <div className="lg:col-span-1">
            <div className=" bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src="/images/user.png"
                    alt="Usuário"
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {usuario.nome}
                </h2>
                <p className="text-neutral-400">{usuario.cargo}</p>
                <p className="text-gray-500 text-sm">{usuario.empresa}</p>

                <div className="mt-6 space-y-3 w-full">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{usuario.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span>{usuario.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Building className="w-5 h-5 text-blue-500" />
                    <span>{usuario.empresa}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span>{usuario.cargo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* form e ações aqui, futuramente alterar o banco realmente*/}
          <div className="lg:col-span-2 space-y-8">
            {/* form de edição */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Informações Pessoais
                </h2>
                <button
                  onClick={() => setEditando(!editando)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>{editando ? "Cancelar Edição" : "Editar Perfil"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={usuario.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    disabled={!editando}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={usuario.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!editando}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={usuario.telefone}
                    onChange={(e) =>
                      handleInputChange("telefone", e.target.value)
                    }
                    disabled={!editando}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={usuario.empresa}
                    onChange={(e) =>
                      handleInputChange("empresa", e.target.value)
                    }
                    disabled={!editando}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={usuario.cargo}
                    onChange={(e) => handleInputChange("cargo", e.target.value)}
                    disabled={!editando}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                  />
                </div>
              </div>

              {editando && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setEditando(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button
                    onClick={salvarPerfil}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>

            {/* Ações da Conta */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Ações da Conta
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/configuracoes")}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white">Configurações</h3>
                      <p className="text-sm text-gray-500">
                        Gerencie preferências e notificações
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-red-700">
                        Sair da Conta
                      </h3>
                      <p className="text-sm text-red-500">
                        Encerrar sessão atual
                      </p>
                    </div>
                  </div>
                  <div className="text-red-500 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
