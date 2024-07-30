import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/hooks'
import { Product } from '@/http'
import cartApi from '@/http/cartApi'
import productApi from '@/http/productApi'
import { ProductState } from '@/utils/constants'
import { useEffect, useState } from 'react'

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const { user } = useAuth()
    console.log('user', user)

    const fetchProducts = async () => {
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
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value as 'asc' | 'desc')
    }

    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const priceA = a.price ?? 0
            const priceB = b.price ?? 0
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
        })

    return (
        <div>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border p-2 rounded"
                />
                <select value={sortOrder} onChange={handleSort} className="border p-2 rounded">
                    <option value="asc">Sort by price: Low to High</option>
                    <option value="desc">Sort by price: High to Low</option>
                </select>
                <button
                    onClick={fetchProducts}
                    className="border p-2 rounded bg-blue-500 text-white"
                >
                    Refresh
                </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                    <div key={p.id}>
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ProductPage
