import Header from './Header'
import CategoryHome from './CategoryHome'
import CategoryLeft from './CategoryLeft'
import ProductPageHome from './ProductPageHome'

const HomePage = () => {
    return (
        <div className="w-full h-full flex relative">
            <div className="h-full flex">
                <div className="sticky top-0 mt-5 h-full">
                    <CategoryLeft />
                </div>
                <div className=" p-5 overflow-y-auto h-full flex flex-col">
                    <div className="flex-grow">
                        <Header />
                        <CategoryHome />
                        <ProductPageHome />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage
