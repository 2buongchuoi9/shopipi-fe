import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/hooks'
import { Product } from '@/http'
import cartApi from '@/http/cartApi'
import productApi from '@/http/productApi'
import { ProductState } from '@/utils/constants'
import { useEffect, useState } from 'react'

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const { user } = useAuth()
    console.log('user', user)

    useEffect(() => {
        ;(async () => {
            const data = await productApi.getAll({ state: 'ACTIVE' })

            const products = data.content.map((p) => {
                let totalPrice = 0
                let totalPriceSale = 0
                let countPrice = 0
                let countPriceSale = 0

                p.variants.forEach((v) => {
                    if (v.price > 0) {
                        totalPrice += v.price
                        countPrice++
                    }
                    if (v.priceSale > 0) {
                        totalPriceSale += v.priceSale
                        countPriceSale++
                    }
                })

                const price = countPrice > 0 ? totalPrice / countPrice : 0
                const priceSale = countPriceSale > 0 ? totalPriceSale / countPriceSale : 0

                return {
                    ...p,
                    price,
                    priceSale,
                    discount:
                        p.sale?.type === 'FIXED_AMOUNT' ? p.sale?.value.vnd() : p.sale?.value + '%',
                }
            })

            setProducts(products)
            console.log('products', products)
        })()
    }, [])

    return (
        <div className="grid grid-cols-4">
            {products.map((p) => (
                <div key={p.id}>
                    <ProductCard product={p} />
                </div>
            ))}
        </div>
    )
}
export default ProductPage
