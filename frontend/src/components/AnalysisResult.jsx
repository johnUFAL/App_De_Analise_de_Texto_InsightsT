import React from "react";

const AnalysisResult = ({ analysis }) => {
  const { 
    sentimento, 
    palavra_mais_frequente, 
    entidades, 
    lvl_legibilidade, 
    cont_palavras, 
    cont_caracteres, 
    cont_frases,
    criado_em
  } = analysis;

  //Cor do sentimento 
  const getSentimentColor = (sentiment) => {
    if (sentiment?.toLowerCase().includes('positivo')) return 'text-green-600';
    if (sentiment?.toLowerCase().includes('negativo')) return 'text-red-600';
    return 'text-neutral-400';
  };

  //Como o back devolve uma string, aqui é uma representação em valor que pode ser trabalhada futuramente
  const getSentimentValues = (sentiment) => {
    if (sentiment?.toLowerCase().includes('positivo')) return { positive: 80, neutral: 15, negative: 5 };
    if (sentiment?.toLowerCase().includes('negativo')) return { positive: 10, neutral: 20, negative: 70 };
    return { positive: 33, neutral: 34, negative: 33 };
  };

  const sentimentValues = getSentimentValues(sentimento);

  const SentimentBar = ({ positive, neutral, negative }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-green-600 font-medium">Positivo {positive}%</span>
        <span className="text-neutral-400">Neutro {neutral}%</span>
        <span className="text-red-600">Negativo {negative}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${positive}%` }}
          />
          <div
            className="bg-gray-400 transition-all duration-500"
            style={{ width: `${neutral}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${negative}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-neutral-300">
        Resultados da Análise
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* analise do sentimento */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5">
          <h3 className="font-semibold text-neutral-300 mb-4">
            Análise de Sentimento
          </h3>
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold ${getSentimentColor(sentimento)}`}>
              {sentimento}
            </div>
          </div>
          <SentimentBar
            positive={sentimentValues.positive}
            neutral={sentimentValues.neutral}
            negative={sentimentValues.negative}
          />
        </div>

        {/* a palavra mais frequente */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5">
          <h3 className="font-semibold text-neutral-300 mb-4">
            Palavra Mais Frequente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">#</span>
                <span className="font-medium text-neutral-200">
                  {palavra_mais_frequente || "Nenhuma"}
                </span>
              </span>
              <span className="bg-blue-500/20 text-blue-400 font-bold py-1 px-3 rounded-full">
                Frequente
              </span>
            </div>
          </div>
        </div>

        {/* o nivel de legibilidade */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5">
          <h3 className="font-semibold text-neutral-300 mb-4">
            Legibilidade do Texto
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {lvl_legibilidade?.split(' ')[0] || "Médio"}
            </div>
            <div className="text-lg font-medium text-neutral-300">
              {lvl_legibilidade || "Médio (Ensino superior)"}
            </div>
            <div className="mt-4">
              <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* as entidades do texto */}
      {entidades && entidades.length > 0 && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 mt-6">
          <h3 className="font-semibold text-neutral-300 mb-4">
            Entidades Encontradas
          </h3>
          <div className="flex flex-wrap gap-3">
            {entidades.map((entity, index) => (
              <span
                key={index}
                className="bg-green-500/20 text-green-400 font-medium py-2 px-4 rounded-full"
              >
                {typeof entity === 'object' ? entity.texto : entity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* algumas estatisticas OBS: o tempo de leitura é ficticio, mas é algo que pode ser implementado*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neutral-300">
            {cont_palavras || 0}
          </div>
          <div className="text-neutral-400">Palavras</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neutral-300">
            {cont_caracteres || 0}
          </div>
          <div className="text-neutral-400">Caracteres</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neutral-300">
            {cont_frases || 0}
          </div>
          <div className="text-neutral-400">Frases</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-neutral-300">
            {Math.ceil((cont_palavras || 0) / 200)} min
          </div>
          <div className="text-neutral-400">Tempo de Leitura</div>
        </div>
      </div>

      <div className="text-sm text-neutral-500 text-right mt-4">
        Análise realizada em {new Date(criado_em).toLocaleString('pt-BR')}
      </div>
    </div>
  );
};

export default AnalysisResult;