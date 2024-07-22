import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
// import Search from '../Search/Search'
import { useAuth, useCart, useMessage } from '@/hooks'
import authApi, { User } from '@/http/authApi'
import { UserRoles } from '@/utils/constants'
import { Avatar, Dropdown, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { MdOutlineCloudDownload } from 'react-icons/md'

type Props = {
    isAuthenticated: boolean
    user: User
    isAdmin: boolean
}

const Profile = ({ isAuthenticated, user, isAdmin }: Props) => {
    const { logout, fetchUser } = useAuth()
    const { success, error } = useMessage()

    const items: MenuProps['items'] = [
        { key: 1, label: <Link to="/login">Login</Link> },
        {
            key: 2,
            label: <Link to={isAdmin ? '/admin/product' : '/seller/product/all'}>dô admin</Link>,
        },
        {
            key: 3,
            label: (
                <Link to="/login" onClick={logout}>
                    Logout
                </Link>
            ),
        },
        {
            key: 4,
            label: 'đăng ký shop',
            onClick: async () => {
                try {
                    await authApi.registerShop(user.id)
                    await fetchUser()
                    success('Đăng ký shop thành công')
                } catch (e) {
                    console.log('error', e)
                    error('Đăng ký shop thất bại')
                }
            },
        },
    ]

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
            to="/login?redirect=/product"
            title="Login"
            className="hidden md:flex md:flex-col md:items-start md:space-y-1 mr-[2rem] hover:border hover:border-white focus:border-white"
        >
            <div className="text-1sm">Hello, đăng nhập</div>
            <div className="text-1sm font-bold">Tài khoản & Lựa chọn</div>
        </Link>
    )
}

const Navbar = () => {
    const [categories, setCategories] = useState<any[]>([])
    const { user, isAuthenticated } = useAuth()
    const { totalItem, totalQuantity } = useCart()

    console.log('user', user)

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
        <header className="w-full bg-black">
            <div className="flex flex-col md:flex-row flex-wrap justify-between bg-amazonclone text-white h-[60px] px-5">
                {/* Left */}
                <div className="flex items-center space-x-4 md:space-x-0 md:mx-4">
                    <Link to={'/product'} className="focus:outline-white">
                        <img
                            className="h-[35px] w-[100px]"
                            src={'../images/amazon.png'}
                            alt="Amazon logo"
                        />
                    </Link>
                    <div className="hidden md:flex md:items-start mb-2">
                        <span className="ml-8 mt-4">
                            <MdOutlineCloudDownload size={25} />
                        </span>
                        <div className="text-1sm">
                            <span className="mt-1 flex ml-3">Tải ứng dụng</span>
                            <div className="text-1sm font-bold ml-3">Việt Nam</div>
                        </div>
                    </div>
                </div>
                {/* Middle */}
                <div className="flex-1 md:flex-none md:w-1/2 md:mt-0 m-3">
                    search
                    {/* <Search /> */}
                </div>
                {/* Right */}
                <div className="flex flex-col-3 md:flex-row items-center space-x-4 md:space-x-0 md:mx-1 mt-2 md:mt-0">
                    <Profile
                        isAuthenticated={isAuthenticated}
                        user={user}
                        isAdmin={user?.roles?.includes(UserRoles.ADMIN) ?? false}
                    />
                    <div className="hidden md:flex md:flex-col md:items-start md:space-y-1 mr-[2rem] hover:border hover:border-white focus:border-white">
                        <div className="text-1sm">Giỏ hàng</div>
                        <div className="text-1sm font-bold">& Thanh toán</div>
                    </div>
                    <div className="mr-[1rem]">
                        <Link to={'/cart'}>
                            <div className="flex items-center mr-3 ml-4 m-1 hover:border hover:border-white">
                                <ShoppingCartIcon className="size-10" />
                                <div className="relative mb-[3rem]">
                                    <div className="absolute right-[12px] font-bold mt-2 text-orange-400">
                                        {totalItem}
                                    </div>
                                </div>
                                <div className="mt-5 text-1sm font-bold hover:text-white">Cart</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap w-full mt-1 bg-slate-900 text-white space-x-3 text-xs xl:text-sm p-1 pl-6 cursor-pointer">
                {categories.map((category) => (
                    <div key={category.id}>{category.name}</div>
                ))}
            </div>
        </header>
    )
}

export default Navbar
