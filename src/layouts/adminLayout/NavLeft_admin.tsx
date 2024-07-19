import { adminPath, sellerPath } from '@/utils/constants'
import { Menu, MenuProps } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useState } from 'react'
import { BsGlobe } from 'react-icons/bs'
import { FaMoneyBillAlt, FaShopify, FaUserCircle } from 'react-icons/fa'
import { FaTruckFast } from 'react-icons/fa6'
import { HiArrowCircleRight } from 'react-icons/hi'
import { IoSettings, IoTicketSharp } from 'react-icons/io5'
import { MdFlagCircle, MdInventory } from 'react-icons/md'
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
            key: '/order',
            label: 'Đơn hàng',
            icon: <FaTruckFast />,
            children: [
                {
                    key: '/order/all',
                    icon: <HiArrowCircleRight />,
                    label: 'Tất cả đơn hàng',
                },
            ],
        },

        {
            key: '/product',
            label: 'Sản phẩm',
            icon: <FaShopify />,
            children: [
                {
                    key: '/product',
                    label: 'Tất cả sản phẩm',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },
        {
            key: '/category',
            label: 'Danh mục',
            icon: <FaShopify />,
            children: [
                {
                    key: '/category/all',
                    label: 'Tất cả danh mục',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/category/add',
                    label: 'Tạo danh mục',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '/discount',
            label: 'Voucher & Quảng cáo',
            icon: <MdFlagCircle />,
            children: [
                {
                    key: '/discount/all',
                    label: 'Voucher',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/discount/add',
                    label: 'Tạo voucher',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '31',
                    label: 'Quảng cáo shopipi',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '/shop',
            label: 'Cửa hàng',
            icon: <FaUserCircle />,
            children: [
                {
                    key: '43',
                    label: 'Danh sách cửa hàng',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },
        {
            key: '4',
            label: 'Khách hàng',
            icon: <FaUserCircle />,
            children: [
                {
                    key: '43',
                    label: 'Danh sách khách hàng',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '41',
                    label: 'Quản lý chat',
                    icon: <HiArrowCircleRight />,
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
