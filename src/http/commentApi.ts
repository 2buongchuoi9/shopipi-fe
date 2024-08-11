import { User } from './authApi'
import http, { Page, ParamsRequest } from './http'
import { Variant } from './productApi'

export type CommentRequest = {
    productId: string
    parentId: string | null
    content: string
}

export type Comment = CommentRequest & {
    id: string
    shopId: string
    user: User
    left: number
    right: number
    likes: string[]
    createdAt: string
    updatedAt: string
    replies?: Comment[]
    variant?: Variant
}

// export const buildCommentTree = (comments: Comment[], parentId: string | null): Comment[] => {
//     const filteredComments = comments.filter((comment) => comment.parentId === parentId)

//     const tree = filteredComments.map((comment) => {
//         const replies = buildCommentTree(comments, comment.id)
//         return replies.length > 0 ? { ...comment, replies } : { ...comment }
//     })
//     return tree
// }

// params: {
// "productId": "string",
// "parentId": "string",
// "content": "string"
// }
const commentApi = {
    get: async (params: ParamsRequest) => await http.get<Page<Comment>>('/comment', { params }),

    addComment: async (data: CommentRequest) => await http.post<Comment>('/comment', data),
}

export default commentApi
