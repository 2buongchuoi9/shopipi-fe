import ModalDiscount from '@/components/ModalDiscount'
import QuantitySelector from '@/components/QuantitySelector'
import { useAuth, useCart, useDebounce, useMessage } from '@/hooks'
import authApi, { User } from '@/http/authApi'
import { CartItem, CartRequest, ShopOrderItem } from '@/http/cartApi'
import { ShopOrderItemsRequest } from '@/http/OrderApi'
import { randomPriceDiscount } from '@/utils'
import { Button, Checkbox, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { BsTicketPerforated } from 'react-icons/bs'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'

const StyleHiddenTableOnlyHeard = () => (
    <style>{`
    #hidden-table .ant-table-tbody {
        display: none;
    }
`}</style>
)

const columns: ColumnsType<any> = [
    {
        title: 'Tên sản phẩm',
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
    {
        title: 'Thao tác',
        dataIndex: 'quantity',
        key: 'quantity',
    },
]

const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center h-96">
            <div className="aspect-video w-32">
                <img src="/logo.png" alt="empty-cart" />
            </div>
            <Link to="/product">
                <Button type="link" className="text-lg font-semibold">
                    Đi mua hàng đi mới có show. đm
                </Button>
            </Link>
        </div>
    )
}

type Props = {
    shopItem: ShopOrderItem
    onChangeSelectedCartRequests: (
        selectedShopOrderItems: CartRequest[] | null,
        discountId: string | null
    ) => void
}

