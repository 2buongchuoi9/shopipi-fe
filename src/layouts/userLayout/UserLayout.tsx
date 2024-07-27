import CartProvider from '@/contexts/CartContext'
import Navbar from '../defaultLayout/Navbar'
import Footer from '../defaultLayout/Footer'
import NavLeft_user from './NavLeft_user'
type Props = {
    children: React.ReactNode
}

const UserLayout = ({ children }: Props) => {
    return (
        <>
            <CartProvider>
                <Navbar className="h-[7rem] bg-white" />
                <main className=" bg-[#f5f5f5] flex py-4 w-full px-[9rem]">
                    <NavLeft_user className=" h-screen w-[15rem] sticky top-[0]" />
                    <div className="w-full">{children}</div>
                </main>
                <Footer />
            </CartProvider>
        </>
    )
}
export default UserLayout
