import { useAuth, useCategory, useMessage } from '@/hooks'
import { ErrorPayload, Pagination, ParamsRequest } from '@/http'
import productApi, { Attribute, ListMap, Map, Product, Variant } from '@/http/productApi'
import saleApi, { Sale } from '@/http/saleApi'
import { DiscountState, ProductState, UserRoles } from '@/utils/constants'
import { Button, Dropdown, Popconfirm, Tabs, Tag, Tooltip, TreeSelect } from 'antd'
import Search from 'antd/es/input/Search'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

type SaleCustom = Sale & { products: Product[] }

const initialQuery = {
    page: 0,
    size: 10,
    sort: null,
    keySearch: null,
    state: null,
    shopId: null,
}

const AllSale = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { categories } = useCategory()
    const { success, error } = useMessage()
    const [query, setQuery] = useState<ParamsRequest>({ ...initialQuery })
    const [pagination, setPagination] = useState<Pagination>({ total: 0, current: 1, pageSize: 10 })
    const [loadingButton, setLoadingButton] = useState<boolean>(false)
    const [sales, setSales] = useState<SaleCustom[]>([])

    useEffect(() => {
        ;(async () => {
            if (user.id) {
                try {
                    const data = await saleApi.getAll({ ...query, shopId: user.id })
                    console.log('data', data)

                    const ProductIds = Array.from(
                        new Set(data.content.flatMap((item) => item.productIds))
                    )
                    const products = await Promise.all(
                        ProductIds.map((id) => productApi.findById(id))
                    )
                    console.log('products', products)

                    const saleCustom = data.content.map((item) => ({
                        ...item,
                        products: products.filter((product) =>
                            item.productIds.includes(product.id)
                        ),
                    }))

                    setSales(saleCustom)

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
    }, [query.page, query.size, query.sort, query.keySearch, query.state, user.id])

    // console.log('products', products)

    const handleDelete = async (id: string) => {
        try {
            const res = await saleApi.deleteSale(id)
            if (res) {
                setSales((prev) => prev.filter((item) => item.id !== id))
                success('Xóa khuyến mãi thành công')
                return
            }
            error('Xóa khuyến mãi thất bại')
        } catch (e) {
            error('Xóa khuyến mãi thất bại')
        }
    }

    const column: ColumnsType<SaleCustom> = [
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Sản phẩm ap dụng',
            dataIndex: 'id',
            key: 'id',
            render: (_, { productIds }) => <p>{productIds.length}</p>,
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
            title: 'Trạng thái',
            dataIndex: 'state',
            key: 'state',
            render: (state) => (
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
            ),
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
                <div>
                    <Button type="primary" onClick={() => navigate(`/seller/sale/detail/${id}`)}>
                        Chi tiết
                    </Button>
                    <Button danger onClick={() => handleDelete(id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ]

    const columnVariant: ColumnsType<Variant> = [
        {
            title: 'biến thể',
            dataIndex: 'name',
            key: 'name',
            render: (_, { valueVariant }) => (
                <div className="flex items-center space-x-3">
                    {valueVariant.map((v) => v.value).join('-')}
                </div>
            ),
        },
        {
            title: 'Giá gốc',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <p>{price}đ</p>,
        },
        {
            title: 'Giá sau giảm',
            dataIndex: 'priceSale',
            key: 'priceSale',
            render: (price) => <p>{price}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <p>{quantity}</p>,
        },
    ]

    return (
        <div className="">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Sản phẩm</h1>
                <div className="flex items-center space-x-5"></div>
            </div>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: '',
                        label: 'Tất cả',
                    },
                    ...Object.keys(DiscountState).map((key) => ({
                        key,
                        label: DiscountState[key as keyof typeof DiscountState],
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
                    dataSource={sales}
                    columns={column}
                    bordered
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
                        expandedRowRender: ({ products }) => {
                            return products.map((product) => {
                                const { name, thumb, variants } = product
                                return (
                                    <div>
                                        <div className="flex">
                                            <img
                                                src={thumb}
                                                alt=""
                                                className="w-10 h-10 object-cover "
                                            />
                                            <p>{name}</p>
                                        </div>
                                        <Table
                                            columns={columnVariant}
                                            dataSource={variants}
                                            pagination={false}
                                        />
                                    </div>
                                )
                            })
                        },
                        // rowExpandable: (record) => !!record.variants && record.variants.length > 0,
                    }}
                />
            </div>
        </div>
    )
}
export default AllSale
