import { useState } from "react"
import MessageBubble from "./MessageBubble"
import { Send } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { AnimatePresence, motion } from "framer-motion"

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
        <div className="flex flex-col h-full bg-[#212121] overflow-hidden">

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
                <AnimatePresence initial={false}>
                    {chat.messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <MessageBubble
                                role={msg.role}
                                text={msg.text}
                                onRegenerate={() => handleRegenerate(lastUserMessage)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="px-4 py-3">
                <div className="flex items-end max-w-3xl mx-auto w-full">
                    <div className="relative flex-1">
                        <Textarea
                            className="w-full pr-12 bg-[#303030] border-[#303030] text-zinc-100 
                                placeholder:text-zinc-400 focus-visible:ring-1 
                                focus-visible:ring-emerald-500 rounded-lg resize-none
                                scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900
                                min-h-[2.5rem] max-h-[7.5rem] overflow-y-auto leading-6"
                            placeholder="Message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            rows={1}
                        />

                        {/* Send Button inside textarea */}
                        <motion.button
                            type="button"
                            onClick={handleSend}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className="absolute bottom-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white shadow flex items-center justify-center"
                        >
                            <Send className="h-4 w-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}
