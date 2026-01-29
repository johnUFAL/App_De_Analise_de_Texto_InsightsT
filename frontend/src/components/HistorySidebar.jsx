import React from "react";
import { Clock, FileText, BarChart2, Calendar, Eye } from "lucide-react";

const HistorySidebar = ({ history, onViewAnalysis }) => { 
  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
      case "positivo":
        return "bg-green-500/20 text-green-400";
      case "negative":
      case "negativo":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const getSentimentText = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
      case "positivo":
        return "Positivo";
      case "negative":
      case "negativo":
        return "Negativo";
      default:
        return "Neutro";
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-InsightsT-blue" />
        <h2 className="text-xl font-semibold text-neutral-300">Histórico</h2>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div
              key={item.id}
              className="border border-neutral-700 rounded-xl p-4 hover:border-InsightsT-blue/50 hover:shadow-md transition-all duration-300 cursor-pointer group"
              //area clicavel
              onClick={() => onViewAnalysis(item)}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-300">{item.title}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentText(item.sentiment)}
                </span>
              </div>

              <p className="text-sm text-neutral-400 mb-3">{item.preview}</p>

              <div className="flex items-center justify-between text-sm text-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {item.wordCount} palavras
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      //clique duplo
                      e.stopPropagation(); 
                      onViewAnalysis(item);
                    }}
                    className="flex items-center gap-1 text-InsightsT-blue hover:text-InsightsT-blue/80 font-medium text-sm transition-colors group-hover:underline">
                    <Eye className="w-4 h-4" />
                    Ver análise
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <BarChart2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400">Nenhuma análise realizada ainda</p>
            <p className="text-sm text-neutral-500 mt-1">
              Analise um texto para começar
            </p>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm">{history.length} análises realizadas</span>
            </div>
            <button 
              className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              onClick={() => {
                //analise mais recente 
                if (history.length > 0) {
                  onViewAnalysis(history[0]);
                }
              }}>
              Ver mais recente
            </button>
          </div>
          <button 
            className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 py-4 rounded-xl hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
            onClick={() => {}}>
            Ver histórico completo
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;