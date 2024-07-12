import { useDebounce } from '@/hooks'
import { ParamsRequest } from '@/http'
import discountApi, { Discount } from '@/http/discountApi'
import { randomGradient } from '@/utils'
import { DiscountState } from '@/utils/constants'
import { Avatar, Button, Card, Collapse, Table, TableColumnsType, Tabs, Tag } from 'antd'
import Search from 'antd/es/input/Search'
import { Children, useEffect, useState } from 'react'
import { FaShopify } from 'react-icons/fa6'
import { GiTakeMyMoney } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'

const initQuery = {
    page: 0,
    size: 10,
    sort: 'createdAt',
    // keySearch: '',
}

const AllDiscount = () => {
    const navigate = useNavigate()
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [query, setQuery] = useState<ParamsRequest>(initQuery)
    const [keySearch, setKeySearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const debounce = useDebounce<string>({ value: keySearch, delay: 500 })

    console.log('discounts', discounts)

    useEffect(() => {
        setQuery({ ...query, keySearch: debounce })
    }, [debounce])

    useEffect(() => {
        ;(async () => {
            setLoading(true)
            const data = await discountApi.get(query)
            console.log(data)
            setDiscounts(data.content)
            setLoading(false)
        })()
    }, [query.page, query.state, query.keySearch, query.size, query.sort])

    const columns: TableColumnsType<Discount> = [
        {
            dataIndex: 'name',
            title: 'Tên voucher | Mã voucher',
            key: 'name',
            render: (name, { code, state }) => (
                <div className="flex items-center space-x-2">
                    <Avatar
                        shape="square"
                        size={'large'}
                        icon={<GiTakeMyMoney />}
                        style={{ background: randomGradient() }}
                        className="w-14 h-14"
                    />
                    <div>
                        <Tag
                            color={
                                state === 'ACTIVE'
                                    ? 'green'
                                    : state === 'NOT_YET_ACTIVE'
                                    ? 'red'
                                    : 'default'
                            }
                        >
                            {DiscountState[state as keyof typeof DiscountState]}
                        </Tag>
                        <p>{name}</p>
                        <p>Mã:{code}</p>
                    </div>
                </div>
            ),
        },

        {
            dataIndex: 'value',
            title: 'Giảm giá',
            key: 'value',
            render: (value, { type }) => (
                <p>
                    {value} {type === 'PERCENTAGE_AMOUNT' ? '%' : 'đ'}
                </p>
            ),
        },
        {
            dataIndex: 'minOrderValue',
            title: 'Giảm tối thiểu',
            key: 'minOrderValue',
            render: (minOrderValue) => <p>{minOrderValue}đ</p>,
        },
        {
            dataIndex: 'totalCount',
            title: 'Số lượng',
            key: 'quantity',
            render: (quantity) => <p>{quantity}</p>,
        },
        {
            dataIndex: 'currentCount',
            title: 'Đã dùng',
            key: 'currentCount',
            render: (currentCount, { totalCount }) => <p>{totalCount - currentCount}</p>,
        },
        {
            dataIndex: 'updatedAt',
            title: 'Thời gian lưu hành',
            key: 'updatedAt',
            render: (_, { dateStart, dateEnd }) => (
                <p>
                    {dateStart} {dateEnd}
                </p>
            ),
        },
        {
            dataIndex: 'id',
            title: 'Hành động',
            key: 'action',
            render: (id) => (
                <Button type="primary" onClick={() => navigate(`/admin/discount/detail/${id}`)}>
                    Chi tiết
                </Button>
            ),
        },
    ]

    const itemsVoucher = [
        {
            key: 'voucher',
            label: 'Tạo voucher',
            children: (
                <div className="grid grid-cols-3 w-full gap-5">
                    <Card
                        title={
                            <div className="flex items-center space-x-2 ">
                                <FaShopify className="text-blue-500" size={20} />
                                <p>Voucher toàn shop</p>
                            </div>
                        }
                        classNames={{
                            body: 'p-0',
                            actions: 'flex justify-end w-full',
                        }}
                        actions={[
                            <Button type="primary" onClick={() => navigate('/admin/discount/add')}>
                                Tạo voucher
                            </Button>,
                        ]}
                        extra={<Button type="link">Tìm hiểu thêm</Button>}
                    >
                        <p>Voucher áp dụng cho tất cả sản phẩm trong shop của bạn</p>
                    </Card>
                    <Card
                        title={
                            <div className="flex items-center space-x-2 ">
                                <FaShopify className="text-blue-500" size={20} />
                                <p>Voucher sản phẩm</p>
                            </div>
                        }
                        actions={[
                            <Button type="primary" onClick={() => navigate('/admin/discount/add')}>
                                Tạo voucher
                            </Button>,
                        ]}
                        extra={<Button type="link">Tìm hiểu thêm</Button>}
                    >
                        <p>Voucher áp dụng những sản phẩm nhất định mà Shop chọn</p>
                    </Card>
                </div>
            ),
        },
    ]

    const itemsListVoucher = [
        {
            key: 'list-voucher',
            label: 'Danh sách voucher',
            children: (
                <div>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: 'all',
                                label: 'Tất cả',
                            },
                            ...Object.keys(DiscountState).map((key) => ({
                                key,
                                label: DiscountState[key as keyof typeof DiscountState],
                            })),
                        ]}
                        onChange={(key) => setQuery({ ...query, state: key, page: 0 })}
                    />

                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Search
                                className="w-1/4"
                                placeholder="tìm theo tên, mã,..."
                                enterButton
                                loading={loading}
                                onChange={(e) => setKeySearch(e.target.value)}
                            />
                        </div>
                        <Table columns={columns} dataSource={discounts} />
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-5">
            <Collapse items={itemsVoucher} defaultActiveKey={'voucher'} />
            <Collapse items={itemsListVoucher} defaultActiveKey={'list-voucher'} />
        </div>
    )
}
export default AllDiscount
