export const adminPath = '/admin'
export const sellerPath = '/seller'
export const userPath = '/user'

export const dateFormat = 'DD-MM-YYYY HH:mm:ss'

export const REDIRECT_RESULT_ORDER = import.meta.env.VITE_URL + '/redirect-payment'

export enum UserRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    Shop = 'SHOP',
}

export const DiscountPriceType = {
    FIXED_AMOUNT: 'Số tiền',
    PERCENTAGE_AMOUNT: 'Phần trăm',
} as const

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

export const OrderPayment = {
    CASH: 'Thanh toán khi nhận hàng',
    MOMO: 'Thanh toán qua Momo',
    VN_PAY: 'Thanh toán qua VNPay',
}

export const OrderShipping = {
    FAST: { name: 'Giao hàng nhanh', price: 25000, time: '1-2 ngày' },
    NORMAL: { name: 'Giao hàng tiêu chuẩn', price: 20000, time: '3-5 ngày' },
    GHTK: { name: 'Giao hàng tiết kiệm', price: 15000, time: '3-5 ngày' },
    HT: { name: 'Giao hàng hỏa tốc', price: 45000, time: 'trong ngày' },
    NONE: { name: 'Test', price: 0, time: 'test' },
}

export const NotificationType = {
    NEW_LIKE: 'NEW_LIKE',
    NEW_PRODUCT: 'NEW_PRODUCT',
    NEW_ORDER: 'NEW_ORDER',
    NEW_SHOP: 'NEW_SHOP',
    NEW_USER: 'NEW_USER',
    NEW_COMMENT: 'NEW_COMMENT',
    NEW_REPLY: 'NEW_REPLY',
    NEW_FOLLOW: 'NEW_FOLLOW',
    NEW_MESSAGE: 'NEW_MESSAGE',
    NEW_RATING: 'NEW_RATING',
}
