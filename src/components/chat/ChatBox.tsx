import React from 'react'
import { List, Typography, Divider } from 'antd'
import { ChatPayload } from '@/socketService'
import { useAuth } from '@/hooks'
import { groupChatsBySender } from '@/utils'
import TimeComment from '../comment/TimeComment'

const { Text } = Typography

interface ChatBoxProps {
    chats: ChatPayload[]
}

const ChatBox: React.FC<ChatBoxProps> = ({ chats }) => {
    const {
        user: { id: currentUserId },
    } = useAuth()
    // Group messages by sender and time
    const groupedChats = groupChatsBySender(chats)

    return (
        <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-100">
            {groupedChats.map((group, index) => (
                <div key={index}>
                    <div className="text-center my-4 text-gray-500 text-sm font-semibold">
                        {/* nếu cách group khác phía trước 1 ngày thì hiện thời gian */}
                        {/* <Text>{group.createdAt}</Text> */}

                        {/* nếu cách group khác phía trước 1 ngày thì hiện ngày */}
                        <Text>
                            {index !== 0 &&
                                groupedChats[index - 1].createdAt.substring(0, 10) !==
                                    group.createdAt.substring(0, 10) &&
                                group.createdAt}
                        </Text>
                    </div>
                    <List
                        dataSource={group.chats}
                        renderItem={(item, i) => (
                            <List.Item
                                className="mb-2"
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        item.senderId === currentUserId ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    className={`p-1 rounded-lg ${
                                        item.senderId === currentUserId ? 'bg-blue-200' : 'bg-white'
                                    } shadow-md max-w-[60%]`}
                                    onClick={() =>
                                        console.log(
                                            item,
                                            item.senderId === currentUserId && 'người gửi là bạn'
                                        )
                                    }
                                >
                                    <Text>{item.message}</Text>
                                    <div className="text-xs text-gray-400 mt-1 text-right">
                                        <TimeComment createdAt={item.createdAt} />
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    {/* Optional: Add a divider between groups */}
                    {index < groupedChats.length - 1 && <Divider />}
                </div>
            ))}
        </div>
    )
}

export default ChatBox
