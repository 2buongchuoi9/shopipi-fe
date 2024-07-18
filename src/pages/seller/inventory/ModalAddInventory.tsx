import { useAuth } from '@/hooks'
import { Product } from '@/http'
import productApi from '@/http/productApi'
import { Modal, Table } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
type Props = {
    open: boolean
    onCancel: () => void
    onSelectedProduct: (products: Product[]) => void
}

const ModalAddInventory = ({ open, onCancel, onSelectedProduct }: Props) => {
    const { user } = useAuth()
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        // call api to get list product
        ;(async () => {
            if (user.id) {
                const data = await productApi.getAll({ limit: 1000, shopId: user.id })
                setProducts(data.content.map((item) => ({ ...item, key: item.id })))
            }
        })()
    }, [user.id])

    const columns: ColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, { thumb }) => (
                <div className="flex items-center">
                    <img src={thumb} alt="" className="w-10 h-10 object-cover" />
                    <p className="ml-2">{text}</p>
                </div>
            ),
        },
        {
            title: 'Biến thể',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, { variants }) => (
                <div>
                    {variants.map((item) => (
                        <div key={item.id} className="flex items-center">
                            <p className="ml-2">
                                {item.valueVariant.map((v) => v.value).join('-')}
                            </p>
                            <p>{item.quantity}sp</p>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ]

    return (
        <>
            <Modal
                title="Chọn sản phẩm"
                open={open}
                onCancel={onCancel}
                footer={false}
                classNames={{ body: 'w-full', wrapper: 'w-[100%] mx-auto' }}
                // className="w-[50vw]"
                width={800}
            >
                <div className="mb-3">
                    <Search
                        className=""
                        placeholder="tìm theo tên, SKU sản phẩm,..."
                        enterButton
                        // loading={loading}
                        // onChange={(e) => setKeySearch(e.target.value)}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={products}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            onSelectedProduct(selectedRows)
                        },
                    }}
                    pagination={false}
                />
            </Modal>
        </>
    )
}
export default ModalAddInventory
