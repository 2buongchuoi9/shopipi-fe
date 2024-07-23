import Comment from '@/components/comment/Rating'
import ProductCard from '@/components/ProductCard'
import QuantitySelector from '@/components/QuantitySelector'
import { useAuth, useCart, useMessage } from '@/hooks'
import { Product } from '@/http'
import authApi from '@/http/authApi'
import cartApi from '@/http/cartApi'
import productApi, { initialProduct, Map, Variant } from '@/http/productApi'
import ratingApi from '@/http/ratingApi'
import { Button, Input, Radio, Tabs, TabsProps } from 'antd'
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
        shop,
        quantity: productQuantity,
        id,
    } = product

    // Tìm variant khớp với các giá trị đã chọn
    const matchedVariant = () => {
        return variants.find((variant) =>
            variant.valueVariant.every((valueVariant) =>
                selectedValuesVariant.some(
                    (selectedValue) =>
                        selectedValue.key === valueVariant.key &&
                        selectedValue.value === valueVariant.value
                )
            )
        )
    }

    const handleClickVariant = (map: Map) => {
        setSelectedValuesVariant((prev) => {
            // Lọc các object có key khác với key của object mới
            const filtered = prev.filter((item) => item.key !== map.key)
            // Thêm object mới vào danh sách đã lọc
            return [...filtered, map]
        })
        console.log(matchedVariant())
    }

    const handleAddToCart = async () => {
        const o = matchedVariant()
        if (o) {
            console.log('Matched Variant:', o)

            // check quantity
            if (quantity > o.quantity) {
                error('kho hàng không đủ')
                return
            }

            const data = { productId: product.id, variantId: o.id, quantity }
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
        <>
            <div>
                <div className="flex items-center text-sm font-normal p-1.5">
                    <img
                        className="object-cover w-2/5 h-80 rounded-lg"
                        src={thumb}
                        alt="HomeCard"
                    />
                    <div className="w-3/5 bg-slate-300">
                        <div className="">{name}</div>
                        <div>price:{price}</div>
                        <div>shop:{shop.name}</div>
                        <div>mã giảm giá:conc</div>
                        <div>số luọng:{matchedVariant()?.quantity ?? productQuantity}</div>

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
                                                        handleClickVariant({
                                                            key: item.key,
                                                            value: v,
                                                        })
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
            <div>
                <Button
                    type="primary"
                    className="mb-4"
                    onClick={async () => {
                        const res = await ratingApi.addRating({
                            comment:
                                'Sản phẩm k giống hình, dáng quần thực sự quá xấu, k có túi bên, khoá giả, túm lại la thất vọng',
                            isComment: false,
                            images: [
                                'http://res.cloudinary.com/anhdaden/image/upload/v1719726212/shopipi_fpt/mz8ipsummrpstz3rrmol.jpg',
                            ],
                            parentId: null,
                            productId: id,
                            value: 1,
                            variantId: variants[0].id,
                        })
                        console.log('Rating:', res)
                        success('Rating success')
                    }}
                >
                    test rate
                </Button>
                <Comment product={product} />
            </div>
        </>
    )
}
export default ProductDetail
