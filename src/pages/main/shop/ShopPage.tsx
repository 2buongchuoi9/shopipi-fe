import TimeCount from '@/components/TimeCount'
import { Product } from '@/http'
import productApi from '@/http/productApi'
import ratingApi from '@/http/ratingApi'
import shopApi, { Online, Shop } from '@/http/shopApi'
import ErrorPage from '@/pages/ErrorPage'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

type ShopPageProps = {
    ratting: number
    // category
}

const ShopPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const [shop, setShop] = useState<(Shop & Online) | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [avgRating, setAvgRating] = useState<number>(0)
    const [totalRatingCount, setTotalRatingCount] = useState<number>(0)

    useEffect(() => {
        if (slug) {
            ;(async () => {
                const res = await shopApi.findShopBySlug(slug)

                const ol = await shopApi.online(res.id)

                console.log('online', ol)

                setShop({ ...res, ...ol })
                console.log('shop', res)

                const res3 = await productApi.getAll({ shopId: res.id, size: 1000 })

                // tính toán những thông số chung của shop
                // tính tổng rating
                // tính tổng số lượng sản phẩm
                // tính tổng số lượng bình luận
                // tính tổng số lượng người theo dõi
                // tính tổng số sản phẩm bán được
                // lấy ra tất cả danh mục sản phẩm của shop

                let avgRating = 0
                let totalRating = 0

                res3.content.forEach((product) => {
                    // tính tổng số lượng sản phẩm
                    avgRating += product.ratingAvg
                    totalRating += product.totalRating
                })

                setAvgRating(avgRating / totalRating)
                setTotalRatingCount(totalRating)

                setProducts(res3.content)
                console.log('products', res3)
            })()
        }
    }, [slug])

    if (!slug) {
        return <ErrorPage subTitle="Không tim thấy shop" />
    }

    return (
        <>
            {!shop ? (
                <div>đang tải</div>
            ) : (
                <div>
                    {/* header */}
                    <div className="p-4 w-full flex">
                        <div className="p-2 bg-[#88c1f3] w-1/3">
                            <div className="flex">
                                <img
                                    src={shop.image ?? ''}
                                    alt=""
                                    className="w-24 h-24 rounded-full"
                                />
                                <div className="">
                                    <p className="text-xl">{shop.name}</p>
                                    <p className="text-gray-500 text-sm">
                                        {shop.isOnline ? (
                                            'Đang online'
                                        ) : (
                                            <TimeCount createdAt={shop.time} />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/3 grid grid-cols-2">
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Sản phẩm:
                                    <span className="text-red-700">{products.length}</span>
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Người theo dõi: {shop.followers.length}
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Đang theo dõi: {shop.followers.length}
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Đánh giá:
                                    {`${avgRating.toFixed(1)} (${totalRatingCount} đánh giá)`}
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Tỉ lệ phản hồi:
                                    {Math.floor(Math.random() * 51) + 50}%
                                </Button>
                            </div>
                            <div className="flex justify-start">
                                <Button type="link" icon={<FaUser />} className="text-black">
                                    Tham gia: {shop.createdAt}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default ShopPage
