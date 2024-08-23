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
