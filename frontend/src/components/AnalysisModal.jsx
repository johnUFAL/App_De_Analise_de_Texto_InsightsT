import React from 'react';
import { X, Copy, Download } from 'lucide-react';

const AnalysisModal = ({ analysis, onClose }) => {
  if (!analysis) return null;

  const copyToClipboard = () => {
    const text = JSON.stringify(analysis, null, 2);
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-bold text-white">Detalhes da Análise</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar JSON
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* analise detalhada aqui */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-300 mb-3">Texto Original</h3>
              <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                <p className="text-neutral-200 whitespace-pre-wrap">{analysis.texto_original}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-300 mb-3">Estatísticas</h3>
                <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Palavras:</span>
                    <span className="text-white">{analysis.cont_palavras}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Caracteres:</span>
                    <span className="text-white">{analysis.cont_caracteres}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Frases:</span>
                    <span className="text-white">{analysis.cont_frases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Legibilidade:</span>
                    <span className="text-white">{analysis.lvl_legibilidade}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-300 mb-3">Resultados</h3>
                <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sentimento:</span>
                    <span className="text-white">{analysis.sentimento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Palavra mais frequente:</span>
                    <span className="text-white">{analysis.palavra_mais_frequente}</span>
                  </div>
                </div>
              </div>
            </div>

            {analysis.entidades && analysis.entidades.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-300 mb-3">Entidades Encontradas</h3>
                <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                  <div className="flex flex-wrap gap-2">
                    {analysis.entidades.map((entity, index) => (
                      <span
                        key={index}
                        className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm"
                      >
                        {typeof entity === 'object' ? `${entity.texto} (${entity.tipo})` : entity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-neutral-300 mb-3">Dados Completos (JSON)</h3>
              <pre className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 overflow-x-auto text-sm text-neutral-300">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;