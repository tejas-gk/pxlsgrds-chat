import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatList from "./ChatList"

export default function Sidebar({ chats, activeChatId, setActiveChatId, createChat, apiKey, setApiKey }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`bg-gray-900 text-gray-100 h-screen flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-64"} p-3`}
    >
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <h1 className="text-lg font-bold">PXLSGRDS Chat</h1>}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* <input
            type="password"
            className="w-full mb-3 px-3 py-2 text-sm rounded bg-gray-800 text-gray-100 focus:outline-none"
            placeholder="API Key"
            value={apiKey}
            onChange={e => {
              setApiKey(e.target.value)
              localStorage.setItem("gemini_api_key", e.target.value)
            }}
          /> */}

          <Button
            onClick={createChat}
            variant="ghost"
            className="mb-3 w-full justify-start border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white py-4"
          >
            + New Chat
          </Button>

          <div className="flex-1 overflow-y-auto">
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              onSelect={setActiveChatId}
            />
          </div>
        </>
      )}

      {collapsed && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow"
            onClick={createChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
