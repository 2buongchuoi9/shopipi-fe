import ModalRatingProduct from '@/components/ModalRatingProduct'
import { useAuth } from '@/hooks'
import useChat from '@/hooks/useChat'
import { Product, Variant } from '@/http'
import orderApi, { Order } from '@/http/OrderApi'
import { OrderState } from '@/utils/constants'
import { Button, Input, Tabs } from 'antd'
import { size, update } from 'lodash'
import { useEffect, useState } from 'react'
import { FaStore } from 'react-icons/fa'
import { IoIosChatboxes } from 'react-icons/io'
import { Link } from 'react-router-dom'

const initialQuery = {
    page: 0,
    size: 100,
    state: '',
    keySearch: '',
}

const Item = ({ order }: { order: Order }) => {
    const { setVisible, setSelectedUser } = useChat()
    const [open, setOpen] = useState(false)
    const [selectProduct, setSelectProduct] = useState<Product | null>(null)
    const [variant, setVariant] = useState<Variant | null>(null)

    const { items, state, notes, totalCheckout } = order
    const { items: product } = items[0]
    const { shop } = product[0].product

    const handleShowChat = () => {
        console.log('handleShowChat')

        setVisible(true)
        setSelectedUser(shop)
    }

    return (
        <div className="bg-white p-3">
            {/* header */}
            <div className="flex justify-between items-center border-b-[1px] pb-2">
                <div className="flex items-center space-x-2">
                    <FaStore />
                    <p className="font-bold">{shop.name}</p>
                    <Button
                        type="primary"
                        icon={<IoIosChatboxes />}
                        onClick={handleShowChat}
                        size="small"
                    >
                        Chat
                    </Button>
                    <Button icon={<FaStore />} size="small">
                        <Link to={`/shop/${shop.slug}`}>Xem shop</Link>
                    </Button>
                </div>
                <div className="flex items-center">
                    <p className="text-red-600">
                        {/* <p>{notes[notes.length - 1]}</p> */}
                        {OrderState[state as keyof typeof OrderState].toLocaleUpperCase()}
                    </p>
                </div>
            </div>

            {/* sản phẩm */}
            <div className="border-b-[1px]">
                {product.map((item, index) => (
                    <div className="flex p-2 justify-between items-center" key={index}>
                        <ModalRatingProduct
                            open={open}
                            onCancel={() => setOpen(false)}
                            product={item.product}
                            variant={item.variant}
                        />

                        <div className="flex items-center space-x-2">
                            <Link to={`/product/${item.product.slug}`}>
                                <img
                                    src={item.product.thumb}
                                    alt=""
                                    className="w-20 h-20 object-cover"
                                />
                            </Link>
                            <div className="">
                                <Link to={`/product/${item.product.slug}`}>
                                    <p>{item.product.name}</p>
                                </Link>
                                <p className="text-gray-500 text-sm">
                                    phân loại hàng:{' '}
                                    {item.variant.valueVariant.map((v) => v.value).join(' ')}
                                </p>
                                <p>x{item.quantity}</p>
                                <Button size="small" type="dashed" onClick={() => setOpen(true)}>
                                    đánh giá sản phẩm
                                </Button>
                            </div>
                        </div>
                        <span className="space-x-2">
                            <span className="line-through text-gray-400">
                                {item.variant.priceSale?.vnd()}
                            </span>
                            <span className="text-green-600 font-semibold">
                                {item.variant.price?.vnd()}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {/* foot */}
            <div className="flex justify-end">
                <div className="space-y-3">
                    <div className="flex justify-end space-x-2 items-center">
                        <p> thành tiền:</p>
                        <span className="text-green-600 font-semibold text-xl">
                            {totalCheckout?.vnd()}
                        </span>
                    </div>
                    <div className="space-x-3">
                        <Button type="primary">Mua lại</Button>
                        <Button>Xem chi tiết</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const OrderUser = () => {
    const { user } = useAuth()
    const [query, setQuery] = useState(initialQuery)
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrders = async () => {
        const res = await orderApi.get({ userId: user?.id, ...query })
        setOrders(res.content)
    }

    useEffect(() => {
        ;(async () => {
            await fetchOrders()
        })()
    }, [user.id, query.keySearch, query.state])

    return (
        <div className="p-5 space-y-4">
            <p className="text-xl ">Đơn hàng của tôi</p>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: '',
                        label: 'Tất cả',
                    },
                    ...Object.keys(OrderState).map((key) => ({
                        key,
                        label: OrderState[key as keyof typeof OrderState],
                    })),
                ]}
                className="px-3 bg-white"
                onChange={(key) => setQuery((prev) => ({ ...prev, state: key }))}
            />
            <Input placeholder="Tìm đơn hàng theo mã đơn hàng, nhà bán hàng, tên sản phẩm" />

            {size(orders) === 0 ? (
                <div>
                    <p>Không có đơn hàng nào</p>
                </div>
            ) : (
                orders.map((order) => <Item key={order.id} order={order} />)
            )}
        </div>
    )
}
export default OrderUser
