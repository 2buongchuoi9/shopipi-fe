import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/hooks'
import { Product } from '@/http'
import productApi from '@/http/productApi'
import cartApi from '@/http/cartApi'
import categoryApi, { Category } from '@/http/categoryApi'
import { BiSolidLike } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { Button } from 'antd'

const bannerDeal = [
    {
        id: 1,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/ee/6f/f0/617364c0eef1cdd99e97cc4d94bbe9a7.png.webp',
    },
    {
        id: 2,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/61/ac/fb/aeb9e9ab5634a9b501298fdfc54dca90.png.webp',
    },
    {
        id: 3,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/42/c5/ff/f4968bbdbaba41bbd6d098e46e1a7d7f.png.webp',
    },
    {
        id: 4,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/dd/cb/19/fa0d694d0461c0e9a9c79e45ae5c6796.png.webp',
    },
    {
        id: 5,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/9a/99/9d/3ee2715bf9262c7e8ff54e8e6e4bc5a6.png.webp',
    },
    {
        id: 6,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/42/45/7d/fe04ae5d3a077ce3cb234838445f0351.png.webp',
    },
    {
        id: 7,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/1f/38/ae/c08f32434b95f866a5df8b379d912a99.png.webp',
    },
    {
        id: 8,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/2a/11/90/14f5f554aae7a8edca067b92c7a2ad94.png.webp',
    },
    {
        id: 9,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/19/0d/fe/30dc7058b1e51fb13ffa6bb86fdede6a.png.webp',
    },
    {
        id: 10,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/e0/d3/47/e9cbb5c045bae7b28c85a3c10a713040.png.webp',
    },
    {
        id: 11,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/61/ac/fb/aeb9e9ab5634a9b501298fdfc54dca90.png.webp',
    },
    {
        id: 12,
        title: 'Sale đang di��n ra',
        image: 'https://salt.tikicdn.com/cache/w280/ts/tikimsp/42/c5/ff/f4968bbdbaba41bbd6d098e46e1a7d7f.png.webp',
    },
]

