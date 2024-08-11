import { count } from 'console'
import http, { Page, ParamsRequest } from './http'
import { Variant } from './productApi'
import { User } from './authApi'

type root = {
    productId: string
    parentId: string | null
    comment: string
}

type rating = root & {
    isComment: false

    images: string[]
    value: number
    variantId: string | null
}

type comment = root & {
    isComment: true
}

export type RatingRequest = rating | comment

export type Rating = RatingRequest & {
    id: string
    shopId: string
    value: number
    user: User
    likes: string[]
    images: string[]
    variantId: string | null
    createdAt: string
    updatedAt: string

    replies?: Rating[]
    variant?: Variant
}

export const buildRatingTree = (ratings: Rating[], parentId: string | null): Rating[] => {
    const filteredRatings = ratings.filter((rating) => rating.parentId === parentId)

    const tree = filteredRatings.map((Rating) => {
        const replies = buildRatingTree(ratings, Rating.id)
        return replies.length > 0 ? { ...Rating, replies } : { ...Rating }
    })
    return tree
}

// params: {
// "productId": "string",
// "parentId": "string",
// "content": "string"
//  isComment;
//  value;
//  hasIMage;
// }
const ratingApi = {
    get: async (params: ParamsRequest) => await http.get<Page<Rating>>('/rating', { params }),

    addRating: async (data: RatingRequest) => await http.post<Rating>('/rating', data),

    like: async (id: string) => await http.post<Rating>(`/rating/like/${id}`),

    addRatingWithFile: async (data: FormData) =>
        await http.post<User>(`/rating/file`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    countRatingByShop: async (shopId: string) =>
        await http.get<number>(`/rating/countRating/shop/${shopId}`),
}

export default ratingApi
