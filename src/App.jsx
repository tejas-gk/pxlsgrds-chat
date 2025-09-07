import { useState, useEffect } from "react"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "gemini_chats_v1"
const GEMINI_MODEL = "gemini-2.0-flash-exp"

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "")
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [activeChatId, setActiveChatId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  function createChat() {
    const newChat = { id: Date.now(), title: "New Chat", messages: [] }
    setChats([newChat, ...chats])
    setActiveChatId(newChat.id)
  }

  async function sendMessage(text) {
    if (!apiKey) return alert("Please enter your Gemini API key")

    setChats(prev =>
      prev.map(c =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, { role: "user", text }] }
          : c
      )
    )

    const chat = chats.find(c => c.id === activeChatId)
    const history = chat ? chat.messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })) : []

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [...history, { role: "user", parts: [{ text }] }],
          }),
        }
      )
      const data = await res.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response"

      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, { role: "assistant", text: reply }] }
            : c
        )
      )
    } catch (err) {
      console.error(err)
      alert("Error contacting Gemini API")
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-gray-100 flex flex-col h-screen p-3">
        <h1 className="text-lg font-bold mb-4">PXLSGRDS Chat</h1>

        <input
          type="password"
          className="w-full mb-3 px-3 py-2 text-sm rounded bg-gray-800 text-gray-100 focus:outline-none"
          placeholder="API Key"
          value={apiKey}
          onChange={e => {
            setApiKey(e.target.value)
            localStorage.setItem("gemini_api_key", e.target.value)
          }}
        />


        <Button onClick={createChat}
          variant="ghost"
          className="mb-3 w-full justify-start border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white py-4"
        >
          + New Chat
        </Button>

        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
        />
      </div>

      <div className="flex-1 bg-gray-100">
        {activeChatId ? (
          <ChatWindow
            chat={chats.find(c => c.id === activeChatId)}
            onSend={sendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select or create a chat
          </div>
        )}
      </div>
    </div>
  )
}
