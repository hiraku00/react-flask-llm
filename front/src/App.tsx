import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

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
  const imageRef = useRef<HTMLImageElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const processText = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      if (model === "llama2-7B") {
        const formData = new FormData();
        formData.append('messages', JSON.stringify(history.concat({ type: "user", text: text.trim() })));
        formData.append('model', model);

        const response = await axios.post("http://localhost:5001/process", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setHistory((prev) => [
          ...prev,
          { type: "user", text },
          { type: "assistant", text: response.data.text },
        ]);
      } else if (model === "gemini-pro") {
        const formData = new FormData();
        formData.append('messages', JSON.stringify(history));
        formData.append('text', text);
        formData.append('model', model);

        const response = await axios.post("http://localhost:5001/process", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setHistory((prev) => [
          ...prev,
          { type: "user", text },
          { type: "model", text: response.data.text },
        ]);
      }
      // "gemini-pro-vision"
      else {
        if (!image) {
          console.log("No image file selected");
          return;
        }
        // FIXME
        // https://hatehate-nazenaze.hatenablog.com/entry/2020/07/16/151828
        // https://qiita.com/melonpass/items/ff7fbfbb7edad2e768e2
        const formData = new FormData();
        formData.append('messages', JSON.stringify(history.concat({ type: "user", text: text.trim() })));
        formData.append('text', text);
        formData.append('image', image);
        formData.append('model', model);

        console.log(image);
        const response = await axios.post("http://localhost:5001/process", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setHistory((prev) => [
          ...prev,
          { type: "user", text },
          { type: "model", text: response.data.text },
        ]);
      }
      setText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  useEffect(() => {
    if (model !== "gemini-pro-vision") {
      setImage(null);
    }
  }, [model]);

  return (
    <div className="flex w-full mx-auto h-screen px-4">
      <div className="w-1/6 h-screen p-4 space-y-4 border-r border-gray-300 pt-5">
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="model-select"
          onChange={(e) => {
            setModel(e.target.value);
            setHistory([]);
          }}
        >
          <option value="llama2-7B">LLama2 - 7B</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="gemini-pro-vision">Gemini Pro Vision</option>
        </select>
        {model === "gemini-pro-vision" && (
          <input
            type="file"
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
          />
        )}
        {image && (
          <img
            ref={imageRef}
            src={URL.createObjectURL(image)}
            alt="uploaded"
            style={{ width: "200px", height: "200px" }}
          />
        )}
      </div>
      <div className="flex flex-col items-center space-y-4 w-5/6 mx-auto h-screen px-5">
        <div className="w-full h-5"></div>
        <div className="w-full overflow-auto h-4/5 bg-gray-100 relative">
          {history.map((item, i) => (
            <div
              key={i}
              className={`p-4 my-2 ${
                item.type === "user"
                  ? "rounded-br-none self-end text-white"
                  : "rounded-bl-none self-start text-black"
              }`}
            >
              <div
                className={`border border-gray-300 rounded-md p-2 ${
                  item.type === "user"
                    ? "w-auto inline-block float-right bg-green-500 max-w-[80%]"
                    : "w-auto inline-block float-left bg-white max-w-[80%]"
                }`}
              >
                {item.text}
              </div>
              <div className="clear-both"></div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <div className="w-full h-1/5 flex flex-col items-center justify-center space-y-4 relative">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="apple-loader absolute bottom-0 left-1/2 transform -translate-x-1/2"
              ></motion.div>
            )}
          </AnimatePresence>
          <motion.textarea
            id="userInput"
            name="userInput"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 h-20 overflow-hidden"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            disabled={isDisabled}
          />
          <motion.button
            onClick={processText}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoading ? "Searching..." : "Search"}
          </motion.button>
        </div>
        <div className="w-full h-5"></div>
      </div>
    </div>
  );
}

export default App;
