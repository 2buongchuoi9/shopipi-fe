import { ReactNode, useEffect, useState } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import CartProvider from '@/contexts/CartContext'
import ChatComponent from '@/components/chat/ChatComponent'
import { Badge, Button } from 'antd'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { useAuth, useMessage } from '@/hooks'
import socketService from '@/socketService'

type Props = {
    children: ReactNode
}

const DefaultLayout = ({ children }: Props) => {
    return (
        <>
            <CartProvider>
                <Navbar className="h-[7rem] bg-white" />
                <main className=" bg-[#f5f5f5]">
                    <div className="mx-[5rem]">{children}</div>
                </main>
                <Footer />
            </CartProvider>
        </>
    )
}
export default DefaultLayout
