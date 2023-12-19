import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface UserInputProps {
  text: string;
  setText: (text: string) => void;
  isDisabled: boolean;
  isLoading: boolean;
  processText: () => void;
}

export const UserInput: React.FC<UserInputProps> = ({
  text,
  setText,
  isDisabled,
  isLoading,
  processText,
}) => {
  return (
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
  );
};

export default UserInput;
