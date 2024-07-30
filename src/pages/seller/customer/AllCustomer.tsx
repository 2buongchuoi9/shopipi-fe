import { useAuth } from '@/hooks'
import { ParamsRequest, Shop } from '@/http'
import shopApi from '@/http/shopApi'
import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { size } from 'lodash'
import { useEffect, useState } from 'react'

const initQuery = {
    page: 0,
    size: 10,
    keySearch: '',
}

const AllCustomer = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState<Shop[]>([])
    const [query, setQuery] = useState<ParamsRequest>(initQuery)

    const fetchUsers = async () => {
        const res = await shopApi.getUserFollow(user.id)
        setUsers(res.content)
    }

    useEffect(() => {
        ;(async () => {
            await fetchUsers()
        })()
    }, [user.id, query.page, query.size])

    const columns: ColumnsType<Shop> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (name, { image, roles }) => (
                <div className="flex">
                    {!roles.includes('MOD') && (
                        <img src={image ?? ''} alt="" className="w-10 h-10 rounded-full" />
                    )}
                    <span>{name}</span>
                </div>
            ),
        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
        },
    ]

    return (
        <div>
            <p>Khách hàng đã đăng ký</p>

            <Table columns={columns} dataSource={users} />
        </div>
    )
}
export default AllCustomer
