import DashboardCart from '@/components/DashboardCart'
import { useAuth } from '@/hooks'
import inventoryApi from '@/http/inventoryApi'
import productApi, { Product, Variant } from '@/http/productApi'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const op: { [key: string]: any } = {
    total: { title: 'Tổng tiền nhập hàng', description: 'Tổng số tiền hàng đã nhập' },
    countProduct: { title: 'Số lượng sản phẩm', description: 'Số lượng sản phẩm' },
    inventory: { title: 'Số hàng tồn kho', description: 'Số lượng hàng tồn kho' },
    countSold: { title: 'Số sản phẩm bán được', description: 'Tổng số sản phẩm đã bán được' },
    totalImport: { title: 'Số lượng đã nhập', description: 'Tổng số Lượng hàng hóa đã nhập' },
    countInventory: { title: 'Số Lần nhập hàng', description: 'Số lần nhập hàng đã nhập' },
}

type Option = {
    total: number
    countProduct: number
    inventory: number
    countSold: number
    totalImport: number
    countInventory: number
}

const StatisticInventory = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState<Product[]>([])
    const [options, setOptions] = useState<Option>({
        total: 0,
        countProduct: 0,
        inventory: 0,
        countSold: 0,
        totalImport: 0,
        countInventory: 0,
    })

    const fetchAll = async () => {
        const res = await inventoryApi.getAll({ shopId: user.id, size: 1000 })
        const resP = await productApi.getAll({ shopId: user.id, size: 1000 })

        console.log('res', res.content)

        let total = 0
        let inventory = 0
        let countInventory = res.content.length
        let countProduct = resP.content.length
        let countSold = 0
        let totalImport = 0

        res.content.forEach((i) => {
            i.variantInventory.forEach((variant) => {
                total += variant.priceImport
            })
            totalImport += i.variantInventory.reduce((acc, v) => acc + v.quantity, 0)
        })

        resP.content.forEach((i) => {
            i.variants.forEach((v) => {
                countSold += v.sold
                inventory += v.quantity
            })
        })

        setProducts(resP.content)
        setOptions({
            total,
            countProduct,
            inventory,
            countSold,
            totalImport,
            countInventory,
        })
    }

    useEffect(() => {
        ;(async () => {
            await fetchAll()
        })()
    }, [user.id])

    const columns: ColumnsType<Variant> = [
        {
            title: 'Tên biến thể',
            dataIndex: 'name',
            key: 'name',
            render: (_, { valueVariant }) => {
                return <div>{valueVariant.map((v) => v.value).join(' - ')}</div>
            },
        },
        {
            title: 'Tồn kho',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, { quantity }) => {
                return <div>{quantity}</div>
            },
        },
        {
            title: 'Giá nhập',
            dataIndex: 'priceImport',
            key: 'priceImport',
            render: (_, { priceImport }) => {
                return <div>{priceImport}</div>
            },
        },
    ]

    return (
        <div className="space-y-3">
            <p>thống kê tồn kho</p>
            <div className="grid grid-cols-3 gap-3">
                {Object.entries(options).map(([key, value]) => (
                    <DashboardCart
                        description={op[key].description}
                        key={key}
                        title={key}
                        value={key === 'total' ? value.vnd() : value}
                    />
                ))}
            </div>
            <div>
                <Table
                    title={() => 'Danh sách sản phẩm'}
                    showHeader={false}
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'name',
                            key: 'name',
                            render: (_, { variants, name, thumb }) => {
                                return (
                                    <div>
                                        <div className="flex">
                                            <img src={thumb} alt={name} className="w-10 h-10" />
                                            <p>{name}</p>
                                        </div>
                                    </div>
                                )
                            },
                        },
                        {
                            title: 'tồn kho',
                            dataIndex: 'variants',
                            key: 'variants',
                            render: (_, { variants }) => {
                                const cc = variants.reduce((acc, v) => acc + v.quantity, 0)
                                return <div>tồn: {cc}</div>
                            },
                        },
                    ]}
                    expandable={{
                        expandedRowRender: ({ variants }) => (
                            <Table columns={columns} dataSource={variants} pagination={false} />
                        ),
                        rowExpandable: () => true,
                    }}
                    dataSource={products.map((p) => ({ ...p, key: p.id }))}
                />
            </div>
        </div>
    )
}
export default StatisticInventory
