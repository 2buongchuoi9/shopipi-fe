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
            setProducts(data.content)
            const res = await cartApi.getCart()
            console.log('cart', res)
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
