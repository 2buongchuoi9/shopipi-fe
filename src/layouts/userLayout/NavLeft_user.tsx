import { Menu, MenuProps } from 'antd'
import { HTMLAttributes, useState } from 'react'
import { BiSupport } from 'react-icons/bi'
import { MenuInfo } from 'rc-menu/lib/interface'
import { FaUser } from 'react-icons/fa'
import { IoIosBookmarks } from 'react-icons/io'
import { IoLocation, IoNotificationsSharp } from 'react-icons/io5'
import { MdOutlineStarRate } from 'react-icons/md'
import { TbPasswordFingerprint } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { userPath } from '@/utils/constants'

const NavLeft_user = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
    const [currentKey, setCurrentKey] = useState<string>('')
    const navigate = useNavigate()

    const handleSelectMenu = ({ key, keyPath }: MenuInfo) => {
        console.log('select key', key, keyPath)
        setCurrentKey(key)
        navigate(userPath + key)
    }

    const items: MenuProps['items'] = [
        {
            key: '/account',
            label: 'Thông tin tài khoản',
            icon: <FaUser />,
        },
        {
            key: '/address',
            icon: <IoLocation />,
            label: 'Sổ địa chỉ',
        },
        {
            key: '/password',
            icon: <TbPasswordFingerprint />,
            label: 'Đổi mật khẩu',
        },
        {
            key: '/notification',
            icon: <IoNotificationsSharp />,
            label: 'Thông báo của tôi',
        },

        { type: 'divider' },
        {
            key: '/order',
            label: 'Quản lý đơn hàng',
            icon: <IoIosBookmarks />,
        },

        {
            key: '/rating',
            label: 'Đánh giá sản phẩm',
            icon: <MdOutlineStarRate />,
        },

        { type: 'divider' },
        {
            key: '7',
            label: 'Hỗ trợ khách hàng',
            icon: <BiSupport />,
        },
    ]

    return (
        <div {...rest}>
            <div className="h-full w-full  ">
                <Menu
                    selectedKeys={[currentKey]}
                    // mode="inline"
                    onSelect={handleSelectMenu}
                    items={items}
                    className="bg-[#f5f5f5]"
                />
            </div>
        </div>
    )
}
export default NavLeft_user
