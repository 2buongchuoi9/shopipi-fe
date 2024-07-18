import { adminPath, sellerPath } from '@/utils/constants'
import { Menu, MenuProps } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

type MenuItem = Required<MenuProps>['items']

const NavLeft_admin = ({ ...rest }: Props) => {
    const [currentKey, setCurrentKey] = useState<string>('')
    const navigate = useNavigate()
    console.log('currentKey', currentKey)

    const handleSelectMenu = ({ key, keyPath }: MenuInfo) => {
        console.log('select key', key, keyPath)
        setCurrentKey(key)
        navigate(adminPath + key)
    }

    const items: MenuItem = [
        {
            key: '/product',
            label: 'Quản lý Sản phẩm',
        },
        { type: 'divider' },
        {
            key: '/discount',
            label: 'Kênh marketing',
            children: [
                {
                    key: '31',
                    label: 'Quảng cáo shopipi',
                },
                {
                    key: '/discount/all',
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
export default NavLeft_admin
