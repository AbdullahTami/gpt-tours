"use client";

import { generateChatResponse } from "@/utlis/actions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: (query) => generateChatResponse([...messages, query]),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      setMessages((messages) => [...messages, data]);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    const query = { role: "user", content: text };
    createMessage(query);
    setMessages((messages) => [...messages, query]);
    setText("");
  }
  console.log(messages);

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }, index) => {
          const avatar = role === "user" ? "🧑‍💻" : "🤖";
          const bcg = role === "user" ? "bg-base-200" : "bg-base-100";
          return (
            <div
              key={index}
              className={`${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
            >
              <span className="mr-4">{avatar}</span>
              <p className="max-w-3xl">{content}</p>
            </div>
          );
        })}
        {isPending && <span className="loading"></span>}
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
            <button
              disabled={isPending}
              className="btn btn-primary join-item"
              type="submit"
            >
              {isPending ? "Please wait" : "Ask question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
