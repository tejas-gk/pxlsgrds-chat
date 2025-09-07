import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState } from "react"

export default function MessageBubble({ role, text, onRegenerate }) {
    const isUser = role === "user"
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <div
                className={`relative px-3 py-2 rounded-lg max-w-2xl whitespace-pre-line ${isUser ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-900"
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
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className="bg-gray-300 px-1 rounded" {...props}>
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
                <div className="flex gap-2 mt-1 text-sm text-gray-500">
                    <button onClick={handleCopy} className="hover:text-black">
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <button onClick={onRegenerate} className="hover:text-black">
                        Regenerate
                    </button>
                </div>
            )}
        </div>
    )
}
