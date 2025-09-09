"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function MessageBubble({ role, text, onRegenerate }) {
    const isUser = role === "user"
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <motion.div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}
            initial={{ opacity: 0, x: isUser ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div
                className={`relative px-4 py-3 rounded-2xl max-w-2xl whitespace-pre-line shadow-sm ${isUser
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-zinc-800 text-zinc-100 rounded-bl-none"
                    }`}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-lg text-sm"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className="bg-zinc-700 text-zinc-100 px-1 rounded text-sm" {...props}>
                                    {children}
                                </code>
                            )
                        },
                    }}
                >
                    {text}
                </ReactMarkdown>
            </div>

            {!isUser && (
                <motion.div
                    className="flex gap-2 mt-2 text-xs text-zinc-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={handleCopy}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={onRegenerate}
                    >
                        Regenerate
                    </Button>
                </motion.div>
            )}
        </motion.div>
    )
}
