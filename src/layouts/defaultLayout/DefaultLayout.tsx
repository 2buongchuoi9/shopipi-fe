import { ReactNode } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import CartProvider from '@/contexts/CartContext'

type Props = {
    children: ReactNode
}

const DefaultLayout = ({ children }: Props) => {
    return (
        <>
            <CartProvider>
                <Navbar />
                <main className=" bg-[#f5f5f5]">
                    <div className="mx-[5rem]">{children}</div>
                </main>
                <Footer />
            </CartProvider>
        </>
    )
}
export default DefaultLayout
