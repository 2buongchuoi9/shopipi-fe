import { SellerLayout } from '@/layouts'
import { Dashboard } from '@/pages/seller/dashboard'
import { AllDiscount, DetailDiscount } from '@/pages/seller/discount'
import { AddInventory, AllInventory, StatisticInventory } from '@/pages/seller/inventory'
import { AllOrder, DetailOrder } from '@/pages/seller/order'
import { AllProduct, DetailProduct } from '@/pages/seller/product'
import { AllSale, DetailSale } from '@/pages/seller/sale'

import { sellerPath } from '@/utils/constants'

import { ComponentType, ReactNode } from 'react'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path: sellerPath + path,
        component,
        layout: layout ?? SellerLayout,
    }
}

const SellerRouters = [
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

    route('/inventory/statistic', StatisticInventory),
    route('/inventory/all', AllInventory),
    route('/inventory/add', AddInventory),

    route('/sale/all', AllSale),
    route('/sale/detail/:id', () => DetailSale({ isAdd: false })),
    route('/sale/add', () => DetailSale({ isAdd: true })),
]

export default SellerRouters
