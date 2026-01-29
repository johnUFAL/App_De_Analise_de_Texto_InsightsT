import { useState } from "react"
import { analysisAPI } from "../services/api";

function TopicAnalyzer( {text} ) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeTopic = async () => {
    if (!text.trim()) return;

    setLoading(true)
    setResult(null)

    try {
      const response = await analysisAPI.analyzeTopic(text)
      const data = response.data

      setResult({
        topico_principal: data.topico_principal,
        topicos: data.topicos
      })
    } catch (error) {
      console.error("Erro ao analisar tópicos:", error)
      setResult({
        topico_principal: "Erro ao analisar",
        topicos: []
      })
    } finally {
      setLoading(false)
    }
  } 

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-neutral-300 mb-4">
        Classificação de Tópicos
      </h3>

      <button
        onClick={analyzeTopic}
        disabled={!text.trim()}
        className="bg-InsightsT-blue text-white font-semibold py-2 px-4 rounded-xl disabled:opacity-50">
        Analisar Tópicos
      </button>

      {result && (
        <div className="mt-6 space-y-2">
          <p className="text-neutral-200">
            <strong>Tópico principal:</strong>{" "}
            <span className="text-InsightsT-blue">
              {result.topico_principal}
            </span>
          </p>

          {result.topicos.map((t, i) => (
            <div key={i} className="flex justify-between text-sm text-neutral-400">
              <span>{t.topico}</span>
              <span>{Math.round(t.confianca * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopicAnalyzer
