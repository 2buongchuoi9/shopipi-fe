import { useAuth, useMessage } from '@/hooks'
import commentApi, { Comment } from '@/http/commentApi'
import ratingApi, { Rating } from '@/http/ratingApi'
import { Avatar, Button, Tooltip, theme } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { HTMLAttributes, useState } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
    productId: string
    comment?: Rating | null
    handleReload: () => void
}

const InputComment = ({ productId, comment = null, handleReload, ...rest }: Props) => {
    const { user, isAuthenticated } = useAuth()
    const [value, setValue] = useState('')
    const { success, error } = useMessage()
    const { token } = theme.useToken()

    const handleComment = async () => {
        if (!isAuthenticated) {
            error('Đăng nhập để bình luận')
            return
        }

        console.log('productId', productId)
        console.log('comment', comment)

        try {
            const res = await ratingApi.addRating({
                isComment: true,
                productId,
                parentId: comment?.id || null,
                comment: value,
            })
            console.log('res', res)
            handleReload()
            success('Add Comment success')
        } catch (err) {
            console.log(err)
            error('Add Comment fail')
        }
    }

    return (
        <div {...rest}>
            <div className="space-y-4 pb-2">
                <TextArea
                    className=" border-l-red-500 border-l-2 hover:border-l-red-500 hover:border-l-2 focus:border-l-red-500 focus:border-l-2 "
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Chia sẻ ý kiến của bạn"
                    rows={2}
                ></TextArea>
                <div className="flex justify-end items-center space-x-4">
                    {isAuthenticated && (
                        <div className="flex space-x-2 items-center">
                            <Avatar src={user?.image}></Avatar>
                            <span className="text-base font-normal">{user?.name}</span>
                        </div>
                    )}
                    <Tooltip title={!value.trim() ? 'comment is require' : null}>
                        <Button
                            onClick={handleComment}
                            type="primary"
                            style={{ backgroundColor: token.colorPrimaryHover }}
                            disabled={!value.trim()}
                        >
                            Send
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default InputComment
