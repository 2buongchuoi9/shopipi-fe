import { useMessage } from '@/hooks'
import { ParamsRequest } from '@/http'
import { User } from '@/http/authApi'
import shopApi from '@/http/shopApi'
import { UserRoles } from '@/utils/constants'
import { Button, Tabs, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const initQuery = {
    page: 0,
    size: 10,
    sort: 'createdAt',
    keySearch: '',
    role: UserRoles.USER,
    status: '',
}

const AllCustomer = () => {
    const [shops, setShops] = useState<User[]>([])
    const [query, setQuery] = useState<ParamsRequest>(initQuery)
    const { success, error } = useMessage()
    console.log('shops', shops)

    const handleChangeStatus = async (id: string) => {
        try {
            const res = await shopApi.changeStatus(id)
            await fetchShop()
            success('Thay đổi trạng thái thành công')
        } catch (e) {
            error('Thay đổi trạng thái thất bại')
        }
    }

    const fetchShop = async () => {
        const data = await shopApi.findShop(query)
        setShops(data.content)
    }

    useEffect(() => {
        ;(async () => {
            await fetchShop()
        })()
    }, [query.keySearch, query.page, query.size, query.sort, query.status, query.role])

    const columns: ColumnsType<User> = [
        {
            title: 'Tên shop',
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>{status ? 'Đang hoạt động' : 'Tạm khóa'}</Tag>
            ),
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
            render: (_, { id, status, roles }) => {
                if (roles.includes('MOD')) return <Button>xóa</Button>
                return (
                    <div>
                        {status ? (
                            <Button className="text-red-500" onClick={() => handleChangeStatus(id)}>
                                khóa
                            </Button>
                        ) : (
                            <Button
                                className="text-green-500"
                                onClick={() => handleChangeStatus(id)}
                            >
                                Mở khóa
                            </Button>
                        )}
                    </div>
                )
            },
        },
    ]

    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                items={[
                    { key: '', label: 'Tất cả' },
                    { key: 'true', label: 'Đang hoạt động' },
                    { key: 'false', label: 'Tạm khóa' },
                    {
                        key: 'MOD',
                        label: 'Chưa đăng ký',
                        children: <Button>xóa tất cả user chưa đăng ký</Button>,
                    },
                ]}
                onChange={(key) => {
                    if (key === 'MOD') setQuery({ ...query, role: 'MOD' })
                    else
                        setQuery({
                            ...query,
                            role: UserRoles.USER,
                            status: key === '' ? null : key,
                        })
                }}
            />

            <Table columns={columns} dataSource={shops} />
        </div>
    )
}
export default AllCustomer
