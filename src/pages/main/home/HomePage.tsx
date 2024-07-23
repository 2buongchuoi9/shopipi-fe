import { REDIRECT_RESULT_ORDER } from '@/utils/constants'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import CategoryHome from './CategoryHome'
import CategoryLeft from './CategoryLeft'
import ProductPageHome from './ProductPageHome'

const HomePage = () => {
    const navigate = useNavigate()



    return (
        <div className="w-full h-full flex relative">
            <div className="mt-5">
                <CategoryLeft />
            </div>
            <div className="ml-auto p-5">
                <Header />
                <div className="mt-2">
                    <CategoryHome />
                </div>
                <div>
                    <ProductPageHome />
                </div>
            </div>
        </div>
    )
}
export default HomePage
