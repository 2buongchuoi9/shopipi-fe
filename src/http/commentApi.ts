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
import axios from 'axios';

const commentApi = {
    updateComment: (commentId: string, data: { content: string }) => {
        return axios.post(`/api/comments/${commentId}`, data);
    },
    deleteComment: (commentId: string) => {
        return axios.delete(`/api/comments/${commentId}`);
    },
};

export default commentApi;
