import ProductCard from '@/components/ProductCard'
import TimeCount from '@/components/TimeCount'
import { buildCategoryTree } from '@/contexts/CategoryContex'
import { useAuth, useCategory, useMessage } from '@/hooks'
import { Category, ParamsRequest, Product } from '@/http'
import productApi from '@/http/productApi'
import shopApi, { Online, Shop } from '@/http/shopApi'
import ErrorPage from '@/pages/ErrorPage'
import { Button, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { PiPlus } from 'react-icons/pi'
import { useParams } from 'react-router-dom'

type ShopPageProps = {
    ratting: number
    // category
}

const ShopPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const {
        isAuthenticated,
        user: { id: currentId },
    } = useAuth()
    const { categories, categoriesFlat } = useCategory()
    const [shop, setShop] = useState<(Shop & Online) | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [avgRating, setAvgRating] = useState<number>(0)
    const [totalRatingCount, setTotalRatingCount] = useState<number>(0)
    const { success, error } = useMessage()
    const [cateShop, setCateShop] = useState<Category[] | null>(null)
    const [query, setQuery] = useState<ParamsRequest>({
        page: 0,
        size: 10,
        sort: '',
        minPrice: null,
        maxPrice: null,
        state: 'ACTIVE',
        rate: null,
        categoryId: null,
    })

    const [cc, setCc] = useState<{ minPrice: number | null; maxPrice: number | null }>({
        minPrice: null,
        maxPrice: null,
    })

    console.log('cateShop', cateShop)

    const handleFollow = async () => {
        if (!isAuthenticated) {
            error('Vui lòng đăng nhập để theo dõi shop')
            return
        }

        if (shop) {
            await shopApi.followerShop(shop.id)
            await fetchShop()
        }
    }

    const fetchShop = async () => {
        if (slug) {
            const res = await shopApi.findShopBySlug(slug)
            const ol = await shopApi.online(res.id)
            setShop({ ...ol, ...res })

            const res3 = await productApi.getAll({ shopId: res.id, size: 1000, ...query })

            let avgRating = 0
            let totalRating = 0

            const products = res3.content.map((p) => {
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

                avgRating += p.ratingAvg
                totalRating += p.totalRating

                return {
                    ...p,
                    price,
                    priceSale,
                    discount:
                        p.sale?.type === 'FIXED_AMOUNT' ? p.sale?.value.vnd() : p.sale?.value + '%',
                }
            })

            setProducts(products)

            let idsCate: string[] = []

            res3.content.forEach((product) => {
                idsCate.push(product.category.id)
                if (product.category.parentIds.length > 0)
                    idsCate = [...idsCate, ...product.category.parentIds]
            })

            const cc = categoriesFlat
                .filter((cate) => idsCate.includes(cate.id))
                .map((cate) => {
                    cate.children = []
                    return cate
                })

            setCateShop(buildCategoryTree(cc, null))

            setAvgRating(avgRating / totalRating)
            setTotalRatingCount(totalRating)
        }
    }

    useEffect(() => {
        if (slug && categoriesFlat.length > 0) {
            fetchShop()
        }
    }, [slug, categoriesFlat, query])

    const handleApplyFilter = () => {
        setQuery((prev) => ({
            ...prev,
            minPrice: cc.minPrice,
            maxPrice: cc.maxPrice,
        }))
    }

    if (!slug) {
        return <ErrorPage subTitle="Không tim thấy shop" />
    }

    return (
        <div className="w-full h-auto p-10">
            {!shop ? (
                <div className="flex justify-center items-center">
                    <div className="text-lg font-semibold">Đang tải...</div>
                </div>
            ) : (
                <div className="w-full h-auto bg-gray-100">
                    {/* header */}
                    <div className="relative p-10 w-full flex bg-white">
                        <img
                            src={shop.image ?? ''}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-100"
                        />
                        <div className="relative p-6 bg-white border w-[25rem] h-[12rem] space-y-6 rounded-lg">
                            <div className="flex space-x-6 items-center">
                                <img
                                    src={shop.image ?? ''}
                                    alt=""
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                                />
                                <div>
                                    <p className="text-xl font-bold text-black">{shop.name}</p>
                                    <p className="text-black text-xs">
                                        {shop.isOnline ? (
                                            'Đang online'
                                        ) : (
                                            <TimeCount createdAt={shop.time} />
                                        )}
                                    </p>
                                </div>
                            </div>
                            <Button
                                block
                                size="small"
                                onClick={handleFollow}
                                className={`border transition-all duration-300 rounded-full ${
                                    shop.followers && shop.followers.includes(currentId)
                                        ? 'border-transparent text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                                        : 'border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white'
                                }`}
                                icon={
                                    !(shop.followers && shop.followers.includes(currentId)) && (
                                        <PiPlus />
                                    )
                                }
                            >
                                {shop.followers && shop.followers.includes(currentId)
                                    ? 'Đang theo dõi'
                                    : 'Theo dõi'}
                            </Button>
                        </div>
                        <div className="relative bg-white w-2/3 grid grid-cols-2 gap-2 p-8 border ml-5 rounded-lg">
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Sản phẩm:
                                    <span className="text-red-600 ml-1">{products.length}</span>
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Người theo dõi: {shop.followers && shop.followers.length}
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Đang theo dõi: {shop.followers && shop.followers.length}
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Đánh giá:
                                    {`${avgRating.toFixed(1)} (${totalRatingCount} đánh giá)`}
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Tỉ lệ phản hồi:
                                    {Math.floor(Math.random() * 51) + 50}% (trong vài giờ)
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    type="link"
                                    icon={<FaUser />}
                                    className="text-gray-700 hover:text-blue-500"
                                >
                                    Tham gia: {shop.createdAt}
                                </Button>
                            </div>
                            {/* search */}
                            <div className="border rounded-lg p-2 bg-white w-auto h-auto mt-5">
                                <div className="text-xs font-extrabold text-sky-500 mb-2">
                                    Tìm theo giá
                                </div>
                                <div className="border-t border-gray-200" />
                                <div className="space-y-2 mt-3">
                                    <InputNumber<number>
                                        addonAfter="Ngìn đồng"
                                        addonBefore="Min"
                                        type="number"
                                        value={cc.minPrice ? cc.minPrice / 1000 : null}
                                        onChange={(value) => {
                                            setCc((prev) => ({
                                                ...prev,
                                                minPrice: value ? value * 1000 : null,
                                            }))
                                        }}
                                    />
                                    <InputNumber<number>
                                        addonAfter="Ngìn đồng"
                                        addonBefore="Max"
                                        type="number"
                                        value={cc.maxPrice ? cc.maxPrice / 1000 : null}
                                        onChange={(value) =>
                                            setCc((prev) => ({
                                                ...prev,
                                                maxPrice: value ? value * 1000 : null,
                                            }))
                                        }
                                    />
                                    <div className="flex items-center justify-center">
                                        <Button type="primary" onClick={handleApplyFilter}>
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* product */}
                    <div className="flex mt-10 p-6 bg-white rounded-lg">
                        {/* categories */}
                        <div className="w-1/6 border rounded-lg mr-5 p-5">
                            {cateShop && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                        Danh mục
                                    </h2>
                                    <ul className="space-y-2">
                                        {cateShop.map((category) => (
                                            <li
                                                key={category.id}
                                                className="text-sm text-gray-700 cursor-pointer"
                                                onClick={() =>
                                                    setQuery((prev) => ({
                                                        ...prev,
                                                        categoryId: category.id,
                                                    }))
                                                }
                                            >
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="px-1 py-4 rounded-lg duration-300">
                                    <ProductCard product={product} type="any" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShopPage
