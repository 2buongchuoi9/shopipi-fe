import { useAuth, useCategory } from '@/hooks'
import { ErrorPayload, ParamsRequest } from '@/http'
import productApi, { Attribute, ListMap, Map, Product, Variant } from '@/http/productApi'
import { ProductState, UserRoles } from '@/utils/constants'
import { Button, Dropdown, Popconfirm, Tabs, Tooltip, TreeSelect } from 'antd'
import Search from 'antd/es/input/Search'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

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
type Pagination = {
    total: number
    current: number
    pageSize: number
}

const AllProduct = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const { user } = useAuth()
    const { categories } = useCategory()
    const [query, setQuery] = useState<ParamsRequest>({ ...initialQuery })
    const [pagination, setPagination] = useState<Pagination>({ total: 0, current: 1, pageSize: 10 })
    const [loadingButton, setLoadingButton] = useState<boolean>(false)

    useEffect(() => {
        if (user.roles.includes(UserRoles.ADMIN)) {
            setQuery((prev) => ({ ...prev, shopId: null }))
        } else setQuery((prev) => ({ ...prev, shopId: user.id }))
    }, [user.id])

    useEffect(() => {
        ;(async () => {
            if (user.id) {
                try {
                    const data = await productApi.getAll({ ...query })
                    setProducts(data.content.map((item) => ({ ...item, key: item.id })))
                    setPagination({
                        total: data.totalElement,
                        current: data.currentPage,
                        pageSize: data.pageSize,
                    })
                    console.log('data', data)
                } catch (error) {
                    if (error instanceof ErrorPayload) {
                        console.error('ErrorPayload', error)
                    }
                }
            }
        })()
    }, [
        query.page,
        query.size,
        query.sort,
        query.keySearch,
        query.categoryId,
        query.isDeleted,
        query.state,
        user.id,
    ])

    // console.log('products', products)

    const column: ColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'type',
            key: 'type',
            render: (type, record) => {
                const { name, thumb } = record
                return (
                    <div className="flex justify-start items-center">
                        <img src={thumb} alt={name} className="w-10 h-10 object-cover" />
                        <div className="ml-2">
                            <Tooltip title={name}>
                                <p className="text-ellipsis line-clamp-2">{name}</p>
                            </Tooltip>
                            <p>{type}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span className="flex flex-col justify-start">
                    <Button size="small" type="link" className="flex justify-start">
                        <Link to={`/admin/product/detail/${record.slug}`}> cập nhật</Link>
                    </Button>
                    <Button size="small" type="link" className="flex justify-start">
                        xóa
                    </Button>
                    <Button size="small" type="link" className="flex justify-start">
                        xem thêm
                    </Button>
                </span>
            ),
        },
    ]

    const columnVariant: ColumnsType<Variant> = [
        {
            title: 'Tên biến thể',
            dataIndex: 'valueVariant',
            key: 'conc',
            render: (valueVariant: Map[]) => {
                return valueVariant.map((variant: Map) => variant.value).join(', ')
            },
        },
        {
            title: 'Kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <Tooltip title={quantity}>{quantity}</Tooltip>,
        },
    ]

    return (
        <div className="">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Sản phẩm</h1>
                <div className="flex items-center space-x-5">
                    <Dropdown
                        trigger={['click']}
                        // disabled={selectedRecord.length === 0}
                        arrow
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    title: 'Hidden selected products',
                                    // onClick: async () =>
                                    //     await handleToggleHiddenMany(selectedRecord, true),
                                    label: <span>Ẩn</span>,
                                },
                                {
                                    key: '2',
                                    title: 'Show selected products',
                                    // onClick: async () =>
                                    //     await handleToggleHiddenMany(selectedRecord, false),
                                    label: <span>Hiện</span>,
                                },
                                // {
                                //     key: '3',
                                //     title: 'Sản phẩm nổi bật sẽ được hiển thị tại trang chủ',
                                //     // onClick: async () =>
                                //     //     await handleToggleShowInHomeMany(selectedRecord, true),
                                //     label: <span>Đặt nổi bật</span>,
                                // },
                                // {
                                //     key: '4',
                                //     title: 'Sản phẩm nổi bật sẽ được hiển thị tại trang chủ',
                                //     // onClick: async () =>
                                //     //     await handleToggleShowInHomeMany(selectedRecord, false),
                                //     label: <span>Bỏ nổi bật</span>,
                                // },
                                {
                                    key: '5',
                                    title: 'Xóa vĩnh viễn sản phẩm',
                                    label: (
                                        <Popconfirm
                                            title="Delete the task"
                                            description="Are you sure to delete all selected task?"
                                            okText="Yes"
                                            cancelText="No"
                                            // onConfirm={async () =>
                                            //     await handleDeleteMany(selectedRecord)
                                            // }
                                        >
                                            Xóa
                                        </Popconfirm>
                                    ),
                                },
                            ],
                        }}
                    >
                        <Button loading={loadingButton} icon={<IoIosArrowDown />}>
                            Công cụ xử lý hàng loạt
                        </Button>
                    </Dropdown>
                    <Button
                        type="primary"
                        icon={<FaPlus />}
                        onClick={() => navigate('/admin/product/add')}
                    >
                        Thêm sản phẩm
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
                    ...Object.keys(ProductState).map((key) => ({
                        key,
                        label: ProductState[key as keyof typeof ProductState],
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
                    dataSource={products}
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
                    pagination={{
                        current: pagination.current + 1,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        // showQuickJumper: true,
                        pageSizeOptions: ['1', '2', '30', '50'],
                        onChange: (page, pageSize) => {
                            setQuery((prev) => ({ ...prev, page: page - 1, size: pageSize }))
                        },
                        onShowSizeChange: (current, size) => {
                            setQuery((prev) => ({ ...prev, page: current - 1, size }))
                        },
                    }}
                    // scroll={{ y: 1000 }}
                    expandable={{
                        expandedRowRender: (record) => {
                            const {
                                variants,
                                attribute,
                                category,
                                price,
                                priceImport,
                                totalComment,
                                totalRating,
                            } = record
                            console.log('attribute', attribute)

                            const renderAttribute = (key: keyof Attribute) => {
                                if (key === 'listVariant') {
                                    return (attribute.listVariant as ListMap[]).map(
                                        (item, index) => (
                                            <li key={index}>
                                                {item.key}: {item.values.join(', ')}
                                            </li>
                                        )
                                    )
                                } else {
                                    return (
                                        <li key={key}>
                                            {key}: {(attribute[key] as string) ?? 'none'}
                                        </li>
                                    )
                                }
                            }

                            return (
                                <div className="flex">
                                    <div>
                                        <h2>Biến thể</h2>
                                        <Table
                                            dataSource={variants}
                                            columns={columnVariant}
                                            pagination={false}
                                        />
                                    </div>
                                    <div>
                                        <h2>Thuộc tính</h2>
                                        <ul className="list-disc list-inside">
                                            {Object.keys(attribute).map((key) =>
                                                renderAttribute(key as keyof Attribute)
                                            )}
                                            <li>Category: {category.name}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2>chi tiết</h2>
                                        <ul className="list-disc list-inside">
                                            <li>Giá: {price}</li>
                                            <li>Giá nhập: {priceImport}</li>
                                            <li>Số bình luận: {totalComment}</li>
                                            <li>Số đánh giá: {totalRating}</li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        },
                        // rowExpandable: (record) => !!record.variants && record.variants.length > 0,
                    }}
                />
            </div>
        </div>
    )
}
export default AllProduct
