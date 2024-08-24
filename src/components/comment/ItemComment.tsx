import { Avatar, Badge, Rate, Tooltip } from 'antd'
import { useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLike } from 'react-icons/ai'
import { LuReply } from 'react-icons/lu'

import { useAuth, useMessage } from '@/hooks'
import InputComment from './InputComment'
import TimeComment from '../TimeCount'
import ratingApi, { Rating } from '@/http/ratingApi'
import commentApi from '@/http/commentApi';  // Đường dẫn này có thể thay đổi tùy thuộc vào cấu trúc dự án của bạn

type Props = {
    comment: Rating
    handleReload: () => void
}

const ItemComment = ({ comment, handleReload }: Props) => {
    const { user, isAuthenticated } = useAuth()
    const { success, error } = useMessage()
    const [showReply, setShowReply] = useState(false)
    const [showInputComment, setShowInputComment] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.comment)

    const { createdAt, variant } = comment

    const handleLikeComment = async () => {
        if (!isAuthenticated) {
            error('vui lòng đăng nhập để thích bình luận')
            return
        }
        try {
            const res = await ratingApi.like(comment.id)
            handleReload()
            console.log('res', res)
        } catch (err) {
            console.log('error', err)
            error('Like comment fail')
        }
    }

    const handleEditComment = async () => {
        try {
            await commentApi.updateComment(comment.id, { content: editContent });
            success('Comment updated successfully');
            setIsEditing(false);
            handleReload();
        } catch (err) {
            error('Failed to update comment');
            console.log(err);
        }
    };
    
    const handleDelete = async (commentId: string) => {
        console.log('Attempting to delete comment with ID:', commentId);
        try {
            const response = await commentApi.deleteComment(commentId);
            console.log('Delete response:', response.data);
            if (response.data) {
                // Gọi hàm reload để cập nhật lại danh sách bình luận sau khi xóa thành công
                await handleReload();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    
    

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
                            {isEditing ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                <span className="text-[#4f4f4f]">{comment.comment}</span>
                            )}
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
                                {isAuthenticated && comment.user?.id === user?.id && (
                                    <div className="flex space-x-2 mt-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleEditComment} className="text-blue-500">Save</button>
                                                <button onClick={() => setIsEditing(false)} className="text-red-500">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setIsEditing(true)} className="text-blue-500">Edit</button>
                                                <button onClick={() => handleDelete(comment?.id)} className="text-red-500">Delete</button>

                                            </>
                                        )}
                                    </div>
                                )}
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
