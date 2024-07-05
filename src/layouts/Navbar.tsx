import { google_url_login } from '@/utils'
import { Link } from 'react-router-dom'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar = ({ ...rest }: Props) => {
    return (
        <div {...rest}>
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center justify-start h-full space-x-1">
                    <Link to="/" className="h-full aspect-video">
                        <img alt="logo" className="h-full" src="logo.png" />
                    </Link>
                    <div className="h-full flex flex-1 items-center">Kênh người </div>
                </div>
                <div className="flex">
                    <div className="h-full flex items-center space-x-2">
                        <Link
                            to={google_url_login}
                            className="h-full flex items-center px-2 text-white bg-slate-400"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="h-full flex items-center px-2 text-white bg-slate-400"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Navbar
