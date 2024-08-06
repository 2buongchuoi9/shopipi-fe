import CateTree from '@/components/CateTree'
import ProductCard from '@/components/ProductCard'
import { useAuth, useCategory, useLoading } from '@/hooks'
import { Category, ParamsRequest, Product } from '@/http'
import cartApi from '@/http/cartApi'
import productApi from '@/http/productApi'
import { findCategoryBySlug } from '@/utils'
import { ProductState } from '@/utils/constants'
import { Breadcrumb, Button, Checkbox, InputNumber, Radio, Rate, Select } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

const itemsStart = [5, 4, 3, 2, 1].map((i) => ({
    label: (
        <span className="flex space-x-1">
            <Rate disabled value={i} />
            <p className="text-gray-600 select-none">
                ({i}) {i !== 5 ? 'trở lên' : ''}
            </p>
        </span>
    ),
    value: i,
}))

const itemsSort = [
    { label: 'Phổ biến', value: '' },
    { label: 'Bán chạy', value: 'sold,desc' },
    { label: 'Hàng mới', value: 'createdAt,desc' },
    { label: 'Giá thấp đến Cao', value: 'price,asc' },
    { label: 'Giá cao đến Thấp', value: 'price,desc' },
]

const ProductPage = () => {
    const [params, setParams] = useSearchParams()
    const { user } = useAuth()
    const { categories: allCate } = useCategory()
    const [products, setProducts] = useState<Product[]>([])
    const [query, setQuery] = useState<ParamsRequest>({
        page: 0,
        size: 10,
        sort: '',
        minPrice: null,
        maxPrice: null,
        state: 'ACTIVE',
        rate: null,
        categoryId: null,
    })

    const [cc, setCc] = useState<{ minPrice: number | null; maxPrice: number | null }>({
        minPrice: null,
        maxPrice: null,
    })
    const [currentCate, setCurrentCate] = useState<Category | null>(null)
    const [selectedCate, setSelectedCate] = useState<Category | null>(null)
    // const [categories, setCategories] = useState<Category[]>([])
    const { setLoading } = useLoading()

    const fetchProducts = async () => {
        // if (!selectedCate?.id) return
        const categoryId = selectedCate?.id ?? currentCate?.id ?? null
        if (!categoryId) return
        setLoading(true)
        const data = await productApi.getAll({ ...query, categoryId })

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
        setLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [query, params, selectedCate?.id, currentCate?.id])

    useEffect(() => {
        // find category
        const slug = params.get('category')
        if (!slug) return
        const foundCate = findCategoryBySlug(allCate, slug)
        if (!foundCate) return
        setCurrentCate(foundCate)
        // setSelectedCate(foundCate)
        // setCategories(foundCate?.children ?? [])
    }, [params, allCate])

    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        onClick={() => setSelectedCate(currentCate)}
                        className="hover:cursor-pointer"
                    >
                        {currentCate?.name}
                    </Breadcrumb.Item>
                    {selectedCate && selectedCate.id !== currentCate?.id && (
                        <Breadcrumb.Item
                            onClick={() => setSelectedCate(selectedCate)}
                            className="hover:cursor-pointer"
                        >
                            {selectedCate.name}
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>

            <div className="flex space-x-5">
                <div className="w-1/5 space-y-3">
                    <CateTree
                        setSelected={setSelectedCate}
                        selected={selectedCate}
                        categories={currentCate?.children ?? []}
                    />
                    <div className="border-[1px] rounded-lg p-2 bg-white">
                        <div className="text-lg font-bold p-2">Tìm theo sao</div>
                        <div className="border-t border-gray-200" />

                        <div className="mt-2">
                            {itemsStart.map((item) => (
                                <Checkbox
                                    key={item.value}
                                    checked={query.rate === item.value}
                                    value={item.value}
                                    onChange={(value) =>
                                        setQuery((prev) => ({
                                            ...prev,
                                            rate:
                                                prev.rate === value.target.value
                                                    ? null
                                                    : value.target.value,
                                        }))
                                    }
                                >
                                    {item.label}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                    <div className="border-[1px] rounded-lg p-2 bg-white">
                        <div className="text-lg font-bold p-2">Tìm theo giá</div>
                        <div className="border-t border-gray-200" />
                        <div className="space-y-2">
                            <InputNumber<number>
                                addonAfter="Ngìn đồng"
                                addonBefore="Min"
                                type="number"
                                value={cc.minPrice ? cc.minPrice / 1000 : null}
                                onChange={(value) =>
                                    setCc((prev) => ({
                                        ...prev,
                                        minPrice: value ? value * 1000 : null,
                                    }))
                                }
                            />
                            <InputNumber<number>
                                addonAfter="Ngìn đồng"
                                addonBefore="Max"
                                type="number"
                                value={cc.maxPrice ? cc.maxPrice / 1000 : null}
                                onChange={(value) =>
                                    setCc((prev) => ({
                                        ...prev,
                                        maxPrice: value ? value * 1000 : null,
                                    }))
                                }
                            />
                            <div className="flex items-center justify-center">
                                <Button
                                    type="primary"
                                    onClick={() => setQuery((prev) => ({ ...prev, ...cc }))}
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-4/5">
                    <div className="flex justify-between mb-4 bg-white p-2">
                        <p>{products.length}sản phẩm</p>
                        <div className="flex items-center space-x-2">
                            <p className="text-gray-600 select-none">Sắp xếp</p>
                            <Select
                                options={itemsSort}
                                className="w-40"
                                value={query.sort}
                                onChange={(value) => setQuery((prev) => ({ ...prev, sort: value }))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {products.map((p) => (
                            <div key={p.id}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductPage
