import { DefaultLayout } from '@/layouts'
import { ProductDetail, ProductPage } from '@/pages/main/product'
import { ComponentType, ReactNode } from 'react'
import { CartPage } from '@/pages/main/cart'
import { HomePage } from '@/pages/main/home'
import { OrderPage } from '@/pages/main/order'
import { Login, Redirect, Register } from '@/pages/main/auth'
import { ShopPage } from '@/pages/main/shop'
import { CategoryPage } from '@/pages/main/category'
import RedirectPayment from '@/pages/main/auth/RedirectPayment'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path,
        component,
        layout: layout ?? DefaultLayout,
    }
}

const publicRouters = [
    route('/', HomePage),
    route('/login-redirect', Redirect),
    route('/login', Login),
    route('/register', Register),

    route('/redirect-payment', RedirectPayment),

    route('/product', ProductPage),
    route('/product/:slug', ProductDetail),

    route('/cart', CartPage),
    route('/order', OrderPage),

    route('/shop/:slug', ShopPage),

    route('/:slug', CategoryPage),
]

export default publicRouters
