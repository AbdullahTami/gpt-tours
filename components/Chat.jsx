"use client";

import { useState } from "react";

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(text);
  }
  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        <h2 className="text-5xl">messages</h2>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
          <div className="join w-full">
            <input
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Message GPTTours"
              className="input input-bordered join-item w-full"
            />
            <button className="btn btn-primary join-item" type="submit">
              Ask question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
