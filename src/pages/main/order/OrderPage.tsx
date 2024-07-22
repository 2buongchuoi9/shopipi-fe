import ModalDiscount from '@/components/ModalDiscount'
import { useAuth, useCart, useMessage } from '@/hooks'
import authApi, { User } from '@/http/authApi'
import { CartItem, ShopOrderItem } from '@/http/cartApi'
import { Discount } from '@/http/discountApi'
import orderApi, { OrderRequest } from '@/http/OrderApi'
import { OrderPayment, OrderShipping } from '@/utils/constants'
import { Button, Form, Input, InputNumber, Radio, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { BsTicketPerforated } from 'react-icons/bs'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import { IoLocationSharp } from 'react-icons/io5'

const StyleHiddenTableOnlyHeard = () => (
    <style>{`
    #hidden-table .ant-table-tbody {
        display: none;
        
    }
    #hidden-table .ant-table-thead > tr > th {
        // background-color: white;
    }
`}</style>
)

const columns: ColumnsType<any> = [
    {
        title: 'Sản phẩm',
        dataIndex: 'id',
        key: 'name',
        className: 'w-1/2',
    },
    {
        title: 'Đơn giá',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'quantity',
        key: 'quantity',
    },
]

const columnsShopOrder: ColumnsType<CartItem> = [
    {
        title: (
            <div className="space-x-3">
                <span>Tên sản phẩm</span>
            </div>
        ),
        dataIndex: 'id',
        key: 'product.id',
        className: 'w-1/2',
        render: (_, { product, variant: { valueVariant } }) => (
            <div className="flex space-x-3">
                <div className="flex w-3/5 space-x-2">
                    <div className="aspect-square w-20">
                        <img src={product.thumb} alt={product.name} className="w-full" />
                    </div>
                    <p className="text-clip line-clamp-2 w-full ">{product.name}</p>
                </div>
                <div className="w-2/5">
                    <div>Phân loại</div>
                    <div>{valueVariant.map((v) => `${v.key}: ${v.value}`).join(' - ')}</div>
                </div>
            </div>
        ),
    },
    {
        title: 'Đơn giá',
        dataIndex: 'name',
        key: 'product.price',
        render: (_, { product: { price } }) => (
            <div>
                <p className="line-through">{price}đ</p>
            </div>
        ),
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'quantity',
        key: 'product.price * quantity',
        render: (_, { price, quantity }) => price * quantity,
    },
]

type Props = {
    shopItem: ShopOrderItem
    onChangeDiscount: (discount: Discount) => void
}

const ShopOrder = ({ shopItem, onChangeDiscount }: Props) => {
    const { shopId, items } = shopItem
    const [shop, setShop] = useState<User>()
    const [open, setOpen] = useState(false)
    console.log('shopItem', shopItem)

    useEffect(() => {
        ;(async () => {
            const shop = await authApi.getShop(shopId)
            setShop(shop)
        })()
    }, [shopId])

    return (
        <div className="bg-red-50 rounded-2xl border-[1px]">
            {shop && (
                <ModalDiscount
                    isOpen={open}
                    onCancel={() => setOpen(false)}
                    shop={shop}
                    onOk={(discount) => {
                        console.log('discount', discount)
                        if (discount) onChangeDiscount(discount)
                        setOpen(false)
                    }}
                    totalMinOrder={shopItem.total}
                />
            )}

            <div className="flex items-center space-x-3 pl-5">
                <p>{shop?.name}</p>
                <Button type="link" className="text-blue-500" icon={<HiChatBubbleLeftRight />}>
                    Chat ngay
                </Button>
            </div>

            <Table
                columns={columnsShopOrder}
                showHeader={false}
                dataSource={items.map((item) => ({
                    ...item,
                    key: item.variant.id,
                }))}
                pagination={false}
                footer={() => (
                    <div className="flex justify-between items-center">
                        <div className="pl-8 flex items-center space-x-2">
                            <BsTicketPerforated />
                            <span>{`Voucher của ${shop?.name} giảm đến 25%`}</span>
                            <Button type="link" size="small" onClick={() => setOpen(true)}>
                                Xem thêm voucher (làm sau)
                            </Button>
                        </div>
                        <div>
                            <Form.Item label="Lời nhắn cho shop">
                                <Input className="w-96" />
                            </Form.Item>
                            <div className="flex items-center space-x-3 justify-end text-6sm">
                                <span>{`Tổng số tiền (${
                                    shopItem.items.flatMap((v) => v).length ?? 0
                                } sản phầm): `}</span>
                                <p className="text-lg text-blue-500">{shopItem?.total ?? 0}đ</p>
                                <span className="flex items-center space-x-3">
                                    Tiết kiệm:
                                    <p className="text-lg text-blue-500">
                                        {shopItem.totalDiscount}đ
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

const OrderPage = () => {
    const { success, error } = useMessage()
    const { resultCheckoutReview: checkout, setOrderRequest, orderRequest } = useCart()
    const { user } = useAuth()
    const [selectedPayment, setSelectedPayment] = useState<keyof typeof OrderPayment>('CASH')
    const [selectedShipping, setSelectedShipping] = useState<keyof typeof OrderShipping>('NORMAL')

    // if (resultCheckoutReview?.items.length === 0) return 'nhu con c'

    const handleChangeDiscount = (discount: Discount, shopId: string) => {
        if (discount) {
            setOrderRequest(
                (prev) =>
                    ({
                        ...prev,
                        shopOrderItems: prev?.shopOrderItems.map((item) => {
                            if (item.shopId === shopId) {
                                return {
                                    ...item,
                                    discountId: discount.id,
                                }
                            }
                            return item
                        }),
                    } as OrderRequest)
            )
        }
    }

    useEffect(() => {
        setOrderRequest((prev) => {
            if (prev) {
                return {
                    ...prev,
                    payment: selectedPayment,
                }
            }
            return prev
        })
    }, [selectedPayment])

    useEffect(() => {
        setOrderRequest((prev) => {
            if (prev) {
                return {
                    ...prev,
                    shippingType: selectedShipping,
                }
            }
            return prev
        })
    }, [selectedShipping])

    const handleOrderByUser = async () => {
        console.log('cccc')

        if (orderRequest) {
            if (orderRequest.payment === 'CASH') {
                try {
                    const res = await orderApi.orderByUser(orderRequest)
                    console.log('res', res)
                    success('Đặt hàng thành công')
                } catch (e) {
                    console.log('Failed to order by user', e)
                    error('Đặt hàng thất bại')
                }
            } else {
                try {
                    const res = await orderApi.orderByUser_redirectPayment(
                        orderRequest,
                        'http://localhost:5174/product'
                    )
                    console.log('res', res)
                    const url = res.url
                    console.log('url', url)
                    if (url) {
                        window.location.href = url
                    }
                    success('Đặt hàng thành công')
                } catch (e) {
                    console.log('Failed to order by user', e)
                    error('Đặt hàng thất bại')
                }
            }
        }
    }

    return (
        <div className="py-5 space-y-5">
            <div className="border-[1px] rounded-lg p-4 space-y-2 bg-white">
                <div className="flex items-center space-x-2 text-blue-500 text-xl">
                    <IoLocationSharp />
                    <p>Địa chỉ nhận hàng</p>
                </div>
                <div className=" pr-80">
                    <Form.Item label={`${user.name} (${user.email})`}>
                        <Input />
                    </Form.Item>
                </div>
            </div>

            <div>
                <div id="hidden-table" className=" border-[1px] border-b-0 rounded-lg">
                    {/* only header table */}
                    <StyleHiddenTableOnlyHeard />
                    <Table columns={columns} locale={{ emptyText: ' ' }} />
                </div>

                <div className="space-y-5">
                    {checkout?.items.map((shopItem) => (
                        <ShopOrder
                            shopItem={shopItem}
                            key={shopItem.shopId}
                            onChangeDiscount={(discount) =>
                                handleChangeDiscount(discount, shopItem.shopId)
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="bg-white">
                <div className="flex justify-end border-dashed border-b-[1px] p-3">
                    <div className="pl-8 flex items-center space-x-2 ">
                        <BsTicketPerforated />
                        <span>Voucher của shopipi</span>
                        <Button type="link" size="small">
                            Xem thêm voucher (làm sau)
                        </Button>
                    </div>
                </div>
                <div className="border-dashed border-b-[1px] p-3 flex items-center space-x-6">
                    <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
                    <Radio.Group
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        value={selectedPayment}
                        className="flex space-x-3"
                    >
                        {Object.entries(OrderPayment).map(([key, value]) => (
                            <div className="space-y-4" key={key}>
                                <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                                    <Radio value={key} className="mr-4">
                                        {value}
                                    </Radio>
                                    <span className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                                        <i className="icon-truck"></i>{' '}
                                        {/* Replace with appropriate icon */}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </Radio.Group>
                </div>
                <div className="border-dashed border-b-[1px] p-3 ">
                    <h2 className="text-lg font-semibold mb-4">Phương thức Giao hàng</h2>
                    <Radio.Group
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        value={selectedShipping}
                        className="flex space-x-3"
                    >
                        {Object.entries(OrderShipping)
                            .filter(([key]) => key !== 'NONE')
                            .map(([key, { name, price, time }]) => (
                                <div className="space-y-4" key={key}>
                                    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                                        <Radio value={key} className="mr-4">
                                            <p>{name}</p>
                                            <div className="flex justify-between">
                                                <p className="text-[12px]">{`(${time})`}</p>
                                                <p>{price / 1000}k</p>
                                            </div>
                                        </Radio>
                                    </div>
                                </div>
                            ))}
                    </Radio.Group>
                </div>
                <div className="flex justify-end border-dashed border-b-[1px] p-3">
                    <div className="grid grid-cols-2 w-72">
                        <p>Tổng tiền hàng:</p>
                        <p className="flex justify-end text-blue-500 text-xl">
                            {checkout?.totalOrder}đ
                        </p>

                        <p>Phí vận chuyển:</p>
                        <p className="flex justify-end text-blue-500 text-xl">
                            {checkout?.totalShipping}đ
                        </p>

                        <p>Tổng voucher:</p>
                        <p className="flex justify-end text-blue-500 text-xl">
                            -{checkout?.totalDiscount}đ
                        </p>

                        <p>Tổng thanh toán:</p>
                        <p className="flex justify-end text-blue-500 text-xl">
                            {checkout?.totalCheckout}đ
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between border-dashed border-b-[1px] p-3">
                    <p>
                        Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
                        <Button type="link" size="small">
                            Điều khoản Shopipi
                        </Button>
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        className="rounded-lg"
                        onClick={handleOrderByUser}
                    >
                        Đặt hàng
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default OrderPage
