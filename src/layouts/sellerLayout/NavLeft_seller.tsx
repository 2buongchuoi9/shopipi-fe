import { adminPath, sellerPath } from '@/utils/constants'
import { Menu, MenuProps } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useState } from 'react'
import { BsGlobe, BsGlobeEuropeAfrica } from 'react-icons/bs'
import { FaMoneyBillAlt, FaUserCircle } from 'react-icons/fa'
import { FaShopify, FaTruckFast } from 'react-icons/fa6'
import { GiTicket } from 'react-icons/gi'
import { HiArrowCircleRight } from 'react-icons/hi'
import { IoSettings, IoTicketSharp } from 'react-icons/io5'
import { MdFlagCircle, MdInventory } from 'react-icons/md'
import { TiArrowRight } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

type MenuItem = Required<MenuProps>['items']

const NavLeft_seller = ({ ...rest }: Props) => {
    const [currentKey, setCurrentKey] = useState<string>('')
    const navigate = useNavigate()
    console.log('currentKey', currentKey)

    const handleSelectMenu = ({ key, keyPath }: MenuInfo) => {
        console.log('select key', key, keyPath)
        setCurrentKey(key)
        navigate(sellerPath + key)
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
                    label: 'Tất cả',
                },
                {
                    key: '/order/alla',
                    label: 'Đơn hủy',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/order/allv',
                    label: 'Trả hàng/Hoàn tiền',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/add',
                    label: 'Cài đặt vận chuyển',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '/product',
            label: 'Sản phẩm',
            icon: <FaShopify />,
            children: [
                {
                    key: '/product/all',
                    label: 'Tất cả sản phẩm',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/product/add',
                    label: 'Thêm sản phẩm',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '/inventory',
            icon: <MdInventory />,
            label: 'Kho hàng',
            children: [
                {
                    key: '/inventory/statistic',
                    label: 'Thống kê hàng tồn kho',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/inventory/all',
                    label: 'Lịch sử nhập hàng',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/inventory/add',
                    label: 'Nhập thêm hàng',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '/sale',
            label: 'Khuyến mãi',
            icon: <IoTicketSharp />,
            children: [
                {
                    key: '/sale/all',
                    label: 'khuyến mãi của Shop',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '/sale/add',
                    label: 'Tạo khuyến mãi',
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
                    label: 'Voucher của shop',
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
                {
                    key: '33',
                    label: 'Voucher của shopipi',
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
                    key: '41',
                    label: 'Quản lý chat',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '42',
                    label: 'Đánh giá',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '43',
                    label: 'Khách hàng đăng ký',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '5',
            label: 'Tài chính',
            icon: <FaMoneyBillAlt />,
            children: [
                {
                    key: '51',
                    label: 'Doanh thu',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '52',
                    label: 'Số dư TK shopipi',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '53',
                    label: 'Tài khoản ngân hàng',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },

        {
            key: '6',
            label: 'Quản lý shop',
            icon: <IoSettings />,
            children: [
                {
                    key: '61',
                    label: 'Hồ sơ shop',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '62',
                    label: 'Trang trí shop',
                    icon: <HiArrowCircleRight />,
                },
                {
                    key: '63',
                    label: 'Thiết lập shop',
                    icon: <HiArrowCircleRight />,
                },
            ],
        },
        { type: 'divider' },
        {
            key: '7',
            label: 'Hỗ trợ',
            icon: <BsGlobe />,
        },
    ]

    return (
        <div {...rest}>
            <div className="h-full w-full overflow-y-scroll space-y-3 py-2">
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
export default NavLeft_seller
