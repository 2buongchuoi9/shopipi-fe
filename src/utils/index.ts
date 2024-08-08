import { Category, ParamsRequest } from '@/http'
import { ChatGroup } from '@/http/chatApi'
import { Order } from '@/http/OrderApi'
import { ChatPayload } from '@/socketService'
import { saveAs } from 'file-saver'
import moment from 'moment'
import * as XLSX from 'xlsx'
import { dateFormat } from './constants'

const routeRedirect = `${window.location.origin}/login-redirect`
const apiUrl = import.meta.env.VITE_API_URL
export const google_url_login = `${apiUrl}/api/v1/oauth2/authorization/google?redirect_url=${routeRedirect}`
export const facebook_url_login = `${apiUrl}/api/v1/oauth2/authorization/facebook?redirect_url=${routeRedirect}`

export const removeNullParams = (params?: ParamsRequest) => {
    if (!params) return {}
    return Object.fromEntries(Object.entries(params).filter(([_, value]) => !value))
}

export const convertVietNameseToSlug = (title: string) => {
    if (!title) return ''
    var slug = title.toLowerCase()

    var map: Record<string, string> = {
        'á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ': 'a',
        'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ': 'e',
        'i|í|ì|ỉ|ĩ|ị': 'i',
        'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ': 'o',
        'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự': 'u',
        'ý|ỳ|ỷ|ỹ|ỵ': 'y',
        đ: 'd',
        '\\`|\\~|\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\(|\\)|\\+|\\=|\\,|\\.|\\/|\\?|\\>|\\<|\\\'|\\"|\\:|\\;|\\_':
            '',
        ' ': '-',
    }

    for (var pattern in map) {
        slug = slug.replace(new RegExp(pattern, 'g'), map[pattern])
    }

    // slug = slug.replace(/-+-/g, "-") // replace 2- to 1-
    // slug = slug.replace(/^\-+|\-+$/g, "") // remove - at the start and end

    slug = slug.replace(/-+/g, '-') // replace multiple dashes with a single dash
    slug = slug.replace(/^-+|-+$/g, '') // remove dashes at the start and end

    return slug
}
export const randomPriceDiscount = (price: number | undefined, valueDifference: number): number => {
    if (!price) return 0
    // Tính toán một giá trị giảm giá ngẫu nhiên từ 0 đến valueDifference
    const discount = Math.random() * valueDifference * 1000
    // Trừ giá trị giảm giá từ giá gốc
    const discountedPrice = price - discount
    // Làm tròn giá sau giảm giá về 3 chữ số trước dấu phẩy
    return Math.floor(discountedPrice / 1000) * 1000
}

export const randomGradient = () => {
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    const color1 = getRandomColor()
    const color2 = getRandomColor()
    return `linear-gradient(45deg, ${color1}, ${color2})`
}

export function groupChatsBySender(chats: ChatPayload[]): ChatGroup[] {
    if (chats.length === 0) return []

    const groupedChats: ChatGroup[] = []
    let currentGroup: ChatGroup | null = null

    for (const chat of chats) {
        if (currentGroup === null || currentGroup.senderId !== chat.senderId) {
            // Start a new group if sender changes
            currentGroup = {
                senderId: chat.senderId,
                chats: [chat],
                createdAt: chat.createdAt,
            }
            groupedChats.push(currentGroup)
        } else {
            // Add chat to the current group
            currentGroup.chats.push(chat)
        }
    }

    return groupedChats
}

export function findCategoryTree(categories: Category[], ids: String[]): Category[] {
    const result: Category[] = []

    function traverse(categories: Category[], ids: String[]): Category[] {
        for (const category of categories) {
            if (ids.includes(category.id)) {
                result.push(category)
            } else if (category.children && category.children.length > 0) {
                const children = traverse(category.children, ids)
                if (children.length > 0) {
                    result.push({
                        ...category,
                        children,
                    })
                }
            }
        }
        return result
    }

    return traverse(categories, ids)
}

export function findCategoryBySlug(categories: Category[], slug: String): Category | undefined {
    for (const category of categories) {
        if (category.slug === slug) {
            return category
        } else if (category.children && category.children.length > 0) {
            const found = findCategoryBySlug(category.children, slug)
            if (found) return found
        }
    }
    return undefined
}

export const exportToExcel = (orders: Order[]) => {
    const exportData = orders.flatMap((order) => {
        const recipientAddress = order.user.address
            ? order.user.address.find((addr) => addr.isDefault)
            : ''

        return order.items.flatMap((item) => {
            return item.items.map((productItem) => ({
                'Mã hóa đơn': order.id,
                'Ngày đặt': order.createdAt,
                'Tình trạng đơn hàng': order.state,
                'Đơn vị vận chuyển': order.shippingType,
                'Phương thức thanh toán/Trạng thái thanh toán': order.payment,
                'Tên sản phẩm': productItem.product.name,
                'Tên biến thể của sản phẩm': productItem.variant.valueVariant
                    .map((v) => v.value)
                    .join(', '),
                'Số lượng mua của sản phẩm': productItem.quantity,
                'Giá gốc của biến thể': productItem.variant.price,
                'Số tiền giảm giá': productItem.product.sale
                    ? productItem.product.sale.type === 'PERCENTAGE_AMOUNT'
                        ? productItem.product.sale.value
                        : `${productItem.product.sale.value} %`
                    : 0,
                'Số tiền áp dụng voucher': item.totalDiscount,
                'Tổng giá trị đơn hàng': order.totalOrder,
                'Tên người nhận': recipientAddress ? recipientAddress.name : order.user.name,
                'Số điện thoại': recipientAddress ? recipientAddress.phone : order.user.phone,
                'Địa chỉ': recipientAddress
                    ? `${recipientAddress.address}, ${recipientAddress.district}, ${recipientAddress.province}`
                    : '',
                'Email người nhận': order.user.email,
            }))
        })
    })

    // Chuyển đổi dữ liệu thành sheet
    const ws = XLSX.utils.json_to_sheet(exportData, {
        header: [
            'Mã hóa đơn',
            'Ngày đặt',
            'Tình trạng đơn hàng',
            'Đơn vị vận chuyển',
            'Phương thức thanh toán/Trạng thái thanh toán',
            'Tên sản phẩm',
            'Tên biến thể của sản phẩm',
            'Số lượng mua của sản phẩm',
            'Giá gốc của biến thể',
            'Số tiền giảm giá',
            'Số tiền áp dụng voucher',
            'Tổng giá trị đơn hàng',
            'Tên người nhận',
            'Số điện thoại',
            'Địa chỉ',
            'Email người nhận',
        ],
    })

    // Tính chiều rộng của các cột để tự động điều chỉnh
    const colWidths = Object.keys(ws).reduce((acc, key) => {
        const cell = ws[key]
        if (cell && cell.v) {
            const length = cell.v ? cell.v.toString().length : 0
            const colIndex = XLSX.utils.decode_cell(key).c
            acc[colIndex] = Math.max(acc[colIndex] || 10, length)
        }
        return acc
    }, {} as { [key: number]: number })

    ws['!cols'] = Object.keys(colWidths).map((colIndex) => ({
        wpx: colWidths[Number(colIndex)] * 7,
    }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' })

    const shop = orders[0].items[0].items[0].product.shop.name

    saveAs(dataBlob, `Orders_${shop}_${moment().format('DD-MM-YYYY')}.xlsx`)
}
