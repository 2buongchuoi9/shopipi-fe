import { useAuth } from '@/hooks'
import Cart from './Cart'
import { useEffect, useState } from 'react'
import orderApi, { Order } from '@/http/OrderApi'
import { title } from 'process'

const op: { [key: string]: any } = {
    total: { title: 'Số lượng đơn hàng', description: 'Số lượng đơn hàng' },
    revenue: { title: 'Doanh thu', description: 'Doanh thu khi đơn hàng đã được thanh toán' },
    profit: { title: 'Lợi nhuận', description: 'Lợi nhuận bán hàng' },
    capital: { title: 'vốn', description: 'Tổng tiền nhập hàng' },
    pending: { title: 'Đơn hàng chờ xử lý', description: 'Số lượng đơn hàng cần xử lý' },
}

type Option = {
    total: number
    revenue: number
    profit: number
    capital: number
}

const Dashboard = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [options, setOptions] = useState<Option>({ capital: 0, profit: 0, revenue: 0, total: 0 })

    console.log('orders', orders)

    const fetchOrder = async () => {
        const res = await orderApi.get()

        let total = 0
        let revenue = 0
        let profit = 0
        let capital = 0

        res.content.forEach((order) => {
            revenue += order.revenue
            profit += order.profit
            capital += order.capital
        })

        setOptions({ total: res.content.length, revenue, profit, capital })

        setOrders(res.content)
    }

    useEffect(() => {
        ;(async () => {
            await fetchOrder()
        })()
    }, [])

    return (
        <div>
            <div>
                <p>Tổng quan</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
                {Object.entries(options).map(([key, value]) => (
                    <Cart
                        description={op[key].description}
                        key={key}
                        title={key}
                        value={key === 'total' ? value : value.vnd()}
                    />
                ))}
            </div>
        </div>
    )
}
export default Dashboard