const ShopOrder = ({ shopItem, onChangeSelectedCartRequests }: Props) => {
    const { isAuthenticated } = useAuth()
    const { loading, success, error } = useMessage()
    const { addToCart } = useCart()
    const [cartRequest, setCartRequest] = useState<CartRequest | null>(null)
    const debounce = useDebounce<CartRequest | null>({ value: cartRequest, delay: 500 })
    const [open, setOpen] = useState(false)
    const { shopId, items } = shopItem
    const [shop, setShop] = useState<User>()

    console.log('shopItem', shopItem)

    useEffect(() => {
        ;(async () => {
            const shop = await authApi.getShop(shopId)
            setShop(shop)
        })()
    }, [shopId])

    // update cart when debounce change
    useEffect(() => {
        if (debounce) {
            ;(async () => {
                try {
                    loading('Đang cập nhật giỏ hàng...')
                    await addToCart(debounce)
                    success('Cập nhật giỏ hàng thành công')
                } catch (e) {
                    error('Cập nhật giỏ hàng thất bại')
                }
            })()
        }
    }, [debounce])

    // chọn variant để checkout review -> set request order vào context (xử lí call api, cập nhật result checkout review)
    // -> render lại component

    const rowSelection: TableRowSelection<CartItem> = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            console.log(shopId)
            if (selectedRows.length === 0) {
                onChangeSelectedCartRequests(null, null)
                return
            } else {
                const cartRequests = selectedRows.map(({ quantity, product, variant }) => ({
                    productId: product.id,
                    variantId: variant.id,
                    quantity,
                }))
                onChangeSelectedCartRequests(cartRequests, null)
            }
        },
    }

    const columns: ColumnsType<CartItem> = [
        {
            title: (
                <div className="space-x-3">
                    <Checkbox />
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
            render: (_, { variant: { price, priceSale } }) => (
                <div className="space-x-1">
                    <span className="line-through text-gray-400">{price?.vnd()}</span>
                    <span className="text-green-600 font-semibold">{priceSale?.vnd()}</span>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, { product, variant }) => (
                <QuantitySelector
                    initialQuantity={quantity}
                    disabled={quantity > variant.quantity}
                    onChange={(quantity) => {
                        const data = { productId: product.id, variantId: variant.id, quantity }
                        console.log(data)
                        setCartRequest(data)
                    }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'quantity',
            key: 'product.price * quantity',
            render: (_, { variant: { priceSale }, quantity }) => (priceSale * quantity).vnd(),
        },
        {
            title: 'Thao tác',
            dataIndex: 'quantity',
            key: 'variant.id',
            render: (_, { product, variant }) => (
                <Button
                    type="link"
                    onClick={() => {
                        const data = { productId: product.id, variantId: variant.id, quantity: 0 }
                        console.log(data)
                        setCartRequest(data)
                    }}
                >
                    Xóa
                </Button>
            ),
        },
    ]

    return (
        <div className="bg-red-50 rounded-2xl border-[1px]">
            {shop && (
                <ModalDiscount
                    isOpen={open}
                    onCancel={() => setOpen(false)}
                    shop={shop}
                    onOk={(discount) => {
                        console.log('discount', discount)
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
                columns={columns}
                showHeader={false}
                dataSource={items.map((item) => ({
                    ...item,
                    key: item.variant.id,
                }))}
                pagination={false}
                rowSelection={rowSelection} // Thêm rowSelection vào Table
                footer={() => (
                    <div className="flex justify-between items-center">
                        <div className="pl-8 flex items-center space-x-2">
                            <BsTicketPerforated />
                            <span>{`Voucher của ${shop?.name} giảm đến 25%`}</span>
                            <Button type="link" size="small" onClick={() => setOpen(true)}>
                                Xem thêm voucher (làm sau)
                            </Button>
                        </div>
                        {/* <div>Tổng: {shopItem.total}</div> */}
                    </div>
                )}
            />
        </div>
    )
}

// luồng: call api update (create) cart -> fetch cart in context -> render cart page
const CartPage = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { cart, setOrderRequest, resultCheckoutReview: checkout } = useCart()
    const [shopOrderItemsRequest, setShopOrderItemsRequest] = useState<ShopOrderItemsRequest[]>([])
    const { warning } = useMessage()

    const handleOrder = () => {
        if (isAuthenticated) {
            navigate('/order')
            return
        } else {
            warning('Vui lòng đăng nhập để mua hàng')
            navigate('/login?redirect=/cart')
        }
    }

    // set orderRequest khi shopOrderItemsRequest thay đổi (cập nhật orderRequest) -> resultCheckoutReview thay đổi
    useEffect(() => {
        setOrderRequest(
            shopOrderItemsRequest
                ? {
                      shopOrderItems: shopOrderItemsRequest,
                      address: '',
                      payment: 'CASH',
                      shippingType: 'NONE',
                  }
                : null
        )
    }, [shopOrderItemsRequest])

    const handleCartRequestsChange = (
        cartRequests: CartRequest[] | null,
        discountId: string | null,
        shopId: string
    ) => {
        const foundShopIndex = shopOrderItemsRequest.findIndex((v) => v.shopId === shopId)

        if (cartRequests) {
            const updatedShopOrderItems = [...shopOrderItemsRequest]

            if (foundShopIndex !== -1) {
                updatedShopOrderItems[foundShopIndex] = {
                    ...updatedShopOrderItems[foundShopIndex],
                    items: cartRequests,
                }
            } else {
                updatedShopOrderItems.push({
                    shopId,
                    discountId,
                    items: cartRequests,
                })
            }

            setShopOrderItemsRequest(updatedShopOrderItems)
            console.log('onChangeSelectedCartRequests', cartRequests)
        } else {
            if (foundShopIndex !== -1) {
                const updatedShopOrderItems = shopOrderItemsRequest.filter(
                    (_, index) => index !== foundShopIndex
                )
                setShopOrderItemsRequest(updatedShopOrderItems)
            }
        }
    }

    return !cart ? (
        <EmptyCart />
    ) : (
        <div>
            {/* only header table */}
            <StyleHiddenTableOnlyHeard />

            <div id="hidden-table" className="py-3">
                <Table
                    columns={columns}
                    locale={{ emptyText: ' ' }}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys) => {
                            console.log(`selectedRowKeys: ${selectedRowKeys}`)
                        },
                    }}
                />
            </div>
            <div className="space-y-5">
                {cart.shopOrderItems.map((shopItem) => (
                    <ShopOrder
                        shopItem={shopItem}
                        key={shopItem.shopId}
                        onChangeSelectedCartRequests={(cartRequests, discountId) =>
                            handleCartRequestsChange(cartRequests, discountId, shopItem.shopId)
                        }
                    />
                ))}
            </div>

            <div className="sticky bottom-0 right-0 w-full rounded-2xl border-[1px] mt-3 bg-white">
                <div className="flex justify-end border-dashed border-b-[1px] p-3">
                    <div className="pl-8 flex items-center space-x-2 ">
                        <BsTicketPerforated />
                        <span>Voucher của shopipi</span>
                        <Button type="link" size="small">
                            Xem thêm voucher (làm sau)
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3">
                    <div className="flex items-center ">
                        <Checkbox title="Chọn tất cả">chọn tất cả</Checkbox>
                        <Button type="link">Xóa</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>
                            {`Tạm tính (${
                                checkout?.items.flatMap((v) => v.items).length ?? 0
                            } sản phầm): ${(checkout?.totalCheckout ?? 0).vnd()}`}
                        </div>

                        <Button type="primary" onClick={handleOrder}>
                            Mua hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CartPage
