import ProductCard from '@/components/ProductCard'
import QuantitySelector from '@/components/QuantitySelector'
import { useAuth, useCart, useMessage } from '@/hooks'
import { Product } from '@/http'
import authApi from '@/http/authApi'
import cartApi from '@/http/cartApi'
import productApi, { initialProduct, Map, Variant } from '@/http/productApi'
import { Button, Input, Radio } from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>()
    const { fetchCart } = useCart()
    const { isAuthenticated, setUser } = useAuth()
    const { success, error } = useMessage()
    const [product, setProduct] = useState<Product>(initialProduct)
    const [selectedValuesVariant, setSelectedValuesVariant] = useState<Map[]>([])
    const [quantity, setQuantity] = useState(1)
    console.log('selectedValuesVariant', selectedValuesVariant)

    const {
        attribute: { listVariant },
        variants,
        thumb,
        name,
        price,
    } = product

    const handleClickVariant = (map: Map) => {
        setSelectedValuesVariant((prev) => {
            // Lọc các object có key khác với key của object mới
            const filtered = prev.filter((item) => item.key !== map.key)
            // Thêm object mới vào danh sách đã lọc
            return [...filtered, map]
        })
    }

    const handleAddToCart = async () => {
        // Tìm variant khớp với các giá trị đã chọn
        const matchedVariant = variants.find((variant) =>
            variant.valueVariant.every((valueVariant) =>
                selectedValuesVariant.some(
                    (selectedValue) =>
                        selectedValue.key === valueVariant.key &&
                        selectedValue.value === valueVariant.value
                )
            )
        )

        if (matchedVariant) {
            console.log('Matched Variant:', matchedVariant)
            const data = { productId: product.id, variantId: matchedVariant.id, quantity }
            let res
            if (!isAuthenticated) {
                // đăng ký user Mod
                const userMod = await authApi.registerUserMod()
                setUser(userMod)
                res = await cartApi.addToCartGuest(data, userMod.id)
            } else {
                res = await cartApi.addToCart(data)
            }

            await fetchCart()
            success('Add to cart success')
            console.log('Add to cart:', res)
        } else {
            console.log('No matching variant found')
        }
    }

    useEffect(() => {
        if (slug) {
            ;(async () => {
                const data = await productApi.findBySlug(slug)
                setProduct(data)
            })()
        }
    }, [slug])

    return (
        <div>
            <div className="flex items-center text-sm font-normal p-1.5">
                <img className="object-cover w-2/5 h-80 rounded-lg" src={thumb} alt="HomeCard" />
                <div className="w-3/5 bg-slate-300">
                    <div className="">{name}</div>
                    <div>price:{price}</div>
                    <div>mã giảm giá:conc</div>
                    <div>
                        {listVariant.map((item) => {
                            return (
                                <div key={item.key} className="flex">
                                    <div>{item.key}:</div>
                                    <Radio.Group>
                                        {item.values.map((v) => (
                                            <Radio.Button
                                                value={v}
                                                onClick={() =>
                                                    handleClickVariant({ key: item.key, value: v })
                                                }
                                            >
                                                {v}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        Số lượng:
                        <QuantitySelector initialQuantity={quantity} onChange={setQuantity} />
                    </div>
                    <Button onClick={handleAddToCart}>add cart</Button>
                    <Button>buy now</Button>
                </div>
            </div>
        </div>
    )
}
export default ProductDetail
