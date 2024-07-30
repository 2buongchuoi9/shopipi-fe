import { useMessage } from '@/hooks'
import { ParamsRequest, Shop } from '@/http'
import shopApi from '@/http/shopApi'
import { UserRoles } from '@/utils/constants'
import { Button, Tabs, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { status } from 'nprogress'
import { useEffect, useState } from 'react'

const initQuery = {
    page: 0,
    size: 10,
    sort: 'createdAt',
    keySearch: '',
    role: UserRoles.Shop,
    status: '',
}

type Shop_ = Shop & { countProduct: number }

const AllShop = () => {
    const [shops, setShops] = useState<Shop_[]>([])
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

        const ids = data.content.map((shop) => shop.id)
        const ok = await shopApi.countProduct(ids)
        console.log('Type of ok:', typeof ok)
        console.log('okhgkfdklsd', ok)

        setShops(data.content.map((shop) => ({ ...shop, countProduct: ok.get(shop.id) ?? 0 })))
    }

    useEffect(() => {
        ;(async () => {
            await fetchShop()
        })()
    }, [query.keySearch, query.page, query.size, query.sort, query.status])

    const columns: ColumnsType<Shop_> = [
        {
            title: 'Tên shop',
            dataIndex: 'name',
            key: 'name',
            render: (name, { image }) => (
                <div className="flex">
                    <img src={image ?? ''} alt="" className="w-10 h-10 rounded-full" />
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
            title: 'Số lượng sản phẩm',
            dataIndex: 'countProduct',
            key: 'countProduct',
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
            render: (_, { id, status }) => (
                <div>
                    {status ? (
                        <Button className="text-red-500" onClick={() => handleChangeStatus(id)}>
                            khóa
                        </Button>
                    ) : (
                        <Button className="text-green-500" onClick={() => handleChangeStatus(id)}>
                            Mở khóa
                        </Button>
                    )}
                </div>
            ),
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
                ]}
                onChange={(key) => setQuery({ ...query, status: key === '' ? null : key })}
            />

            <Table columns={columns} dataSource={shops} />
        </div>
    )
}
export default AllShop
