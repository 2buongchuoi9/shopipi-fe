import { Comment } from '@/components/comment'
import ProductCard from '@/components/ProductCard'
import QuantitySelector from '@/components/QuantitySelector'
import { useAuth, useCart, useMessage } from '@/hooks'
import { Product } from '@/http'
import authApi from '@/http/authApi'
import cartApi from '@/http/cartApi'
import categoryApi, { Category } from '@/http/categoryApi'
import productApi, { initialProduct, Map, Variant } from '@/http/productApi'
// import ratingApi from '@/http/ratingApi'
import { Button, Radio, Typography, Divider } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { Link, useParams } from 'react-router-dom'

const { Title, Text } = Typography

const services = [
    {
        imgSrc: 'https://salt.tikicdn.com/ts/upload/73/4d/f7/f86e767bffc14aa3d6abed348630100b.png',
        altText: 'Mua trước trả sau',
        title: 'Mua trước trả sau',
        description: 'Thanh toán linh hoạt với dịch vụ mua trước trả sau.',
        linkText: 'Đăng Ký',
        linkHref: '#',
    },
    {
        imgSrc: 'https://salt.tikicdn.com/ts/upload/2a/27/6a/7bbba1f6c93a1a42a3c314e7b5825f4c.png',
        altText: 'Ưu đãi ticket',
        title: 'Ưu đãi ticket',
        description: 'Nhận ngay ưu đãi khi mua vé sự kiện.',
        linkText: 'Đăng Ký',
        linkHref: '#',
    },
]
const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>()
    const { fetchCart } = useCart()
    const { isAuthenticated, setUser } = useAuth()
    const { success, error } = useMessage()
    const [categories, setCategories] = useState<Category[]>([])

    const [product, setProduct] = useState<Product>(initialProduct)
    const [products, setProducts] = useState<Product[]>([])
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])
    const [selectedValuesVariant, setSelectedValuesVariant] = useState<Map[]>([])
    const [quantity, setQuantity] = useState(1)
    const [currentImage, setCurrentImage] = useState<string>(initialProduct.thumb)
    const [currentPage, setCurrentPage] = useState(0)
    const [currentSuggestedPage, setCurrentSuggestedPage] = useState(0)
    const itemsPerPage = 5

    const {
        attribute: { listVariant },
        variants,
        description,
        thumb,
        name,
        price,
        priceSale,
        shop,
        quantity: productQuantity,
        id,
        images,
    } = product

    const productDetails = [
        { title: 'Tên sản phẩm', description: name },
        { title: 'Giá', description: price ? `${price} VND` : 'N/A' },
        { title: 'Giá khuyến mãi', description: priceSale ? `${priceSale} VND` : 'N/A' },
        { title: 'Số lượng', description: productQuantity.toString() },
        { title: 'Shop', description: shop.name },
        { title: 'Mô tả', description },
    ]

    const totalPrice = useMemo(() => {
        const finalPrice = priceSale || price || 0
        return quantity * finalPrice
    }, [quantity, price, priceSale])

    const formatPrice = (price: number) => {
        return price
            .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            .replace('₫', 'VND')
    }

    const startIndex = currentPage * itemsPerPage
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

    const startSuggestedIndex = currentSuggestedPage * itemsPerPage
    const currentSuggestedProducts = suggestedProducts.slice(
        startSuggestedIndex,
        startSuggestedIndex + itemsPerPage
    )

    const handlePrev = (type: 'products' | 'suggested') => {
        if (type === 'products' && currentPage > 0) {
            setCurrentPage(currentPage - 1)
        } else if (type === 'suggested' && currentSuggestedPage > 0) {
            setCurrentSuggestedPage(currentSuggestedPage - 1)
        }
    }

    const handleNext = (type: 'products' | 'suggested') => {
        if (type === 'products' && (currentPage + 1) * itemsPerPage < products.length) {
            setCurrentPage(currentPage + 1)
        } else if (
            type === 'suggested' &&
            (currentSuggestedPage + 1) * itemsPerPage < suggestedProducts.length
        ) {
            setCurrentSuggestedPage(currentSuggestedPage + 1)
        }
    }

    const matchedVariant = () => {
        return variants.find((variant) =>
            variant.valueVariant.every((valueVariant) =>
                selectedValuesVariant.some(
                    (selectedValue) =>
                        selectedValue.key === valueVariant.key &&
                        selectedValue.value === valueVariant.value
                )
            )
        )
    }

    const handleClickVariant = (map: Map) => {
        setSelectedValuesVariant((prev) => {
            const filtered = prev.filter((item) => item.key !== map.key)
            return [...filtered, map]
        })
    }

    const handleAddToCart = async () => {
        const o = matchedVariant()
        if (o) {
            if (quantity > o.quantity) {
                error('Không đủ số lượng trong kho')
                return
            }

            const data = { productId: product.id, variantId: o.id, quantity }
            let res
            if (!isAuthenticated) {
                const userMod = await authApi.registerUserMod()
                setUser(userMod)
                res = await cartApi.addToCartGuest(data, userMod.id)
            } else {
                res = await cartApi.addToCart(data)
            }

            await fetchCart()
            success('Đã thêm vào giỏ hàng')
        } else {
            error('Không tìm thấy biến thể phù hợp')
        }
    }

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

    useEffect(() => {
        if (slug) {
            ;(async () => {
                try {
                    const data = await productApi.findBySlug(slug)
                    let totalPrice = 0
                    let totalPriceSale = 0
                    let countPrice = 0
                    let countPriceSale = 0

                    data.variants.forEach((v) => {
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

                    setProduct({
                        ...data,
                        price,
                        priceSale,
                    })
                    setCurrentImage(data.thumb)
                } catch (err) {
                    error('Có lỗi xảy ra khi tải sản phẩm')
                }
            })()
        }
    }, [slug])
    return (
        <div className="w-full h-auto">
            <div className="container p-4 flex flex-col md:flex-row rounded-lg relative">
                {/* image product */}
                <div className="p-3 sticky top-0 h-full">
                    <div className="bg-white p-5">
                        <div className="w-[25rem] h-[30rem] border">
                            <img
                                className="object-cover w-full h-full"
                                src={currentImage}
                                alt="Product Image"
                            />
                        </div>
                        <div className="flex mt-4 space-x-2 p-2">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg ${
                                        currentImage === image ? 'border-4 border-blue-500' : ''
                                    }`}
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setCurrentImage(image)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info productDetail */}
                <div className="w-[50rem] p-3">
                    {/*  Price  */}
                    <div className="w-full h-auto bg-white rounded-lg shadow-sm">
                        <div className="">
                            <div className="p-4">
                                <div className="flex gap-3">
                                    <Link
                                        to="/re-nhat-thang"
                                        className="bg-red-100 text-red-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-2xl hover:bg-red-200 transition duration-300"
                                    >
                                        Top Deal
                                    </Link>
                                    <Link
                                        to="/sale-dau-thang"
                                        className="bg-blue-100 text-blue-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-2xl hover:bg-blue-200 transition duration-300"
                                    >
                                        Chính hãng
                                    </Link>
                                    <Link
                                        to="/mua-nhieu-nhat"
                                        className="bg-yellow-200 text-sky-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-2xl hover:bg-green-200 transition duration-300"
                                    >
                                        Đổi trả 30 ngày
                                    </Link>
                                    <Link
                                        to={`/shop/${shop.slug}`}
                                        className="bg-black text-white hover:text-black ml-[6rem] hover:border-b-2 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-2xl hover:bg-white transition duration-300"
                                    >
                                        Thăm shop
                                    </Link>
                                </div>
                                <div className="flex-1 p-1">
                                    <div className="flex-1 p-4">
                                        <Title level={3}>{name}</Title>
                                        <div className="flex justify-between mt-2">
                                            <Text strong>Giá:</Text>
                                            <Text delete={!!priceSale} className="text-gray-500">
                                                {price ? formatPrice(price) : 'N/A'}
                                            </Text>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <Text strong>Giá khuyến mãi:</Text>
                                            <Text className="text-red-500">
                                                {priceSale ? formatPrice(priceSale) : 'N/A'}
                                            </Text>
                                        </div>

                                        <div className="block">
                                            <Link
                                                to={`/shop/${shop.slug}`}
                                                className="bg-sky-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-2xl hover:bg-slate-500"
                                            >
                                                Cửa hàng: {shop.name}
                                            </Link>
                                        </div>
                                        <Text className="block">
                                            Số lượng còn lại:
                                            {matchedVariant()?.quantity ?? productQuantity}
                                        </Text>
                                        <Divider />
                                        {listVariant.map((item) => (
                                            <div key={item.key} className="mb-2">
                                                <Text className="mr-2 uppercase text-black font-light">
                                                    {item.key}:
                                                </Text>
                                                <Radio.Group>
                                                    {item.values.map((v) => (
                                                        <Radio.Button
                                                            className="uppercase font-bold"
                                                            key={v}
                                                            value={v}
                                                            onClick={() =>
                                                                handleClickVariant({
                                                                    key: item.key,
                                                                    value: v,
                                                                })
                                                            }
                                                        >
                                                            {v}
                                                        </Radio.Button>
                                                    ))}
                                                </Radio.Group>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* hot deal */}
                    <div className="w-full h-auto bg-white rounded-lg shadow-sm border mt-5 overflow-y-auto">
                        <div className="mt-4 p-4">
                            <header>
                                <span className="font-bold">Dịch vụ bổ xung</span>
                            </header>
                            <ul className="mt-4 list-disc list-inside space-y-6">
                                {services.map((service, index) => (
                                    <li
                                        key={index}
                                        className="mt-2 flex items-start justify-between"
                                    >
                                        <div className="flex items-start">
                                            <img
                                                src={service.imgSrc}
                                                alt={service.altText}
                                                className="w-10 rounded-2xl h-10 mr-2"
                                            />
                                            <div className="">
                                                <span className="font-medium">{service.title}</span>
                                                <p className="text-sm text-gray-600">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={service.linkHref}
                                            className="text-blue-500 hover:underline self-center text-sm"
                                        >
                                            {service.linkText}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* info product */}
                    <div className="w-full h-auto bg-gray-50 rounded-lg shadow-lg border border-gray-200 mt-5 overflow-y-auto">
                        <div className="mt-4 px-4">
                            <header className="mb-4">
                                <span className="text-[16px] font-bold">Chi tiết về sản phẩm</span>
                            </header>
                            <ul className="divide-y divide-gray-200">
                                {productDetails.map((item, index) => (
                                    <li
                                        key={index}
                                        className="py-4 px-4 w-full bg-white flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                                    >
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="font-medium text-gray-800">
                                                {item.title}:
                                            </span>
                                            <p
                                                className="text-sm text-gray-600 mt-1 sm:mt-0"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.description,
                                                }}
                                            ></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* payment productDetail */}
                <div className="w-[35rem] p-3 ml-3 sticky top-0 h-full">
                    <div className="w-full h-auto bg-white rounded-lg">
                        <div className="p-6">
                            <div className="flex-1 p-2">
                                <div className="flex-1 p-4">
                                    <Text className="block text-xl font-semibold text-gray-800">
                                        Cửa hàng: {shop.name}
                                    </Text>
                                    <Text className="block text-lg text-gray-600">
                                        Số lượng còn lại:{' '}
                                        {matchedVariant()?.quantity ?? productQuantity}
                                    </Text>
                                    <Divider className="my-4" />

                                    <div className="mt-3">
                                        <div className="mr-2 font-medium text-lg text-gray-700">
                                            Số lượng:
                                        </div>
                                        <QuantitySelector
                                            initialQuantity={quantity}
                                            onChange={setQuantity}
                                        />
                                        <div className="mt-3 mr-2 font-medium text-lg text-gray-700">
                                            Tổng tiền:
                                        </div>
                                        <div className="font-semibold text-lg text-red-500">
                                            {formatPrice(totalPrice)}
                                        </div>
                                    </div>
                                    <div className="mt-5 flex space-x-4">
                                        <Button
                                            type="primary"
                                            onClick={handleAddToCart}
                                            className="bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                        <Button
                                            className="bg-red-500 hover:bg-red-600 text-white transition duration-300"
                                            type="primary"
                                        >
                                            Mua ngay
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* review */}
            <div className="w-[64.3rem] ml-7 -mt-8">
                <div className="bg-white rounded-lg">
                    <Comment product={product} />
                </div>
            </div>

            {/* Product gợi ý */}
            <div className="mb-10 py-10">
                {/* product */}
                <div className="relative w-[97%] ml-6 bg-white rounded-lg pt-10 ">
                    <div className="px-10">
                        <div className="flex flex-wrap gap-14 ml-1 px-10 pb-10">
                            {currentProducts.map((p) => (
                                <ProductCard key={p.id} product={p} type="any" />
                            ))}
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-[-5px] right-[-5px] flex justify-between px-4 transform -translate-y-1/2">
                        <button
                            onClick={() => handlePrev('products')}
                            disabled={currentPage === 0}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                            <FcPrevious className="text-xl" />
                        </button>
                        <button
                            onClick={() => handleNext('products')}
                            disabled={(currentPage + 1) * itemsPerPage >= products.length}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                            <FcNext className="text-xl" />
                        </button>
                    </div>
                </div>
                <div className="w-[97%] ml-6 bg-white rounded-lg mt-3">
                    <div className="p-5 px-6 ml-1">
                        <div className="pb-2 border-b border-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-lg text-gray-800">
                                    Sản phẩm yêu thích
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 p-4 rounded-lg">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} type="any" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
