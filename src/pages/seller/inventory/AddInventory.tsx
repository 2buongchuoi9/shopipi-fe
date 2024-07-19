import { useMessage } from '@/hooks'
import { InventoryRequest, Product, VariantInventory } from '@/http'
import inventoryApi from '@/http/inventoryApi'
import { Button, Table } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import ModalSelectProduct from '../ModalSelectProduct'
import VariantTable from '../product/VariantTable'

const AddInventory = () => {
    const navigate = useNavigate()
    const { success, error } = useMessage()
    const [openModal, setOpenModal] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [inventories, setInventories] = useState<InventoryRequest[]>([])

    const handleSelectedProduct = (products: Product[]) => {
        console.log(products)
        setProducts(products)
    }

    const handleSubmit = async () => {
        console.log('inventories', inventories)

        try {
            const res = await inventoryApi.addManyInventory(inventories)
            console.log(res)
            success('nhập thêm hàng thành công')
        } catch (e) {
            error('nhập thêm hàng thất bại')
        }
    }

    const handleValuesOnChange = (productId: string, record: VariantInventory) => {
        console.log('record', record)
        // important
        setInventories((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? {
                          ...p,
                          variantInventory: p.variantInventory.map((v) =>
                              v.variantId === record.variantId
                                  ? {
                                        ...v,
                                        // dấu || để nếu record.priceImport hoặc record.quantity không có giá trị hoặc giá trị ===0 thì giữ nguyên giá trị cũ
                                        // không thể thay || thành ?? vì record.priceImport và record.quantity có thể có giá trị === 0
                                        priceImport: record.priceImport || v.priceImport,
                                        quantity: record.quantity || v.quantity,
                                    }
                                  : v
                          ),
                      }
                    : p
            )
        )
    }

    const columns: ColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_, { thumb, name }) => (
                <div className="flex items-center space-x-3">
                    <img src={thumb} alt="" className="w-10 h-10 object-cover" />
                    <p>{name}</p>
                </div>
            ),
        },
        {
            title: 'Tồn kho',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <p>Tồn kho:{quantity}</p>,
        },
        {
            title: 'Nhập thêm',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <p>
                    Nhập thêm:
                    {inventories
                        .find((v) => v.productId === id)
                        ?.variantInventory.reduce((total, x) => Number(x.quantity) + total, 0)}
                </p>
            ),
        },
        {
            title: 'Giá nhập trung bình',
            dataIndex: 'id',
            key: 'id1',
            render: (id) => {
                const inventory = inventories.find((v) => v.productId === id)
                const a = inventory?.variantInventory.filter((v) => v.quantity !== 0)
                const total = a?.reduce((total, x) => Number(x.priceImport) + total, 0) ?? 0
                return <p>giá nhập trung bình: {total / (a?.length ?? 1)}</p>
            },
        },
        {
            title: 'Giá nhập',
            dataIndex: 'id',
            key: 'id2',
            render: (_) => (
                <div
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                        // xóa sản phẩm khỏi danh sách nhập hàng
                        setProducts((prev) => prev.filter((p) => p.id !== _))
                        setInventories((prev) => prev.filter((p) => p.productId !== _))
                    }}
                >
                    <MdCancel />
                </div>
            ),
        },
    ]

    return (
        <>
            <ModalSelectProduct
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onSelectedProduct={handleSelectedProduct}
                type="inventory"
            />
            <div className="">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Nhập thêm hàng</h1>
                </div>
                <div className="space-y-5 bg-white p-3 rounded-xl border-[1px] mt-5">
                    <div>
                        <p className="text-lg">Sản phẩm</p>
                        <p className="text-1sm">Chọn sản phẩm muốn nhập thêm</p>
                    </div>
                    <div className="flex space-x-5">
                        <Button type="primary" onClick={() => setOpenModal(true)}>
                            Chọn
                        </Button>
                        <Search
                            className=""
                            placeholder="tìm theo tên, SKU sản phẩm,..."
                            enterButton
                            // loading={loading}
                            // onChange={(e) => setKeySearch(e.target.value)}
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    showHeader={false}
                    dataSource={products}
                    expandable={{
                        expandedRowRender: (record) => {
                            setInventories((prev) => {
                                const found = prev.find((p) => p.productId === record.id)
                                if (found) return prev
                                return [
                                    ...prev,
                                    {
                                        productId: record.id,
                                        shopId: record.shop.id,
                                        variantInventory: record.variants.map((variant) => ({
                                            variantId: variant.id,
                                            quantity: 0,
                                            priceImport: 0,
                                        })),
                                        isDeleted: false,
                                    },
                                ]
                            })
                            return (
                                <VariantTable
                                    variants={record.variants}
                                    onRecordChange={({ priceImport, quantity, id }) =>
                                        handleValuesOnChange(record.id, {
                                            priceImport,
                                            quantity,
                                            variantId: id,
                                        })
                                    }
                                    type="inventory"
                                />
                            )
                        },
                    }}
                />
                <div>
                    <Button onClick={handleSubmit} type="primary" className="mt-5">
                        thêm
                    </Button>
                </div>
            </div>
        </>
    )
}
export default AddInventory
