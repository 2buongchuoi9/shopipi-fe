import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart, useMessage } from '@/hooks'
import authApi, { User } from '@/http/authApi'
import { UserRoles } from '@/utils/constants'
import { Avatar, Dropdown, MenuProps } from 'antd'
import { HTMLAttributes, useEffect, useState } from 'react'
import { MdOutlineCloudDownload } from 'react-icons/md'
import SearchCpn from '@/components/SearchCpn'
import { NotifyComponent } from '@/components/notification'

type Props = {
    isAuthenticated: boolean
    user: User
    isAdmin: boolean
    isUser: boolean
}

const Profile = ({ isAuthenticated, user, isAdmin, isUser }: Props) => {
    const { logout, fetchUser } = useAuth()
    const { success, error } = useMessage()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        !isAuthenticated && { key: '1', label: <Link to="/login">Đăng nhập</Link> },
        !isUser && {
            key: '3',
            label: (
                <Link to={isAdmin ? '/admin/product' : '/seller/'}>
                    {' '}
                    {isAdmin ? 'Trang quản trị' : 'Kênh bán hàng'}
                </Link>
            ),
        },
        isUser && {
            key: '4',
            label: 'Đăng ký bán hàng',
            onClick: async () => {
                try {
                    if (!user.name || !user.email || !user.slug || !user.phone || !user.image) {
                        error('Vui lòng điền đầy đủ thông tin hồ sơ trước khi đăng ký bán hàng')
                        navigate('/user/account') // Chuyển hướng đến trang hồ sơ
                        return
                    }
                    await authApi.registerShop(user.id)
                    await fetchUser()
                    success('Đăng ký shop thành công')
                    navigate('/user/account') // Điều hướng về trang hồ sơ sau khi đăng ký thành công
                } catch (e) {
                    console.log('error', e)
                    error('Đăng ký shop thất bại')
                }
            },
        },
        {
            key: '5',
            label: <Link to={'/user/account'}>Hồ sơ của tôi</Link>,
        },
        {
            key: '6',
            label: <Link to={'/user/order'}>Đơn hàng của tôi</Link>,
        },
        isAuthenticated && {
            key: '7',
            label: (
                <Link to="/login" onClick={logout}>
                    Đăng xuất
                </Link>
            ),
        },
    ].filter(Boolean) as MenuProps['items']

    return isAuthenticated ? (
        <Dropdown trigger={['click', 'hover']} menu={{ items }}>
            <div className="flex">
                <Avatar src={user.image} size={'small'} className="bg-red-500">
                    {user.image ? '' : user.name.substring(0, 1).toUpperCase()}
                </Avatar>
                <span>{user.name}</span>
            </div>
        </Dropdown>
    ) : (
        <Link
            to="/login?redirect=/"
            title="Login"
            className="hidden md:flex md:flex-col md:items-start md:space-y-1 mr-[2rem] hover:shadow-2xl rounded-md link-hover-effect"
        >
            <div className="text-1sm px-1">Hello, đăng nhập</div>
            <div className="text-1sm font-bold px-1">Tài khoản & Lựa chọn</div>
        </Link>
    )
}

const Navbar = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
    const [categories, setCategories] = useState<any[]>([])
    const { user, isAuthenticated } = useAuth()
    const { totalItem } = useCart()

    useEffect(() => {
        fetch('/data/categories.json')
            .then((response) => response.json())
            .then((data) => {
                const categoriesArray = Object.keys(data).map((key) => data[key])
                setCategories(categoriesArray)
            })
            .catch((error) => console.error('Error fetching products:', error))
    }, [])

    return (
        <header {...rest}>
            <div className="flex flex-col md:flex-row justify-between bg-amazonclone text-black h-[60px] px-10 py-2">
                {/* Left */}
                <div className="flex items-center space-x-4 md:space-x-0 md:mx-4">
                    <Link to={'/'}>
                        <img
                            className="h-[35px] w-[100px]"
                            src="https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png"
                            alt="Amazon logo"
                        />
                        <span className="font-bold text-sm text-sky-800 ml-2">Tốt & Nhanh</span>
                    </Link>
                    <div className="hidden md:flex md:items-start mb-2">
                        <span className="ml-8 mt-4">
                            <MdOutlineCloudDownload size={25} />
                        </span>
                        <div className="ml-3">
                            <span className="block text-sm font-semibold">Tải ứng dụng</span>
                            <div className="text-xs font-bold">Việt Nam</div>
                        </div>
                    </div>
                </div>
                {/* Middle */}
                <div className="flex-1 md:flex-none md:w-1/2 md:mt-4 m-3">
                    <SearchCpn />
                </div>

                {/* Right */}
                <div className="flex flex-col-3 md:flex-row items-center space-x-4 md:space-x-0 md:mx-1 mt-2 md:mt-0">
                    <Profile
                        isAuthenticated={isAuthenticated}
                        user={user}
                        isAdmin={user?.roles?.includes(UserRoles.ADMIN) ?? false}
                        isUser={user?.roles?.includes(UserRoles.USER) && user?.roles.length === 1}
                    />
                    {isAuthenticated && <NotifyComponent />}
                    <div className="mr-[1rem]">
                        <Link to={'/cart'}>
                            <div className="flex items-center mr-3 ml-4 m-1">
                                <ShoppingCartIcon className="size-10" />
                                <div className="relative mb-[3rem]">
                                    <div className="absolute right-[12px] font-bold mt-2 text-orange-400">
                                        {totalItem}
                                    </div>
                                </div>
                                <div className="mt-5 text-1sm font-bold hover:text-black hover:shadow-2xl">
                                    Giỏ hàng
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mt-4 bg-white text-black space-x-3 text-xs xl:text-sm ml-11 p-2 cursor-pointer px-5">
                {categories.map((category) => (
                    <div key={category.id} className="hover:text-sky-700">
                        {category.name}
                    </div>
                ))}
            </div>
        </header>
    )
}

export default Navbar
