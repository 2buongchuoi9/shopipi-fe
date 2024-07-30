import { useAuth, useMessage } from '@/hooks'
import { useEffect, useState } from 'react'
import orderApi, { Order } from '@/http/OrderApi'
import { title } from 'process'
import productApi, { Product } from '@/http/productApi'
import { ProductState } from '@/utils/constants'
import { Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import DashboardCart from '@/components/DashboardCart'

const op: { [key: string]: any } = {
    total: { title: 'Số lượng đơn hàng', description: 'Số lượng đơn hàng' },
    revenue: { title: 'Doanh thu', description: 'Doanh thu khi đơn hàng đã được thanh toán' },
    profit: { title: 'Lợi nhuận', description: 'Lợi nhuận bán hàng' },
    capital: { title: 'vốn', description: 'Tổng vốn của sản phẩm bán được' },
    pending: { title: 'Đơn hàng chờ xử lý', description: 'Số lượng đơn hàng cần xử lý' },
    countProduct: { title: 'Số lượng sản phẩm', description: 'Số lượng sản phẩm' },
}

type Option = {
    total: number
    revenue: number
    profit: number
    capital: number
    pending: number
    countProduct: number
}

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState<Order[]>([])
    const [options, setOptions] = useState<Option>({
        capital: 0,
        profit: 0,
        revenue: 0,
        total: 0,
        pending: 0,
        countProduct: 0,
    })
    const [pending, setPending] = useState<Order[]>([])
    const [topProductSold, setTopProductSold] = useState<Product[]>([])
    const { loading, success } = useMessage()

    console.log('orders', orders)

    const fetchOrder = async () => {
        loading('Đang tải dữ liệu')
        const res = await orderApi.get({ shopId: user.id, size: 1000 })
        const { countProduct } = await productApi.countProduct(user.id)
        const topProductSold = await productApi.getAll({
            size: 5,
            page: 0,
            sort: 'sold,desc',
            shopId: user.id,
            state: 'ACTIVE',
        })
        console.log('topProductSold', topProductSold)

        let revenue = 0
        let profit = 0
        let capital = 0

        res.content.forEach((order) => {
            revenue += order.revenue
            profit += order.profit
            capital += order.capital
        })

        const pending = res.content.filter((order) => order.state === 'PENDING')

        setTopProductSold(topProductSold.content)
        setPending(pending)
        setOptions({
            revenue,
            profit,
            capital,
            total: res.content.length,
            pending: pending.length,
            countProduct,
        })
        setOrders(res.content)
        success('Tải dữ liệu thành công')
    }

    useEffect(() => {
        ;(async () => {
            await fetchOrder()
        })()
    }, [])

    return (
        <div className="space-y-3">
            <div>
                <p>Tổng quan</p>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {Object.entries(options).map(([key, value]) => (
                    <DashboardCart
                        description={op[key].description}
                        key={key}
                        title={key}
                        value={
                            key === 'total' || key === 'pending' || key === 'countProduct'
                                ? value
                                : value.vnd()
                        }
                    />
                ))}
            </div>

            <div className="w-full flex space-x-3">
                <div className="w-1/2">
                    <Table
                        columns={[
                            {
                                title: 'Sản phẩm',
                                dataIndex: 'cc',
                                key: 'cc',
                                render: (_, { items }) => {
                                    const products = items[0].items

                                    return products.map(
                                        ({ product: { name, thumb, id }, quantity }) => (
                                            <div key={id} className="flex space-x-2">
                                                <img src={thumb} alt={name} className="w-10 h-10" />
                                                <div>
                                                    <p>{name}</p>
                                                    <p>x{quantity}</p>
                                                </div>
                                            </div>
                                        )
                                    )
                                },
                            },
                            {
                                title: 'Trạng thái',
                                dataIndex: 'state',
                                key: 'state',
                                render: (_, { state, createdAt }) => (
                                    <div>
                                        <Tag color="orange">{state}</Tag>
                                        {createdAt}
                                    </div>
                                ),
                            },
                            {
                                title: 'Tổng tiền',
                                dataIndex: 'totalCheckout',
                                key: 'totalCheckout',
                                render: (value) => value.vnd(),
                            },
                        ]}
                        onRow={(record) => ({
                            onClick: () => {
                                navigate(`/seller/order/all`)
                            },
                            className: 'cursor-pointer',
                        })}
                        dataSource={pending}
                        pagination={false}
                        bordered
                        title={() => 'Đơn hàng chờ xử lý'}
                    />
                </div>
                <div className="w-1/2">
                    <Table
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'name',
                                key: 'name',
                                render: (_, { name, thumb }) => (
                                    <div className="flex space-x-2">
                                        <img src={thumb} alt={name} className="w-10 h-10" />
                                        <p>{name}</p>
                                    </div>
                                ),
                            },
                            {
                                title: 'Số lượng bán',
                                dataIndex: 'sold',
                                key: 'sold',
                            },
                        ]}
                        dataSource={topProductSold}
                        pagination={false}
                        bordered
                        title={() => 'Top sản phẩm bán chạy'}
                    />
                </div>
            </div>
        </div>
    )
}
export default Dashboard
