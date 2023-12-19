import React from "react";

interface ModelSelectProps {
  setModel: (model: string) => void;
  setHistory: (history: any[]) => void;
  setImage: (image: File | null) => void
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  setModel,
  setHistory,
  setImage,
}) => {
  return (
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      id="model-select"
      onChange={(e) => {
        setModel(e.target.value);
        setHistory([]);
        setImage(null);
      }}
    >
      <option value="llama2-7B">LLama2 - 7B</option>
      <option value="gemini-pro">Gemini Pro</option>
      <option value="gemini-pro-vision">Gemini Pro Vision</option>
    </select>
  );
};

export default ModelSelect;
