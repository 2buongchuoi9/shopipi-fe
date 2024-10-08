import { ReactNode } from 'react'
import Navbar from './Navbar_admin'
import NavLeft_admin from './NavLeft_admin'

type Props = {
    children: ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <div className="w-full h-full">
            <Navbar className="fixed top-0 left-0 w-full h-[3.5rem] z-50 bg-slate-400 backdrop-blur-lg backdrop-opacity-50" />
            <NavLeft_admin className="fixed top-0 left-0 h-screen w-[13.5rem] pt-[3.5rem]" />
            <main className="mt-[3.5rem] ml-[13.5rem] p-8 bg-[#f6f6f6]">{children}</main>
        </div>
    )
}
export default AdminLayout
