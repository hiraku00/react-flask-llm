import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = async () => {
    setIsProcessing(true);
    const response = await axios.post("http://localhost:5001/process", {
      text,
    });
    setProcessedText(response.data.text);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-cente space-y-4 w-1/2 mx-auto mt-10">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Please enter your question"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={processText}
        disabled={isProcessing}
        className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isProcessing ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isProcessing ? "Searching..." : "Search"}
      </button>
      <p className="p-4 border border-gray-300 rounded-md">{processedText}</p>
    </div>
  );
}

export default App;
