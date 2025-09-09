import { useState, useEffect } from "react"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import Sidebar from "./components/Sidebar"

const STORAGE_KEY = "gemini_chats_v1"
const GEMINI_MODEL = "gemini-2.0-flash-exp"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY


export default function App() {
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
    if (!API_KEY) return alert("Missing Gemini API key in environment variables")

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
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
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
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createChat={createChat}
      />
      <div className="flex-1 bg-gray-100">
        {activeChatId ? (
          <ChatWindow
            chat={chats.find(c => c.id === activeChatId)}
            onSend={sendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 bg-[#212121]">
            Select or create a chat
          </div>
        )}
      </div>
    </div>
  )
}
