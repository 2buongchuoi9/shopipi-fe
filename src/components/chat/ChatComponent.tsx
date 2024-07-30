// src/components/ChatComponent.tsx
import { Avatar, Button, Input } from 'antd'
import 'antd/dist/reset.css'
import React, { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import TimeCount from '../TimeCount'
import ChatBox from './ChatBox'
import chatApi from '@/http/chatApi'
import socketService, { ChatPayload } from '@/socketService'
import { Shop } from '@/http'
import useAuth from '@/hooks/useAuth'
import useChat from '@/hooks/useChat'
import { useDebounce, useMessage } from '@/hooks'
import { BiSearch } from 'react-icons/bi'
import shopApi, { Online } from '@/http/shopApi'
import { CgClose } from 'react-icons/cg'
import moment, { now } from 'moment'
import { dateFormat } from '@/utils/constants'

type Props = HTMLAttributes<HTMLDivElement> & {
    // onClose: () => void
    // selectedUserDefault: Shop | null
}

const ChatComponent = ({ ...rest }: Props) => {
    const { user, isAuthenticated } = useAuth()
    // const [selectedUser, setSelectedUser] = useState<Shop | null>(null)
    const [users, setUsers] = useState<(Shop & Online)[]>([])
    const [messages, setMessages] = useState<ChatPayload[]>([])
    const [input, setInput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const keySearch = useDebounce({ value: search, delay: 500 })
    const [resultSearch, setResultSearch] = useState<Shop[]>([])
    const [showResult, setShowResult] = useState(false)
    const { success } = useMessage()
    const { selectedUser, setSelectedUser, setVisible } = useChat()

    useEffect(() => {
        if (!keySearch.trim()) {
            setResultSearch([])
            setShowResult(false)
            return
        }

        ;(async () => {
            const res = await shopApi.findShop({ keySearch, size: 100 })
            setResultSearch(res.content)
            setShowResult(true)
        })()
    }, [keySearch])

    const handleReceiverNewMessage = useCallback(
        async (message: ChatPayload) => {
            // Phát âm thanh thông báo khi có tin nhắn mới
            // const audio = new Audio('/sounds/notification.mp3')
            // audio.play()

            // nếu tin nhắn mới là của người đang chat thì hiển thị lên màn hình
            if (
                selectedUser &&
                (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)
            ) {
                setMessages((prev) => {
                    const messageExists = prev.some((msg) => msg.message === message.message)
                    if (!messageExists) {
                        return [...prev, message]
                    }
                    return prev
                })
            } else {
                // nếu tin nhắn mới không phải của người đang chat thì kiểm tra xem người đó đã chat với mình chưa
                const isChatted = users.some(
                    (u) => u.id === message.senderId || u.id === message.receiverId
                )

                // nếu chưa chat thì thêm vào danh sách user đã chat
                if (!isChatted) {
                    ;(async () => {
                        const res = await chatApi.getUserChattedWithUser(user.id)
                        const res2 = await shopApi.onlineMany(res.map((u) => u.id))

                        const users = Array(res.length)
                            .fill(null)
                            .map((_, i) => ({ ...res2[i], ...res[i] })) as (Shop & Online)[]

                        setUsers(users)
                    })()
                }
            }
        },
        [selectedUser, users, user.id]
    )

    // Lấy tin nhắn lịch sử giữa hai user
    const fetchChatHistory = async () => {
        if (selectedUser && isAuthenticated && user) {
            try {
                const res = await chatApi.getChatList(user.id, selectedUser.id, { size: 100 })
                console.log('mess', res)

                setMessages(res.content)
            } catch (e) {
                console.error('Failed to fetch chat history', e)
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated && user.id) {
            ;(async () => {
                const res = await chatApi.getUserChattedWithUser(user.id)
                const res2 = await shopApi.onlineMany(res.map((u) => u.id))
                const users = Array(res.length)
                    .fill(null)
                    .map((_, i) => ({ ...res2[i], ...res[i] }))

                setUsers(users)

                // setUsers(res)
                // Check if selectedUserDefault is provided and not in the list
                // if (selectedUserDefault) {
                //     const userExists = res.some((u) => u.id === selectedUserDefault.id)
                //     if (!userExists) {
                //         setUsers((prevUsers) => [...prevUsers, selectedUserDefault])
                //     }
                //     setSelectedUser(selectedUserDefault)
                // }
            })()

            const destination = `/user/${user.id}/private`

            socketService.subscribe(destination, handleReceiverNewMessage, (e) => setError(e))

            return () => {
                socketService.removeCallback(destination, handleReceiverNewMessage)
            }
        }
    }, [isAuthenticated, user.id])

    useEffect(() => {
        fetchChatHistory()
    }, [selectedUser, isAuthenticated, user])

    const handleSendMessage = async () => {
        if (selectedUser && input.trim() && user && socketService.isConnected()) {
            const newMessage: ChatPayload = {
                id: new Date().getTime().toString(), // tạo ID duy nhất dựa trên timestamp
                isRead: false,
                type: 'TEXT',
                senderId: user.id,
                receiverId: selectedUser.id,
                message: input,
                createdAt: moment(new Date()).format(dateFormat),
            }

            socketService.sendMessage('/app/chat.send', {
                message: input,
                senderId: user.id,
                receiverId: selectedUser.id,
            })

            setInput('')

            setMessages((prev) => {
                const messageExists = prev.some((msg) => msg.id === newMessage.id)
                if (!messageExists) {
                    return [...prev, newMessage]
                }
                return prev
            })
        }
    }

    return (
        <div {...rest}>
            <div className="bg-white border-[1px] rounded-lg w-[50rem]">
                {/* header */}
                <div className="p-4 flex justify-between border-b-[1px]">
                    <div className="flex">
                        <Avatar src={user?.image} />
                        <p>{user?.name}</p>
                    </div>
                    <div>
                        <Button icon={<IoCloseSharp />} onClick={() => setVisible(false)}></Button>
                    </div>
                </div>

                <div className="grid grid-cols-5 h-[30rem]">
                    {/* list user */}
                    <div className="col-span-2 border-r-[1px]">
                        <div className="flex">
                            <Input
                                placeholder="tìm kiếm"
                                prefix={<BiSearch />}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                icon={<CgClose />}
                                onClick={() => {
                                    setSearch('')
                                    setShowResult(false)
                                    setResultSearch([])
                                }}
                            ></Button>
                        </div>
                        <div className="h-full overflow-y-scroll">
                            {/* hiển thị search */}

                            {showResult && resultSearch.length === 0 && (
                                <p>Không tìm thấy kết quả</p>
                            )}
                            {showResult &&
                                resultSearch.length > 0 &&
                                resultSearch.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-1 px-3 hover:bg-blue-400 flex justify-between cursor-pointer"
                                        onClick={() => {
                                            setSelectedUser(user)
                                            setShowResult(false)
                                            setResultSearch([])
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <Avatar src={user.image} />
                                            <div className="ml-2">
                                                <p>{user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    text chat demo
                                                </p>
                                            </div>
                                        </div>
                                        <TimeCount
                                            createdAt="23-07-2024 05:00:16"
                                            className="text-sm"
                                        />
                                    </div>
                                ))}

                            {/* không search */}
                            {!showResult &&
                                users &&
                                users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-1 px-3 hover:bg-blue-400 flex justify-between cursor-pointer"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div className="flex items-center">
                                            <Avatar src={user.image} />
                                            <div className="ml-2">
                                                <p>{user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    text chat demo
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {user.isOnline ? (
                                                'Đang online'
                                            ) : (
                                                <TimeCount
                                                    createdAt={user.time}
                                                    className="text-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* chat box */}
                    {selectedUser ? (
                        <div className="col-span-3 flex flex-col">
                            <div className="p-1 px-3 flex justify-between border-b-[1px]">
                                <div className="flex items-center">
                                    <Avatar src={selectedUser?.image} />
                                    <div className="ml-2">
                                        <p>{selectedUser?.name}</p>
                                        <p className="text-sm text-gray-500">text chat demo</p>
                                    </div>
                                </div>
                                <Button type="link" icon={<BsThreeDots />}></Button>
                            </div>
                            <div className="flex-grow overflow-y-scroll p-4">
                                <ChatBox chats={messages} />
                            </div>
                            <div className="flex p-4 border-t-[1px]">
                                <Input
                                    placeholder="Nhập nội dung chat"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-grow mr-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendMessage()
                                    }}
                                />
                                <Button onClick={handleSendMessage}>Gửi</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full">-</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatComponent
