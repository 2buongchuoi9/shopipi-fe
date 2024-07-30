import { Modal, Table } from 'antd'
import { InventoryModel } from './AllInventory'
import { ColumnsType } from 'antd/es/table'
import { Map, VariantInventory } from '@/http'

type Props = {
    open: boolean
    onClose: () => void
    inventory: InventoryModel
}

const ModalDetailInventory = ({ open, onClose, inventory }: Props) => {
    const { variantInventoryModel, createdAt, id, product } = inventory
    const { thumb, name } = product

    const columns: ColumnsType<VariantInventory & { variantValue: Map[] }> = [
        {
            title: 'Biến thể',
            dataIndex: 'name',
            key: 'name',
            render: (_, { variantValue }) => (
                <div className="flex items-center space-x-3">
                    {variantValue.map((v) => (
                        <p key={v.key}>{v.value}</p>
                    ))}
                </div>
            ),
        },
        {
            title: 'Số lượng Nhập',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá nhập',
            dataIndex: 'priceImport',
            key: 'priceImport',
            render: (priceImport) => priceImport.vnd(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (_, { quantity, priceImport }) => (quantity * priceImport).vnd(),
        },
    ]
    return (
        <div>
            <Modal title="Chi tiết hóa đơn nhập hàng" open={open} onCancel={onClose} footer={null}>
                <div>
                    <p>Mã hóa đơn: {id}</p>
                    <p>Ngày tạo: {createdAt}</p>
                    <div className="flex items-center">
                        <img src={thumb} alt="" className="w-10 h-10 object-cover" />
                        <p className="ml-2">{name}</p>
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={variantInventoryModel}
                            pagination={false}
                        />
                    </div>
                    <div className="flex justify-between">
                        <p>Tổng </p>
                        <p>
                            {variantInventoryModel
                                .reduce((total, v) => total + v.priceImport * v.quantity, 0)
                                .vnd()}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default ModalDetailInventory
