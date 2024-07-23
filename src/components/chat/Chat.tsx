import useChat from '@/hooks/useChat'
import { useState } from 'react'

const Chat = ({ recipient }: { recipient: string }) => {
    const { messages, sendMessage } = useChat(recipient)
    const [input, setInput] = useState('')
    const [listMessages, setListMessages] = useState<any[]>([])

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input)
            setListMessages((prev) => [...prev, messages])
            setInput('')
        }
    }

    return (
        <div>
            <div>
                {listMessages.map((msg, index) => (
                    <div key={index}> {JSON.stringify(msg)}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSend()
                    }
                }}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    )
}

export default Chat
