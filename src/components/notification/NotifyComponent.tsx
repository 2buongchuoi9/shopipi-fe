import { useAuth } from '@/hooks'
import notifyApi, { Notify } from '@/http/notifyApi'
import { Avatar, Badge, Dropdown, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { IoNotifications } from 'react-icons/io5'
import TimeCount from '../TimeCount'
import socketService from '@/socketService'
import useChat from '@/hooks/useChat'

const Item = ({ notify }: { notify: Notify }) => {
    const { content, createdAt, userFrom, read } = notify

    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center">
                <Avatar src={userFrom.image} size={'small'} className="bg-blue-500">
                    {notify.content[0]}
                </Avatar>
                <div className="ml-2">
                    <p className="text-sm font-semibold">{notify.content}</p>
                    <p className="text-xs text-gray-500">
                        <TimeCount createdAt={notify.createdAt} />
                    </p>
                </div>
            </div>
            <div>{!read && <p className="bg-blue-600 w-2 h-2 rounded-full"></p>}</div>
        </div>
    )
}

const NotifyComponent = () => {
    const { user } = useAuth()
    const [notifies, setNotifies] = useState<Notify[]>([])
    const [query, setQuery] = useState({ page: 0, size: 10, sort: 'createdAt,asc', last: false })
    const { newNotification, setNewNotification } = useChat()

    const fetchNotifies = async () => {
        const res = await notifyApi.get(user.id, { page: 0, size: 100 })
        setNotifies(res.content)
        setQuery((prev) => ({ ...prev, last: res?.last ?? false }))
    }

    useEffect(() => {
        ;(async () => {
            await fetchNotifies()
        })()
    }, [query.page])

    return (
        <div>
            <Dropdown
                trigger={['click']}
                menu={{
                    items: notifies.map((notify) => ({
                        key: notify.id,
                        label: <Item notify={notify} />,
                        onClick: () => {
                            socketService.changeNotifyRead(notify.id)
                            setNotifies((prev) =>
                                prev.map((n) => (n.id === notify.id ? { ...n, read: true } : n))
                            )
                        },
                    })),
                }}
                overlayClassName="overflow-y-scroll bg-white border-[1px] rounded-lg w-96 h-[500px] shadow-lg"
                // openClassName="bg-red-500"
                dropdownRender={(menu) => <div className=" ">{menu}</div>}
            >
                <Tooltip title="thông báo">
                    <Badge dot={newNotification}>
                        <Avatar
                            icon={<IoNotifications />}
                            size={'small'}
                            className="bg-gray-500"
                            onClick={() => setNewNotification(false)}
                        />
                    </Badge>
                </Tooltip>
            </Dropdown>
        </div>
    )
}
export default NotifyComponent
