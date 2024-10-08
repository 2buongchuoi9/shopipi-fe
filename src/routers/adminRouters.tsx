import { AdminLayout } from '@/layouts'
import AllProduct from '@/pages/admin/AllProduct'
import { AllCategory, DetailCategory } from '@/pages/admin/category'
import { AllCustomer } from '@/pages/admin/customer'
import { AllShop } from '@/pages/admin/shop'
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

const adminRouters = [
    route('/product', AllProduct),

    route('/category/all', AllCategory),
    route('/category/add', () => DetailCategory({ isAdd: true })),
    route('/category/detail/:slug', () => DetailCategory({ isAdd: false })),

    route('/shop', AllShop),

    route('/customer', AllCustomer),
    // route('/product/detail/:slug', () => DetailProduct({ isAdd: false })),
    // route('/discount/all', AllDiscount),
    // route('/discount/add', () => DetailDiscount({ isAdd: true })),
    // route('/discount/detail/:id', () => DetailDiscount({ isAdd: false })),
    // route('/order/all', AllOrder),
    // route('/order/detail/:id', DetailOrder),
]

export default adminRouters
