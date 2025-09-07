export default function ChatList({ chats, activeChatId, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-1">
      {chats.map(chat => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat.id)}
          className={`truncate px-3 py-2 rounded cursor-pointer text-sm transition-colors ${chat.id === activeChatId
              ? "bg-gray-700 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
        >
          {chat.title}
        </div>
      ))}
    </div>
  )
}
