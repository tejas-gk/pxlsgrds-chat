import { useState } from "react"
import MessageBubble from "./MessageBubble"
import { Button } from "./ui/button"

export default function ChatWindow({ chat, onSend }) {
    const [input, setInput] = useState("")

    function handleSend() {
        if (!input.trim()) return
        onSend(input.trim())
        setInput("")
    }

    function handleRegenerate(lastUserMessage) {
        if (!lastUserMessage) return
        onSend(lastUserMessage)
    }

    const lastUserMessage = [...chat.messages].reverse().find(m => m.role === "user")?.text

    return (
        <div className="flex flex-col h-full bg-[#212121]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.messages.map((msg, i) => (
                    <MessageBubble
                        key={i}
                        role={msg.role}
                        text={msg.text}
                        onRegenerate={() => handleRegenerate(lastUserMessage)}
                    />
                ))}
            </div>
            <div className="border-t bg-gray-50 px-4 py-3 bg-#212121]">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                    <input
                        type="text"
                        className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder="Message Gemini..."
                    />
                    <Button
                        className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </div>
            </div>

        </div>
    )
}
