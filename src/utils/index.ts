import { ParamsRequest } from '@/http'

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
export const randomPriceDiscount = (price: number, valueDifference: number): number => {
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
