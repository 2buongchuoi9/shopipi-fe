import { DefaultLayout } from '@/layouts'
import Login from '@/pages/auth/Login'
import { ProductDetail, ProductPage } from '@/pages/product'
import Redirect from '@/pages/auth/Redirect'
import { ComponentType, ReactNode } from 'react'
import { CartPage } from '@/pages/cart'
import { HomePage } from '@/pages/home'

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

    route('/product', ProductPage),
    route('/product/:slug', ProductDetail),

    route('/cart', CartPage),
]

export default publicRouters
