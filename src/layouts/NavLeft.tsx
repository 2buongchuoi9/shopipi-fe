import { Menu, MenuProps } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

type MenuItem = Required<MenuProps>['items']

const NavLeft = ({ ...rest }: Props) => {
    const [currentKey, setCurrentKey] = useState<string>('')
    const navigate = useNavigate()
    console.log('currentKey', currentKey)

    const handleSelectMenu = ({ key, keyPath }: MenuInfo) => {
        console.log('select key', key, keyPath)
        setCurrentKey(key)
        navigate(key)
    }

    const items: MenuItem = [
        {
            key: '1',
            label: 'Quản lý đơn hàng',
            children: [
                {
                    key: '11',
                    label: 'Tất cả',
                },
                {
                    key: '12',
                    label: 'Đơn hủy',
                },
                {
                    key: '13',
                    label: 'Trả hàng/Hoàn tiền',
                },
                {
                    key: '/add',
                    label: 'Cài đặt vận chuyển',
                },
            ],
        },
        { type: 'divider' },
        {
            key: '/product',
            label: 'Quản lý Sản phẩm',
            children: [
                {
                    key: '/product/all',
                    label: 'Tất cả sản phẩm',
                },
                {
                    key: '/product/add',
                    label: 'Thêm sản phẩm',
                },
            ],
        },
        { type: 'divider' },
        {
            key: '3',
            label: 'Kênh marketing',
            children: [
                {
                    key: '31',
                    label: 'Quảng cáo shopipi',
                },
                {
                    key: '32',
                    label: 'Mã giảm giá của shop',
                },
                {
                    key: '33',
                    label: 'Mã giảm giá của shopipi',
                },
            ],
        },
        { type: 'divider' },
        {
            key: '4',
            label: 'Chăm sóc khách hàng',
            children: [
                {
                    key: '41',
                    label: 'Quản lý chat',
                },
                {
                    key: '42',
                    label: 'Đánh giá',
                },
            ],
        },
        { type: 'divider' },
        {
            key: '5',
            label: 'Tài chính',
            children: [
                {
                    key: '51',
                    label: 'Doanh thu',
                },
                {
                    key: '52',
                    label: 'Số dư TK shopipi',
                },
                {
                    key: '53',
                    label: 'Tài khoản ngân hàng',
                },
            ],
        },
        { type: 'divider' },
        {
            key: '6',
            label: 'Quản lý shop',
            children: [
                {
                    key: '61',
                    label: 'Hồ sơ shop',
                },
                {
                    key: '62',
                    label: 'Trang trí shop',
                },
                {
                    key: '63',
                    label: 'Thiết lập shop',
                },
            ],
        },
    ]

    return (
        <div {...rest}>
            <div className="h-full w-full overflow-y-auto space-y-3 py-2">
                <Menu
                    selectedKeys={[currentKey]}
                    mode="inline"
                    onSelect={handleSelectMenu}
                    items={items}
                />
            </div>
        </div>
    )
}
export default NavLeft
