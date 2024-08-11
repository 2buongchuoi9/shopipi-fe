import { useAuth } from '@/hooks'
import { Avatar, Dropdown, MenuProps } from 'antd'
import { Link } from 'react-router-dom'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar_admin = ({ ...rest }: Props) => {
    const { user, logout } = useAuth()
    return (
        <div {...rest}>
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center justify-start h-full space-x-1">
                    <Link to="/" className="h-full aspect-video">
                        <img alt="logo" className="h-full" src="/logo.png" />
                    </Link>
                    <div className="h-full flex flex-1 items-center">Kênh người bán</div>
                </div>
                <div className="flex">
                    <div className="flex">
                        <Dropdown
                            trigger={['click', 'hover']}
                            menu={{
                                items: [
                                    // { key: 1, label: <Link to="/login">Login</Link> },
                                    {
                                        key: 2,
                                        label: (
                                            <Link to="/login" onClick={logout}>
                                                Logout
                                            </Link>
                                        ),
                                    },
                                    { key: 3, label: <Link to="/">home</Link> },
                                ] as MenuProps['items'],
                            }}
                        >
                            <div className="flex items-center">
                                <Avatar src={user.image} size={'small'} className="bg-red-500">
                                    {user.image ? '' : user.name.substring(0, 1).toUpperCase()}
                                </Avatar>
                                <div className="flex flex-col">
                                    <span>{user.name}</span>
                                    <span>{user.roles.join(',')}</span>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Navbar_admin
