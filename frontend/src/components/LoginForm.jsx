import React, { useState } from "react";
import { APP_CONFIG } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || "Erro ao fazer login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 font-inter flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="InsightsT" className="h-32 w-auto" />
          </div>
          <p className="text-neutral-400 text-lg font-medium">
            {APP_CONFIG.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white text-center">
            {APP_CONFIG.welcomeMessage}
          </h2>
          <p className="text-neutral-400 text-sm text-center mt-2">
            {APP_CONFIG.loginMessage}
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 rounded-xl focus:border-blue-500  focus:ring-2 focus:ring-blue-500/40 hover:border-neutral-500 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-neutral-400 text-sm">
            {APP_CONFIG.noAcesseMessage}{" "}
            <Link
              to="/cadastro"
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
              {APP_CONFIG.signUpMessage}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
