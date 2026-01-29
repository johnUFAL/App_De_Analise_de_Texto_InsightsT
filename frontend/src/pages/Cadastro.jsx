import React, { useState } from "react";
import { APP_CONFIG } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Cadastro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);

    const result = await register(formData.nome, formData.email, formData.senha);
    console.log('Resultado do registro:', result);

    if (result.success) {
      alert("Conta criada com sucesso!");
      navigate('/');
    } else {
      setError(result.error || "Erro ao criar conta");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 font-inter">
      <div className="flex items-center justify-center p-4 pt-24">
        <div className=" w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/images/logo.png" alt="InsightsT" className="h-32 w-auto"/>
            </div>
            <p className="text-neutral-400 text-sm">{APP_CONFIG.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white text-center">
              {APP_CONFIG.createAccountMessage}
            </h2>
            <p className="text-neutral-400 text-sm text-center mt-2">
              {APP_CONFIG.startMonitoringMessage}
            </p>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-8 rounded-full"></div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-neutral-400 text-sm">
              {APP_CONFIG.haveAccountMessage}{" "}
              <Link
                to="/login"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                {APP_CONFIG.loginText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
