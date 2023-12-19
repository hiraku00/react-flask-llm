import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import { Chat, ImageUpload, ModelSelect, UserInput } from "./components";

function App() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("llama2-7B");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [history, setHistory] = useState(
    [] as { type: string; text?: string; parts?: string[] }[]
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const sendRequest = async (formData: FormData) => {
    const response = await axios.post(
      "http://localhost:5001/process",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.text;
  };

  const processText = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    const formData = new FormData();
    if (model === "gemini-pro") {
      formData.append("messages", JSON.stringify(history));
    } else {
      formData.append(
        "messages",
        JSON.stringify(history.concat({ type: "user", text: text.trim() }))
      );
    }
    formData.append("model", model);
    formData.append("text", text);
    if (model === "gemini-pro-vision" && image) {
      formData.append("image", image);
    }

    try {
      const responseText = await sendRequest(formData);
      setHistory((prev) => [
        ...prev,
        { type: "user", text },
        {
          type: model === "llama2-7B" ? "assistant" : "model",
          text: responseText,
        },
      ]);
      setText("");
    } catch (error) {
      if (error instanceof Error) {
        alert(`An error occurred: ${error.message}`);
      } else {
        alert(`An unknown error occurred: ${error}`);
      }
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex w-full mx-auto h-screen px-4">
      <div className="w-1/6 h-screen p-4 space-y-4 border-r border-gray-300 pt-5">
        <ModelSelect
          setModel={setModel}
          setHistory={setHistory}
          setImage={setImage}
        />
        <ImageUpload model={model} setImage={setImage} image={image} />
      </div>
      <div className="flex flex-col items-center space-y-4 w-5/6 mx-auto h-screen px-5">
        <div className="w-full h-5"></div>
        <Chat history={history} bottomRef={bottomRef} />
        <UserInput
          text={text}
          setText={setText}
          isDisabled={isDisabled}
          isLoading={isLoading}
          processText={processText}
        />
        <div className="w-full h-5"></div>
      </div>
    </div>
  );
}

export default App;
