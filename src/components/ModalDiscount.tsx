import { initialUser, User } from '@/http/authApi'
import discountApi, { Discount } from '@/http/discountApi'
import { DiscountState } from '@/utils/constants'
import { Avatar, Button, Form, Input, Modal, Radio } from 'antd'
import { useEffect, useState } from 'react'
const initialDiscount = {
    code: 'discount 1',
    countUserUseDiscount: 1,
    currentCount: 50,
    dateEnd: '18-05-2024 13:00:00',
    dateStart: '18-04-2024 13:00:00',
    id: '662241d8677b0c390bc9758c',
    isDeleted: null,
    minOrderValue: null,
    name: 'discount 1',
    shop: initialUser,
    state: 'EXPIRED',
    status: true,
    totalCount: 50,
    type: 'FIXED_AMOUNT',
    userUsedIds: [],
    value: 15000,
}

type Props = {
    shop: User
    isOpen: boolean
    totalMinOrder: number
    onOk: (discount: Discount | null) => void
    onCancel: () => void
}

type PropsCartDiscount = {
    discount: Discount
    totalMinOrder: number
    changeSelectedDiscount: (discount: Discount) => void
    selected: boolean
}

const CartDiscount = ({
    discount,
    totalMinOrder,
    selected = false,
    changeSelectedDiscount,
}: PropsCartDiscount) => {
    const { value, minOrderValue, dateEnd, shop, type } = discount
    const usagePercentage =
        ((discount.totalCount - discount.currentCount) / discount.totalCount) * 100
    return (
        <div
            className={`p-2 border rounded-lg shadow-lg max-w-md ${
                minOrderValue > totalMinOrder && 'bg-opacity-10 bg-black'
            }`}
        >
            <div className="flex items-center">
                <div className="mr-2 w-1/6 aspect-video overflow-hidden">
                    <img src={shop?.image ?? '/logo.png'} alt={shop.name} className="" />
                    {/* <Avatar
                        src={shop.image ?? '/logo.png'}
                        size={'large'}
                        shape="square"
                        rootClassName="w-full"
                    /> */}
                </div>
                <div className="w-5/6">
                    <div className="font-bold text-lg">
                        {type === 'FIXED_AMOUNT' ? `Giảm ₫${value / 1000}k` : `Giảm ${value}%`}
                    </div>
                    <div className="text-gray-700">{`Đơn Tối Thiểu ₫${minOrderValue / 1000}k`}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-orange-400 h-2 rounded-full"
                            style={{ width: `${usagePercentage}%` }}
                        ></div>
                    </div>
                    <div className="text-gray-500">{`Đã dùng ${usagePercentage.toFixed(
                        0
                    )}%, HSD: ${dateEnd.substring(0, 10)}`}</div>
                    {/* <div className="text-blue-600 cursor-pointer">Điều Kiện</div> */}
                </div>
                <Radio
                    value={discount.id}
                    checked={selected}
                    disabled={minOrderValue > totalMinOrder}
                    onChange={(_) => changeSelectedDiscount(discount)}
                ></Radio>
            </div>
            {minOrderValue > totalMinOrder && (
                <div className="bg-orange-100 text-red-500">
                    <p className="px-3">
                        mua thêm {(minOrderValue - totalMinOrder) / 1000}k để được nhận ưu đãi
                    </p>
                </div>
            )}
        </div>
    )
}

const ModalDiscount = ({ shop, isOpen, onCancel, onOk, totalMinOrder }: Props) => {
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)

    useEffect(() => {
        ;(async () => {
            const res = await discountApi.get({
                shopId: shop.id,
                size: 1000,
                state: 'ACTIVE',
            })
            setDiscounts(res.content)
            console.log('res', res)
        })()
    }, [shop.id])

    return (
        <div>
            <Modal
                open={isOpen}
                onOk={() => {
                    onOk(selectedDiscount)
                }}
                onCancel={onCancel}
                width={500}
                style={{
                    position: 'sticky',
                }}
            >
                <div className="">
                    <p>Chọn {shop.name} voucher</p>
                    <div className="flex space-x-2">
                        <Form.Item label="Voucher">
                            <Input />
                        </Form.Item>
                        <Button>Áp dụng</Button>
                    </div>

                    <div className="space-y-1">
                        {discounts.length !== 0 &&
                            discounts.map((v) => (
                                <CartDiscount
                                    discount={v}
                                    key={v.id}
                                    selected={selectedDiscount?.id === v.id || false}
                                    totalMinOrder={totalMinOrder}
                                    changeSelectedDiscount={setSelectedDiscount}
                                />
                            ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default ModalDiscount
