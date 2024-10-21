import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart, useMessage } from '@/hooks'
import authApi, { User } from '@/http/authApi'
import { UserRoles } from '@/utils/constants'
import { Avatar, Dropdown, MenuProps, Badge } from 'antd'
import { HTMLAttributes, useEffect, useState } from 'react'
import { MdOutlineCloudDownload } from 'react-icons/md'
import SearchCpn from '@/components/SearchCpn'
import { NotifyComponent } from '@/components/notification'
import categoryApi from '@/http/categoryApi'
import {
    UserOutlined,
    LogoutOutlined,
    ShopOutlined,
    SettingOutlined,
    LoginOutlined,
    FileTextOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'

type Props = {
    isAuthenticated: boolean
    user: User
    isAdmin: boolean
}

// profile
const Profile = ({ isAuthenticated, user, isAdmin }: Props) => {
    const { logout, fetchUser } = useAuth()
    const { success, error } = useMessage()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        !isAuthenticated && {
            key: '1',
            label: (
                <Link to="/login">
                    <LoginOutlined />
                    <span className="ml-2">Đăng nhập</span>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to={isAdmin ? '/admin/product' : '/seller/'}>
                    <SettingOutlined />
                    <span className="ml-2">Admin</span>
                    {isAdmin && (
                        <Badge
                            count="Admin"
                            style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
                        />
                    )}
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link to={isAdmin ? '/admin/product' : '/seller/product/all'}>
                    <ShopOutlined />
                    <span className="ml-2">Kênh bán hàng</span>
                </Link>
            ),
        },
        {
            key: '4',
            label: (
                <span
                    onClick={async () => {
                        if (!user.name || !user.email || !user.slug || !user.phone || !user.image) {
                            error('Vui lòng điền đầy đủ thông tin hồ sơ trước khi đăng ký bán hàng')
                            navigate('/user/account')
                            return
                        }
                        try {
                            await authApi.registerShop(user.id)
                            await fetchUser()
                            success('Đăng ký shop thành công')
                            navigate('/user/account')
                        } catch (e) {
                            error('Đăng ký shop thất bại')
                        }
                    }}
                >
                    <FileTextOutlined />
                    <span className="ml-2">Đăng ký bán hàng</span>
                </span>
            ),
        },
        {
            key: '5',
            label: (
                <Link to={'/user/account'}>
                    <UserOutlined />
                    <span className="ml-2">Hồ sơ của tôi</span>
                </Link>
            ),
        },
        {
            key: '6',
            label: (
                <Link to={'/user/order'}>
                    <ShoppingCartOutlined />
                    <span className="ml-2">Đơn hàng của tôi</span>
                </Link>
            ),
        },
        isAuthenticated && {
            key: '7',
            label: (
                <Link to="/login" onClick={logout}>
                    <LogoutOutlined />
                    <span className="ml-2">Đăng xuất</span>
                </Link>
            ),
        },
    ].filter(Boolean) as MenuProps['items']

    return isAuthenticated ? (
        <Dropdown trigger={['click', 'hover']} menu={{ items }}>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition duration-150 ease-in-out">
                <Avatar
                    src={user.image}
                    size="small"
                    className="border border-gray-300"
                    style={{ backgroundColor: user.image ? 'transparent' : '#f56a00' }}
                >
                    {user.image ? '' : user.name.charAt(0).toUpperCase()}
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
        </Dropdown>
    ) : (
        <Link
            to="/login?redirect=/product"
            title="Login"
            className="hidden md:flex flex-col items-start space-y-1 mr-8 hover:bg-gray-100 p-2 rounded transition duration-150 ease-in-out"
        >
            <span className="text-sm text-gray-600 px-1">Hello, đăng nhập</span>
            <span className="text-sm font-bold text-gray-800 px-1">Tài khoản & Lựa chọn</span>
        </Link>
    )
}

// navbar
const Navbar = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
    const [categories, setCategories] = useState<any[]>([])
    const { user, isAuthenticated } = useAuth()
    const { totalItem } = useCart()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await categoryApi.get()
                const topLevelCategories = allCategories.filter(
                    (category) => category.parentIds.length === 0
                )
                setCategories(topLevelCategories)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }

        fetchCategories()
    }, [])

    return (
        <header {...rest} className="bg-gray-50 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white h-auto px-6 md:px-[9rem] py-3">
                {/* Left */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link to={'/'}>
                        <img
                            className="h-[40px] w-[110px] object-contain"
                            src="https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png"
                            alt="Chamhoi_logo"
                        />
                        <span className="font-bold text-sm text-sky-800 ml-2 hover:text-sky-600">
                            Tốt & Nhanh
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-2">
                        <MdOutlineCloudDownload size={25} className="hover:text-sky-700" />
                        <div className="flex flex-col">
                            <span className="block text-sm font-semibold">Tải ứng dụng</span>
                            <span className="text-xs font-bold text-gray-500">Việt Nam</span>
                        </div>
                    </div>
                </div>

                {/* Middle */}
                <div className="flex-1 md:flex-none md:w-1/2 md:mt-4">
                    <SearchCpn />
                </div>

                {/* Right */}
                <div className="flex items-center space-x-6 md:space-x-8">
                    <Profile
                        isAuthenticated={isAuthenticated}
                        user={user}
                        isAdmin={user?.roles?.includes(UserRoles.ADMIN) ?? false}
                    />
                    {isAuthenticated && <NotifyComponent />}
                    <Link to={'/cart'}>
                        <div className="flex items-center relative hover:text-sky-600">
                            <ShoppingCartIcon className="text-2xl" />
                            <div className="absolute top-[-8px] right-[-8px] text-xs bg-orange-400 text-white rounded-full px-1">
                                {totalItem}
                            </div>
                            <span className="text-sm font-bold">Giỏ hàng</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Categories */}
            <nav className="flex flex-wrap mt-4 bg-gradient-to-r from-white to-gray-50 space-x-2 space-y-2 text-xs xl:text-sm p-4 px-[8rem] cursor-pointer border-t border-gray-200 shadow-md rounded-md">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="px-2 py-1 bg-white rounded-full shadow-sm border hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                        {category.name}
                    </div>
                ))}
            </nav>
        </header>
    )
}

export default Navbar