const ProductPageHome = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const { user } = useAuth()

    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [currentSuggestedPage, setCurrentSuggestedPage] = useState(0)
    const [currentBestSellingProducts, setCurrentBestSellingProducts] = useState<Product[]>([])
    const itemsPerPage = 5

    const handlePrev = (type: 'products' | 'suggested' | 'bestSelling') => {
        if (type === 'products' && currentPage > 0) {
            setCurrentPage(currentPage - 1)
        } else if (type === 'suggested' && currentSuggestedPage > 0) {
            setCurrentSuggestedPage(currentSuggestedPage - 1)
        } else if (type === 'bestSelling' && currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = (type: 'products' | 'suggested' | 'bestSelling') => {
        if (type === 'products' && (currentPage + 1) * itemsPerPage < products.length) {
            setCurrentPage(currentPage + 1)
        } else if (
            type === 'suggested' &&
            (currentSuggestedPage + 1) * itemsPerPage < suggestedProducts.length
        ) {
            setCurrentSuggestedPage(currentSuggestedPage + 1)
        } else if (
            type === 'bestSelling' &&
            (currentPage + 1) * itemsPerPage < currentBestSellingProducts.length
        ) {
            setCurrentPage(currentPage + 1)
        }
    }

    const startIndex = currentPage * itemsPerPage
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

    const startSuggestedIndex = currentSuggestedPage * itemsPerPage
    const currentSuggestedProducts = suggestedProducts.slice(
        startSuggestedIndex,
        startSuggestedIndex + itemsPerPage
    )

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await productApi.getAll({ state: 'ACTIVE' })
            const products = data.content.map((p) => {
                let totalPrice = 0
                let totalPriceSale = 0
                let countPrice = 0
                let countPriceSale = 0

                p.variants.forEach((v) => {
                    if (v.price > 0) {
                        totalPrice += v.price
                        countPrice++
                    }
                    if (v.priceSale > 0) {
                        totalPriceSale += v.priceSale
                        countPriceSale++
                    }
                })

                const price = countPrice > 0 ? totalPrice / countPrice : 0
                const priceSale = countPriceSale > 0 ? totalPriceSale / countPriceSale : 0
                return {
                    ...p,
                    price,
                    priceSale,
                    discount:
                        p.sale?.type === 'FIXED_AMOUNT' ? p.sale?.value.vnd() : p.sale?.value + '%',
                }
            })
            setSuggestedProducts(products)
            setProducts(products)
            setCurrentBestSellingProducts(products.filter((p) => p.sold > 10))
            const res = await cartApi.getCart()
            console.log('cart', res)
        }

        const fetchCategories = async () => {
            try {
                const categoryData = await categoryApi.get()
                setCategories(categoryData)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }

        fetchProducts()
        fetchCategories()
    }, [currentPage, currentSuggestedPage])

    return (
        <div>
            {/* Top deal giá rẻ */}
            <div className="relative w-full h-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-8">
                    <div className="flex gap-2 mb-2 pt-5 items-center">
                        <BiSolidLike className="text-2xl text-red-500" />
                        <span className="font-bold text-[18px] text-gray-600">Top Deal Giá rẻ</span>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-2">
                            <Link
                                to="/re-nhat-thang"
                                className="bg-red-100 text-red-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hover:bg-red-200 transition-all duration-300 transform hover:scale-105"
                            >
                                Rẻ nhất tháng
                            </Link>
                            <Link
                                to="/sale-dau-thang"
                                className="bg-blue-100 text-blue-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 transition-all duration-300 transform hover:scale-105"
                            >
                                Sale đầu tháng
                            </Link>
                            <Link
                                to="/mua-nhieu-nhat"
                                className="bg-green-100 text-green-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hover:bg-green-200 transition-all duration-300 transform hover:scale-105"
                            >
                                Mua nhiều nhất
                            </Link>
                            <Link
                                to="/yeu-thich-nhat"
                                className="bg-yellow-100 text-yellow-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105"
                            >
                                Yêu thích nhất
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 ml-1 px-4 pb-10">
                        {currentProducts.map((p) => (
                            <ProductCard key={p.id} product={p} type="any" />
                        ))}
                    </div>
                </div>
                <div className="absolute top-1/2 left-[-5px] right-[-5px] flex justify-between px-4 transform -translate-y-1/2 transition-all duration-300 ease-in-out">
                    <button
                        onClick={() => handlePrev('products')}
                        disabled={currentPage === 0}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 transition-transform duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <FcPrevious className="text-xl" />
                    </button>
                    <button
                        onClick={() => handleNext('products')}
                        disabled={(currentPage + 1) * itemsPerPage >= products.length}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 transition-transform duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <FcNext className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Sản phẩm yêu thích */}
            <div className="w-full h-full bg-white rounded-lg mt-3 shadow-lg">
                <div className="p-5 px-6 ml-1">
                    <div className="pb-2 border-b border-gray-200">
                        <div className="flex gap-2 items-center">
                            <span className="font-bold text-lg text-gray-800">
                                Sản phẩm đánh giá cao
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-4">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} type="any" ratingFilter="high" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sản phẩm mới ra mắt */}
            <div className="w-full h-full bg-white rounded-lg mt-3 shadow-lg">
                <div className="p-4">
                    <div className="pb-2 border-b border-gray-200">
                        <div className="flex gap-2 items-center">
                            <span className="font-bold text-lg text-gray-800">Deal mới mở bán</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                        {products.map((p) => (
                            <div key={p.id} className="border rounded-lg">
                                <ProductCard product={p} type="newCards" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deal banner */}
            <div className="w-full h-full bg-white rounded-lg mt-3">
                <div className="p-2">
                    <div className="flex flex-wrap gap-3 p-1 justify-center">
                        {bannerDeal.map((banner) => (
                            <div
                                key={banner.id}
                                className="w-[10rem] h-[10rem] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                            >
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sản phẩm bán nhiều */}
            <div className="relative w-full h-full bg-white rounded-lg mt-3 shadow-lg">
                <div className="px-8 py-6">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex gap-2 items-center">
                            <span className="font-bold text-lg text-gray-800">
                                Sản phẩm bán chạy
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {currentBestSellingProducts.map((p) => (
                            <ProductCard key={p.id} product={p} type="any" soldFilter="high" />
                        ))}
                    </div>
                </div>
                <div className="absolute top-1/2 left-[-5px] right-[-5px] flex justify-between px-4 transform -translate-y-1/2">
                    <button
                        onClick={() => handlePrev('bestSelling')}
                        disabled={currentPage === 0}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 transition-transform duration-300 ease-in-out"
                        style={{ transform: currentPage === 0 ? 'scale(0.9)' : 'scale(1)' }}
                    >
                        <FcPrevious className="text-xl" />
                    </button>
                    <button
                        onClick={() => handleNext('bestSelling')}
                        disabled={
                            (currentPage + 1) * itemsPerPage >= currentBestSellingProducts.length
                        }
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 transition-transform duration-300 ease-in-out"
                        style={{
                            transform:
                                (currentPage + 1) * itemsPerPage >=
                                currentBestSellingProducts.length
                                    ? 'scale(0.9)'
                                    : 'scale(1)',
                        }}
                    >
                        <FcNext className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Tất cả sản phẩm */}
            <div className="w-full h-full bg-white rounded-lg mt-3 shadow-lg">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-gray-800">Tất cả sản phẩm</span>
                        <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} type="any" />
                    ))}
                </div>
                <div className="p-4 flex justify-center">
                    <Button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                        Hiển thị thêm sản phẩm khác
                        <span className="ml-2 text-sm text-gray-200">
                            ({products.length} sản phẩm)
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductPageHome
