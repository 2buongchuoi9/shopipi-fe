import { useAuth, useCategory, useMessage } from '@/hooks'
import { ErrorPayload, Inventory, Pagination, ParamsRequest } from '@/http'
import inventoryApi, { VariantInventory } from '@/http/inventoryApi'
import productApi, { Map, Product } from '@/http/productApi'
import { Button, TreeSelect } from 'antd'
import Search from 'antd/es/input/Search'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { FaPlus } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ModalDetailInventory from './ModalDetailInvientory'

const initialQuery = {
    page: 0,
    size: 10,
    sort: null,
    keySearch: null,
    shopId: null,
}

export type InventoryModel = Omit<Inventory, 'variantInventory'> & {
    product: Product
    variantInventoryModel: (VariantInventory & { variantValue: Map[] })[]
}

const AllInventory = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { categories } = useCategory()
    const { success, error, loading, close } = useMessage()
    const [inventories, setInventories] = useState<InventoryModel[]>([])
    const [query, setQuery] = useState<ParamsRequest>({ ...initialQuery })
    const [pagination, setPagination] = useState<Pagination>({ total: 0, current: 1, pageSize: 10 })
    const [open, setOpen] = useState<boolean>(false)
    const [selectedInventory, setSelectedInventory] = useState<InventoryModel | null>(null)

    useEffect(() => {
        ;(async () => {
            if (user.id) {
                try {
                    loading('Đang tải dữ liệu...')
                    const data = await inventoryApi.getAll({ ...query, shopId: user.id })

                    const products: Product[] = await Promise.all(
                        Array.from(new Set(data.content.map((item) => item.productId))).map(
                            async (id) => await productApi.findById(id)
                        )
                    )

                    const inventories = data.content.map((item) => {
                        const product = products.find((p) => p.id === item.productId) as Product
                        const variantInventoryModel = item.variantInventory.map((vi) => ({
                            ...vi,
                            variantValue:
                                product.variants.find((v) => v.id === vi.variantId)?.valueVariant ||
                                [],
                        }))
                        return { ...item, product, variantInventoryModel }
                    })

                    setInventories(inventories)
                    setPagination({
                        total: data.totalElement,
                        current: data.currentPage,
                        pageSize: data.pageSize,
                    })
                    console.log('data', data)
                    close()
                } catch (error) {
                    if (error instanceof ErrorPayload) {
                        console.error('ErrorPayload', error)
                    }
                }
            }
        })()
    }, [query.page, query.size, query.sort, query.keySearch, user.id])

    // console.log('inventories', inventories)

    const column: ColumnsType<InventoryModel> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
            render: (_, { product: { name, thumb } }) => (
                <div className="flex items-center space-x-3">
                    <img src={thumb} alt="" className="w-10 h-10 object-cover" />
                    <p>{name}</p>
                </div>
            ),
        },
        {
            title: 'Số lượng nhập',
            dataIndex: 'productId',
            key: 'productId',
            render: (_, { variantInventoryModel }) => (
                <>x{variantInventoryModel.reduce((prev, current) => prev + current.quantity, 0)}</>
            ),
        },
        {
            title: 'Tổng tiền nhập',
            dataIndex: 'id',
            key: 'id',
            render: (_, { variantInventoryModel }) => {
                const total = variantInventoryModel.reduce(
                    (prev, current) => prev + current.priceImport * current.quantity,
                    0
                )
                return <>{total}</>
            },
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => (
                <div
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                        setOpen(true)
                        setSelectedInventory(record)
                    }}
                >
                    <BiDetail />
                </div>
            ),
        },
    ]

    return (
        <div className="">
            {selectedInventory && (
                <ModalDetailInventory
                    inventory={selectedInventory}
                    onClose={() => setOpen(false)}
                    open={open}
                />
            )}

            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Lịch sử nhập hàng</h1>
                <div className="flex items-center space-x-5">
                    <Button
                        type="primary"
                        icon={<FaPlus />}
                        onClick={() => navigate('/seller/inventory/add')}
                    >
                        Nhập thêm hàng
                    </Button>
                </div>
            </div>

            <div className="space-y-5 bg-white p-3 rounded-xl border-[1px] mt-5">
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
                    dataSource={inventories}
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
                />
            </div>
        </div>
    )
}
export default AllInventory
