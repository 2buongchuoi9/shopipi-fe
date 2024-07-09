import { AdminLayout } from '@/layouts'
import { Dashboard } from '@/pages/admin/dashboard'
import { AllDiscount, DetailDiscount } from '@/pages/admin/discount'
import { AllOrder, DetailOrder } from '@/pages/admin/order'
import { AllProduct, DetailProduct } from '@/pages/admin/product'
import { adminPath } from '@/utils/constants'

import { ComponentType, ReactNode } from 'react'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path: adminPath + path,
        component,
        layout: layout ?? AdminLayout,
    }
}

const privateRouters = [
    route('', Dashboard),
    route('/', Dashboard),

    route('/product/all', AllProduct),
    route('/product/add', () => DetailProduct({ isAdd: true })),
    route('/product/detail/:slug', () => DetailProduct({ isAdd: false })),

    route('/discount/all', AllDiscount),
    route('/discount/add', () => DetailDiscount({ isAdd: true })),
    route('/discount/detail/:id', () => DetailDiscount({ isAdd: false })),

    route('/order/all', AllOrder),
    route('/order/detail/:id', DetailOrder),
]

export default privateRouters
