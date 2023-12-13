import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [history, setHistory] = useState(
    [] as { type: string; text: string }[]
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const processText = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const response = await axios.post("http://localhost:5001/process", {
        messages: history.concat({ type: "user", text: text.trim() }),
      });

      setHistory((prev) => [
        ...prev,
        { type: "user", text },
        { type: "assistant", text: response.data.text.join(' ') },
      ]);
      //debug
      console.log(history)
      setText(""); // 入力フィールドをクリア
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

  return (
    <div className="flex flex-col items-center space-y-4 w-2/3 mx-auto h-screen">
      <div className="w-full h-5"></div>
      <div className="w-full overflow-auto h-3/4 bg-gray-100 relative">
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
  );
}

export default App;
