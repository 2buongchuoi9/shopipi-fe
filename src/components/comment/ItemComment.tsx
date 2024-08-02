import { Avatar, Badge, Rate, Tooltip } from 'antd'

import { useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLike } from 'react-icons/ai'
import { LuReply } from 'react-icons/lu'

import { useAuth, useMessage } from '@/hooks'
import InputComment from './InputComment'
import TimeComment from '../TimeCount'
import ratingApi, { Rating } from '@/http/ratingApi'

type Props = {
    comment: Rating
    handleReload: () => void
}

const ItemComment = ({ comment, handleReload }: Props) => {
    const { user, isAuthenticated } = useAuth()
    const { success, error } = useMessage()
    const [showReply, setShowReply] = useState(false)
    const [showInputComment, setShowInputComment] = useState(false)

    const { createdAt, variant } = comment

    // console.log('comment', comment)

    const handleLikeComment = async () => {
        if (!isAuthenticated) {
            error('vui lòng đăng nhập để thích bình luận')
            return
        }
        // console.log('comment', comment)
        // console.log('user', user)
        try {
            const res = await ratingApi.like(comment.id)
            handleReload()
            console.log('res', res)
        } catch (err) {
            console.log('error', err)
            error('Like comment fail')
        }
    }

    return (
        <div>
            <div className="">
                <div className="flex space-x-3">
                    <div className="flex">
                        <Avatar src={comment.user?.image}></Avatar>
                    </div>
                    <div className="flex-1">
                        <div className="">
                            <p className="text-black font-medium mr-3">{comment?.user?.name}</p>
                            {comment.isComment ? (
                                <div className="flex items-center text-red-500">
                                    <AiOutlineCloseCircle className="mr-2" />
                                    <span>Chưa mua hàng</span>
                                </div>
                            ) : (
                                <>
                                    <Rate value={comment.value} disabled className="" />
                                    <div className="flex items-center text-green-500">
                                        <AiOutlineCheckCircle className="mr-2" />
                                        <span>Đã mua hàng</span>
                                    </div>
                                    <p className="">
                                        <TimeComment createdAt={comment?.createdAt} />{' '}
                                        {`| Phân loại hàng: ${variant?.valueVariant
                                            .map((v) => v.value)
                                            .join('+')}`}
                                    </p>
                                </>
                            )}
                        </div>
                        {/* content comment */}
                        <div className="">
                            <span className="text-[#4f4f4f]">{comment.comment}</span>
                        </div>
                        {/* images if has */}
                        <div className="flex">
                            {comment.images &&
                                comment.images.map((v: any, index: number) => (
                                    <img
                                        key={index}
                                        src={v}
                                        alt="comment"
                                        className="w-14 h-14 object-cover"
                                    />
                                ))}
                        </div>
                        {/* icon like... */}
                        <div className="flex items-center justify-between py-2 text-[#4f4f4f] text-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1 group">
                                    {comment &&
                                    comment?.likes &&
                                    comment?.likes.length > 0 &&
                                    comment.likes.includes(user.id) ? (
                                        <Badge
                                            size="small"
                                            count={comment?.likes.length}
                                            className="flex"
                                        >
                                            <AiOutlineLike />
                                            <span
                                                onClick={handleLikeComment}
                                                className="text-red-500 hover:cursor-pointer"
                                            >
                                                Liked
                                            </span>
                                        </Badge>
                                    ) : (
                                        <Badge
                                            size="small"
                                            count={comment?.likes.length}
                                            className="flex"
                                        >
                                            <AiOutlineLike />
                                            <span
                                                onClick={handleLikeComment}
                                                className="group-hover:text-blue-400 group-hover:cursor-pointer"
                                            >
                                                Like
                                            </span>
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 group">
                                    <span className="rounded-full bg-[#fae4ea] p-1">
                                        <img
                                            src="https://res.cloudinary.com/anhdaden/image/upload/v1711353116/vncafe/tixxb5wndomaobc0gkyr.png"
                                            alt=""
                                        />
                                    </span>
                                    <span className="group-hover:text-red-600 group-hover:cursor-pointer">
                                        {comment?.likes.length}
                                    </span>
                                </div>
                                {/* show input comment */}
                                <div
                                    onClick={() => setShowInputComment(!showInputComment)}
                                    className="hover:text-red-600 hover:cursor-pointer"
                                >
                                    trả lời
                                </div>
                            </div>
                            <div>
                                <TimeComment createdAt={comment?.createdAt} />
                            </div>
                        </div>
                        {/* show replies if exist */}
                        <div className="border-l-[2px] pl-2">
                            {showInputComment && (
                                <InputComment
                                    productId={comment.productId}
                                    comment={comment}
                                    handleReload={handleReload}
                                />
                            )}
                            {comment && comment?.replies && comment?.replies.length > 0 && (
                                <>
                                    {showReply && (
                                        <div className=" space-x-1 ">
                                            {comment?.replies.map((v: any, index: number) => (
                                                <ItemComment
                                                    key={index}
                                                    comment={v}
                                                    handleReload={handleReload}
                                                ></ItemComment>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {comment &&
                        comment?.replies &&
                        comment?.replies.length > 0 &&
                        !showReply ? (
                            <span className="flex space-x-1 items-center hover:cursor-pointer">
                                <div className="transform rotate-180">
                                    <LuReply color="gray"></LuReply>
                                </div>
                                <span
                                    onClick={() => setShowReply(true)}
                                    className="pb-2 hover:text-red-500"
                                >
                                    {comment?.replies.length} reply
                                </span>
                            </span>
                        ) : comment &&
                          comment?.replies &&
                          comment?.replies.length > 0 &&
                          showReply ? (
                            <span className="flex space-x-1 items-center hover:cursor-pointer">
                                <div className="">
                                    <LuReply color="gray"></LuReply>
                                </div>
                                <span
                                    onClick={() => setShowReply(false)}
                                    className="pb-2 hover:text-red-500"
                                >
                                    Hide {comment?.replies.length} reply
                                </span>
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemComment
