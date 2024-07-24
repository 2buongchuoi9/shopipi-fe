import ChatComponent from '@/components/chat/ChatComponent'
import CategoryHome from './CategoryHome'
import CategoryLeft from './CategoryLeft'
import Header from './Header'
import ProductPageHome from './ProductPageHome'

const HomePage = () => {
    // const navigate = useNavigate()

    return (
        <>
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
            {/* <h1>Gửi đến Dũng nguyễn</h1>
            <Chat receiver="6680dfff69dddc1a78bfaf0f" />
            <h1>Gửi đến Da Đen</h1>
            <Chat receiver="669fe92dc7307a29b809c9df" /> */}

            <ChatComponent />
        </>
    )
}
export default HomePage
