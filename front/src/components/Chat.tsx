import React from "react";

interface ChatProps {
  history: any[];
  bottomRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<ChatProps> = ({ history, bottomRef }) => {
  return (
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
  );
};

export default Chat;
