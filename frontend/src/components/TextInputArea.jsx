import React from "react";

const TextInputArea = ({ value, onChange }) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole seu texto aqui para análise. O sistema irá extrair sentimentos, palavras-chave, entidades e muito mais..."
        className="w-full h-40 p-4 bg-neutral-800 text-neutral-100 placeholder-neutral-400 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
      />

      <div className="flex justify-between text-sm text-neutral-400">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="font-medium">{wordCount}</span>
            <span>palavras</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">{charCount}</span>
            <span>caracteres</span>
          </span>
        </div>
        <button
          onClick={() => onChange("")}
          className="text-InsightsT-blue hover:text-InsightsT-blue/80 font-medium transition-colors">
          Limpar texto
        </button>
      </div>
    </div>
  );
};

export default TextInputArea;
