import { AdminLayout } from '@/layouts'
import Dashboard from '@/pages/dashboard/Dashboard'
import AllProduct from '@/pages/product/AllProduct'
import DetailProduct from '@/pages/product/DetailProduct'

import { ComponentType, ReactNode } from 'react'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path,
        component,
        layout: layout ?? AdminLayout,
    }
}

const privateRouters = [
    route('', Dashboard),
    route('/product/all', AllProduct),
    route('/', Dashboard),
    route('/product/add', () => DetailProduct({ isAdd: true })),
    route('/product/detail/:slug', () => DetailProduct({ isAdd: false })),
]

export default privateRouters
