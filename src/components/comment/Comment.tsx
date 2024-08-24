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

    // const fetchComment = async () => {
    //     const res = await ratingApi.get({ productId })
    //     // console.log('Comment:', res)

    //     const ratings = res.content.map((r) => ({
    //         ...r,
    //         variant: product.variants.find((v) => v.id === r.variantId),
    //     }))

    //     const ratingsCount = ratings.reduce((acc, rating) => {
    //         acc[rating.value] = (acc[rating.value] || 0) + 1
    //         return acc
    //     }, {} as Record<number, number>)
    //     setRatingsCount(ratingsCount)

    //     setCountComments(res.totalElement)
    //     setComments(buildRatingTree(ratings, null))
    // }
    const fetchComment = async () => {
        const res = await ratingApi.get({ productId });
        console.log('Fetched comments response:', res);  // Kiểm tra dữ liệu nhận được từ API
    
        const ratings = res.content.map((r) => ({
            ...r,
            variant: product.variants.find((v) => v.id === r.variantId),
        }));
    
        const ratingsCount = ratings.reduce((acc, rating) => {
            acc[rating.value] = (acc[rating.value] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
        setRatingsCount(ratingsCount);
    
        setCountComments(res.totalElement);
        setComments(buildRatingTree(ratings, null));
        console.log('Updated comments state:', ratings);  // Kiểm tra state sau khi cập nhật
    }
    

    useEffect(() => {
        ;(async () => {
            await fetchComment()
        })()
    }, [productId])

    const handleReload = async () => {
        console.log('handleReload called');  // Kiểm tra khi hàm này được gọi
        await fetchComment();
        console.log('Comments state after reload:', comments);  // Kiểm tra state của comments sau khi reload
    }
    

    return (
        <div className="mt-5 p-10 bg-white border border-gray-200 rounded-lg">
            <header className="mb-2">
                <h2 className="text-[16px] font-semibold text-gray-800">Đánh giá sản phẩm</h2>
            </header>
            <div className="text-gray-700 font-medium text-[14px] mb-2">
                Bình luận ({countComments})
            </div>

            <div className="p-3 border border-gray-200 rounded-lg w-full max-w-md mx-auto bg-white shadow-sm">
                <h3 className="text-md font-medium text-gray-800 mb-2">Khách hàng đánh giá</h3>
                <div className="flex items-center mb-1">
                    <div className="text-sm font-bold text-blue-600 mr-1">
                        {ratingAvg.toFixed(2)}
                    </div>
                    <Rate allowHalf disabled value={ratingAvg} className="text-xs" />
                </div>
                <div className="text-gray-500 text-sm mb-2">({totalRating} đánh giá)</div>
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center mb-1">
                        <Rate disabled value={star} className="text-xs" />
                        <div className="w-20 h-1 bg-gray-300 mx-1 rounded">
                            <div
                                className="h-1 bg-blue-500 rounded"
                                style={{
                                    width: `${(ratingsCount[star] / totalRating) * 100 || 0}%`,
                                }}
                            ></div>
                        </div>
                        <div className="w-3 text-right text-gray-700 text-xs">
                            {ratingsCount[star] || 0}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3">
                {comments &&
                    comments.map((comment, index) => (
                        <ItemComment key={index} comment={comment} handleReload={handleReload} />
                    ))}
            </div>
            <InputComment productId={productId} handleReload={handleReload} className="mt-3" />
        </div>
    )
    
}
export default Comment
