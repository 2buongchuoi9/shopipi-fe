import http, { Page, ParamsRequest } from './http'

export type File = {
    id: string
    url: string
    publicId: string
    description: string
    size: number
    extension: string
    mimeType: string
    type: MediaType
    createdAt: string
    createdBy: any
}
export const mediaType = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    FILE: 'FILE',
    ALL: 'ALL',
} as const
export type MediaType = (typeof mediaType)[keyof typeof mediaType]

const fileApi = {
    uploadImage: async (file: FormData) =>
        await http.post<File>('/file/upload-image', file, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    uploadVideo: async (file: FormData) =>
        await http.post<File>('/file/upload-video', file, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    get: async (params?: ParamsRequest) => await http.get<Page<File>>(`/file`, { params }),
    // getDetail: (id: string) => {},

    update: async (id: string, data: Partial<File>) => await http.post<File>(`/file/${id}`, data),

    delete: async (id: string) => await http.delete(`/file/${id}`),
}

export default fileApi
