import { Product } from '@/http'
import ratingApi, { buildRatingTree, Rating } from '@/http/ratingApi'
import { Rate } from 'antd'
import { useEffect, useState } from 'react'
import InputComment from './InputComment'
import ItemComment from './ItemComment'

type Props = {
    product: Product
}

const Comment = ({ product }: Props) => {
    const [comments, setComments] = useState<Rating[]>([])
    const [countComments, setCountComments] = useState(0)
    const [ratingsCount, setRatingsCount] = useState<Record<number, number>>({})
    const { id: productId, totalRating, ratingAvg } = product

    const fetchComment = async () => {
        const res = await ratingApi.get({ productId })
        console.log('Comment:', res)

        const ratings = res.content.map((r) => ({
            ...r,
            variant: product.variants.find((v) => v.id === r.variantId),
        }))

        const ratingsCount = ratings.reduce((acc, rating) => {
            acc[rating.value] = (acc[rating.value] || 0) + 1
            return acc
        }, {} as Record<number, number>)
        setRatingsCount(ratingsCount)

        setCountComments(res.totalElement)
        setComments(buildRatingTree(ratings, null))
    }

    useEffect(() => {
        ;(async () => {
            await fetchComment()
        })()
    }, [productId])

    const handleReload = async () => {
        await fetchComment()
    }

    return (
        <div className="mt-5 p-6 bg-white rounded-lg">
            <header className="mb-4">
                <h2 className="text-[17px] font-bold">Đánh giá sản phẩm</h2>
            </header>
            <div className="text-black font-bold text-[15px] mb-4">
                Bài đánh giá ({countComments})
            </div>

            <div className="p-6 border rounded-lg w-full max-w-2xl mx-auto bg-white">
                <h3 className="text-xl font-semibold mb-4">Khách hàng đánh giá</h3>
                <div className="flex items-center mb-4">
                    <div className="text-2xl font-bold mr-2">{ratingAvg}</div>
                    <Rate allowHalf disabled value={ratingAvg} />
                </div>
                <div className="text-gray-600 mb-4">({totalRating} đánh giá)</div>
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center mb-2">
                        <Rate disabled value={star} className="text-sm" />
                        <div className="w-40 h-2 bg-gray-300 mx-2 rounded">
                            <div
                                className="h-2 bg-blue-500 rounded"
                                style={{
                                    width: `${(ratingsCount[star] / totalRating) * 100 || 0}%`,
                                }}
                            ></div>
                        </div>
                        <div className="w-6 text-right">{ratingsCount[star] || 0}</div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                {comments &&
                    comments.map((comment, index) => (
                        <ItemComment key={index} comment={comment} handleReload={handleReload} />
                    ))}
            </div>
            <InputComment productId={productId} handleReload={handleReload} className="mt-6" />
        </div>
    )
}
export default Comment
