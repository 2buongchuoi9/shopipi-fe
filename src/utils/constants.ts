export const adminPath = '/admin'

export enum UserRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    Shop = 'Shop',
}

export const DiscountPriceType = {
    FIXED_AMOUNT: 'Số tiền',
    PERCENTAGE_AMOUNT: 'Phần trăm',
} as const

export const dateFormat = 'DD-MM-YYYY HH:mm:ss'

export const DiscountState = {
    ACTIVE: 'Đang diễn ra',
    NOT_YET_ACTIVE: 'Sắp diễn ra',
    EXPIRED: 'Đã kết thúc',
} as const

export const ProductState = {
    PENDING: 'Chờ duyệt bởi Shopipi',
    ACTIVE: 'đang hoạt động',
    HIDDEN: 'Chưa được đăng',
    DELETED: 'Đã xóa bởi Shopipi',
} as const

export const OrderState = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Chờ lấy hàng',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đơn hủy',
}
