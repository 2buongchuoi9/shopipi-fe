import { useAuth, useCategory, useMessage } from '@/hooks'
import { ParamsRequest } from '@/http'
import { ShopOrderItem } from '@/http/cartApi'
import orderApi, { Order } from '@/http/OrderApi'
import { OrderPayment, OrderShipping, OrderState } from '@/utils/constants'
import { Button, Select, Table, TableColumnType, Tabs, Tag, TreeSelect } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
const initialQuery = {
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
    keySearch: null,
    categoryId: null,
    state: null,
    shopId: null,
}
const OrderPage = () => {
    const { user } = useAuth()
    const { success, error } = useMessage()
    const [orders, setOrders] = useState<Order[]>([])
    const [query, setQuery] = useState<ParamsRequest>(initialQuery)
    const { categories } = useCategory()

    const fetchOrder = async () => {
        try {
            const res = await orderApi.get(query)
            setOrders(res.content)
            console.log('orders', orders)
        } catch (e) {
            console.log('error', e)
        }
    }

    useEffect(() => {
        setQuery((prev) => ({ ...prev, shopId: user.id }))
    }, [user.id])

    useEffect(() => {
        ;(async () => {
            if (query.shopId) await fetchOrder()
        })()
    }, [
        query.keySearch,
        query.categoryId,
        query.state,
        query.page,
        query.size,
        query.sort,
        query.shopId,
    ])

    const handleUpdateStateByShop = async (id: string, state: string) => {
        try {
            await orderApi.updateStateByShop(id, state)
            await fetchOrder()
            success('Cập nhật trạng thái thành công')
        } catch (e) {
            console.log('error', e)
            error('Cập nhật trạng thái thất bại')
        }
    }

    const column: ColumnsType<Order> = [
        {
            title: 'Sản phẩm',
            dataIndex: 'items',
            key: 'items',
            render: (_, { id, items: shopItems }) => {
                const c = shopItems[0]
                const { items, shopId } = c
                return (
                    <>
                        {items.map((item, i) => (
                            <div key={shopId + i} className="flex">
                                <img
                                    className="w-10 h-10 object-cover"
                                    src={item.product.thumb}
                                    alt={item.product.name}
                                />
                                <div>
                                    <p>{item.product.name}</p>
                                    <p className="text-1sm">số lượng:{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </>
                )
            },
        },
        {
            title: 'Người mua',
            dataIndex: 'user',
            key: 'user',
            render: (user) => <p>{user.name}</p>,
        },
        {
            title: 'Thanh toán/trạng thái',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, { payment }) => (
                <div>
                    <Tag color={payment === 'CASH' ? 'red' : 'green'}>
                        {payment === 'CASH' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                    </Tag>
                    <p>{OrderPayment[payment as keyof typeof OrderPayment]}</p>
                    <p>{_}</p>
                </div>
            ),
        },
        {
            title: 'Voucher',
            dataIndex: 'totalDiscount',
            key: 'totalDiscount',
            render: (_) => <p>{_}</p>,
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'totalCheckout',
            key: 'totalCheckout',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            key: 'state',
            render: (state, { id }) => {
                return (
                    <Select
                        options={Object.keys(OrderState).map((v, i) => ({
                            key: v,
                            value: v,
                            label: OrderState[v as keyof typeof OrderState],
                            disabled: Object.keys(OrderState).indexOf(state) > i,
                        }))}
                        style={{ width: 180 }}
                        value={state}
                        onChange={async (value) => await handleUpdateStateByShop(id, value)}
                    />
                )
            },
        },
        {
            title: 'Đơn vị vận chuyển',
            dataIndex: 'shippingType',
            key: 'shippingType',
            render: (shippingType) => (
                <p>{OrderShipping[shippingType as keyof typeof OrderShipping].name}</p>
            ),
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
            key: 'id',
            // render: (id, record) => (
            //     <span className="flex flex-col justify-start">
            //         <Button size="small" type="link" className="flex justify-start">
            //             <Link to={`/admin/product/detail/${record.slug}`}> cập nhật</Link>
            //         </Button>
            //         <Button size="small" type="link" className="flex justify-start">
            //             xóa
            //         </Button>
            //         <Button size="small" type="link" className="flex justify-start">
            //             xem thêm
            //         </Button>
            //     </span>
            // ),
        },
    ]

    return (
        <div className="">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Đơn hàng</h1>
                <div className="flex items-center space-x-5">
                    <Button
                        type="primary"
                        // onClick={() => navigate('/admin/product/add')}
                    >
                        Xuất
                    </Button>
                    <Button
                        type="primary"
                        // onClick={() => navigate('/admin/product/add')}
                    >
                        Lịch sử xuất
                    </Button>
                </div>
            </div>
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
                onChange={(key) => setQuery({ ...query, state: key, page: 0 })}
            />
            <div className="space-y-5 bg-white p-3 rounded-xl border-[1px]">
                <div className="flex justify-end items-center space-x-3">
                    <TreeSelect
                        style={{
                            width: '200px',
                        }}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        treeData={[
                            { key: 'None', value: '', label: 'Tất cả sản phẩm' },
                            ...categories,
                        ]}
                        placeholder="Tìm theo danh mục"
                        treeDefaultExpandAll
                        onChange={(value) => {
                            console.log('value', value)
                            setQuery((prev) => ({
                                ...prev,
                                categoryId: value === '' ? null : value,
                            }))
                        }}
                    />

                    <Search
                        className="w-1/4"
                        placeholder="tìm theo tên, SKU sản phẩm,..."
                        enterButton
                        // loading={loading}
                        // onChange={(e) => setKeySearch(e.target.value)}
                    />
                </div>

                <Table
                    dataSource={orders.map((order) => ({ ...order, key: order.id }))}
                    columns={column}
                    bordered
                    rowSelection={{
                        // selectedRowKeys: selectedRecord,
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log('selectedRowKeys', selectedRowKeys)
                            console.log('selectedRows', selectedRows)
                            // setSelectedRecord(selectedRowKeys)
                        },
                    }}
                    // pagination={{
                    //     current: pagination.current + 1,
                    //     pageSize: pagination.pageSize,
                    //     total: pagination.total,
                    //     showSizeChanger: true,
                    //     // showQuickJumper: true,
                    //     pageSizeOptions: ['1', '2', '30', '50'],
                    //     onChange: (page, pageSize) => {
                    //         setQuery((prev) => ({ ...prev, page: page - 1, size: pageSize }))
                    //     },
                    //     onShowSizeChange: (current, size) => {
                    //         setQuery((prev) => ({ ...prev, page: current - 1, size }))
                    //     },
                    // }}
                    // scroll={{ y: 1000 }}
                    // expandable={{
                    //     expandedRowRender: (record) => {
                    //         const {
                    //             variants,
                    //             attribute,
                    //             category,
                    //             price,
                    //             priceImport,
                    //             totalComment,
                    //             totalRating,
                    //         } = record
                    //         console.log('attribute', attribute)

                    //         const renderAttribute = (key: keyof Attribute) => {
                    //             if (key === 'listVariant') {
                    //                 return (attribute.listVariant as ListMap[]).map(
                    //                     (item, index) => (
                    //                         <li key={index}>
                    //                             {item.key}: {item.values.join(', ')}
                    //                         </li>
                    //                     )
                    //                 )
                    //             } else {
                    //                 return (
                    //                     <li key={key}>
                    //                         {key}: {(attribute[key] as string) ?? 'none'}
                    //                     </li>
                    //                 )
                    //             }
                    //         }

                    //         return (
                    //             <div className="flex">
                    //                 <div>
                    //                     <h2>Biến thể</h2>
                    //                     <Table
                    //                         dataSource={variants}
                    //                         columns={columnVariant}
                    //                         pagination={false}
                    //                     />
                    //                 </div>
                    //                 <div>
                    //                     <h2>Thuộc tính</h2>
                    //                     <ul className="list-disc list-inside">
                    //                         {Object.keys(attribute).map((key) =>
                    //                             renderAttribute(key as keyof Attribute)
                    //                         )}
                    //                         <li>Category: {category.name}</li>
                    //                     </ul>
                    //                 </div>
                    //                 <div>
                    //                     <h2>chi tiết</h2>
                    //                     <ul className="list-disc list-inside">
                    //                         <li>Giá: {price}</li>
                    //                         <li>Giá nhập: {priceImport}</li>
                    //                         <li>Số bình luận: {totalComment}</li>
                    //                         <li>Số đánh giá: {totalRating}</li>
                    //                     </ul>
                    //                 </div>
                    //             </div>
                    //         )
                    //     },
                    //     // rowExpandable: (record) => !!record.variants && record.variants.length > 0,
                    // }}
                />
            </div>
        </div>
    )
}
export default OrderPage
