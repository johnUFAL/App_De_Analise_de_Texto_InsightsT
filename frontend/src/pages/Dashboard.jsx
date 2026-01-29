import React, { useEffect, useState } from "react";
import AnalysisResult from "../components/AnalysisResult";
import TextInputArea from "../components/TextInputArea";
import HistorySidebar from "../components/HistorySidebar";
import TopicAnalyzer from "../components/TopicAnalyzer";
import Navbar from "../components/Navbar";
import AnalysisModal from "../components/AnalysisModal"; 
import { analysisAPI } from "../services/api";
import { useNotification } from "../contexts/NotificationContext"; 
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null); // ← Adicione para modal
  const { showError, showSuccess } = useNotification(); // ← Adicione

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const response = await analysisAPI.getHistory();
      const historicoFormatado = response.data.map(item => ({
        id: item.id,
        title: `Análise ${item.id}`,
        date: new Date(item.criado_em).toLocaleDateString("pt-BR"),
        wordCount: item.cont_palavras,
        sentiment: item.sentimento?.toLowerCase(),
        preview: item.texto_original.substring(0, 50) + "...",
        fullAnalysis: item
      }));
      setHistory(historicoFormatado);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };
  
  const handleAnalyze = async () => {
    if (!text.trim()) {
      showError("Digite um texto para analisar");
      return;
    }

    if (text.trim().length < 10) {
      showError("Texto muito curto. Digite pelo menos 10 caracteres");
      return;
    }


    if (text.trim().length > 10000) {
      showError("Texto muito longo. Máximo de 10.000 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await analysisAPI.analyzeText(text, true);
      const data = response.data;

      setAnalysis(data);
      
      const newHistoryItem = {
        id: data.id || Date.now(),
        title: `Análise ${history.length + 1}`,
        date: new Date().toLocaleDateString("pt-BR"),
        wordCount: data.cont_palavras || 0,
        sentiment: data.sentimento?.toLowerCase() || "neutral",
        preview: text.substring(0, 50) + "...",
        fullAnalysis: data // ← Guarde a análise completa
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      showSuccess("Análise concluída com sucesso!");

    } catch (error) {
      console.error("Erro na análise: ", error);
      
      let errorMessage = "Erro ao analisar texto";
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || errorMessage;
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      }
      
      showError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = (analysisData) => {
    setSelectedAnalysis(analysisData);
  };

  const handleClearText = () => {
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 font-inter">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-white">
            Análise Inteligente de Texto
          </h1>
          <p className="text-center text-neutral-400 mt-2">
            Analise sentimentos, extraia entidades e obtenha insights valiosos
            do seu texto
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-300">
                  Digite ou cole seu texto aqui...
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearText}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !text.trim()}
                    className="bg-InsightsT-blue hover:bg-InsightsT-blue/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analisando...
                      </>
                    ) : (
                      "Analisar Texto"
                    )}
                  </button>
                </div>
              </div>

              <TextInputArea value={text} onChange={setText} />
              
              <div className="mt-4 text-sm text-neutral-500">
                {text.length < 10 && text.length > 0 && (
                  <p className="text-yellow-500">Digite pelo menos 10 caracteres para uma análise significativa</p>
                )}
                {text.length > 10000 && (
                  <p className="text-red-500">Texto muito longo. Máximo: 10.000 caracteres</p>
                )}
              </div>
            </div>

            <div>
              <TopicAnalyzer text={text} />
            </div>

            {analysis && <AnalysisResult analysis={analysis} />}
          </div>

          <div className="lg:w-1/3">
            <HistorySidebar 
              history={history} 
              onViewAnalysis={handleViewAnalysis} // ← Passe a função
            />
          </div>
        </div>
      </div>

      {/* Modal para ver análise detalhada */}
      {selectedAnalysis && (
        <AnalysisModal 
          analysis={selectedAnalysis.fullAnalysis || selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;