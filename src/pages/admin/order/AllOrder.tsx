import { useCategory } from '@/hooks'
import { ParamsRequest } from '@/http'
import { OrderState } from '@/utils/constants'
import { Button, Table, Tabs, TreeSelect } from 'antd'
import Search from 'antd/es/input/Search'
import { useState } from 'react'
const initialQuery = {
    page: 0,
    size: 2,
    sort: null,
    keySearch: null,
    categoryId: null,
    isDeleted: null,
    state: null,
    shopId: null,
}
const OrderPage = () => {
    const [query, setQuery] = useState<ParamsRequest>({ ...initialQuery })
    const { categories } = useCategory()

    const column = [
        {
            title: 'Sản phẩm',
            dataIndex: 'type',
            key: 'type',
            // render: (type, record) => {
            //     const { name, thumb } = record
            //     return (
            //         <div className="flex justify-start items-center">
            //             <img src={thumb} alt={name} className="w-10 h-10 object-cover" />
            //             <div className="ml-2">
            //                 <Tooltip title={name}>
            //                     <p className="text-ellipsis line-clamp-2">{name}</p>
            //                 </Tooltip>
            //                 <p>{type}</p>
            //             </div>
            //         </div>
            //     )
            // },
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đơn vị vận chuyển',
            dataIndex: 'quantity',
            key: 'quantity',
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
                    // dataSource={products}
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
