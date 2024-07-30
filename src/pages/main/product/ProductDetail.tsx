import Comment from '@/components/comment/Rating'
import ProductCard from '@/components/ProductCard'
import QuantitySelector from '@/components/QuantitySelector'
import { useAuth, useCart, useMessage } from '@/hooks'
import { Product } from '@/http'
import authApi from '@/http/authApi'
import cartApi from '@/http/cartApi'
import productApi, { initialProduct, Map, Variant } from '@/http/productApi'
import ratingApi from '@/http/ratingApi'
import { Button, Input, Radio, Tabs, TabsProps, Typography, Divider, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const { Title, Text } = Typography

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>()
    const { fetchCart } = useCart()
    const { isAuthenticated, setUser } = useAuth()
    const { success, error } = useMessage()
    const [product, setProduct] = useState<Product>(initialProduct)
    const [selectedValuesVariant, setSelectedValuesVariant] = useState<Map[]>([])
    const [quantity, setQuantity] = useState(1)

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
            const filtered = prev.filter((item) => item.key !== map.key)
            return [...filtered, map]
        })
    }

    const handleAddToCart = async () => {
        const o = matchedVariant()
        if (o) {
            if (quantity > o.quantity) {
                error('Không đủ số lượng trong kho')
                return
            }

            const data = { productId: product.id, variantId: o.id, quantity }
            let res
            if (!isAuthenticated) {
                const userMod = await authApi.registerUserMod()
                setUser(userMod)
                res = await cartApi.addToCartGuest(data, userMod.id)
            } else {
                res = await cartApi.addToCart(data)
            }

            await fetchCart()
            success('Đã thêm vào giỏ hàng')
        } else {
            error('Không tìm thấy biến thể phù hợp')
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
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={10}>
                            <img
                                className="object-cover w-full h-80 rounded-lg"
                                src={thumb}
                                alt="Product Image"
                            />
                        </Col>
                        <Col xs={24} md={14}>
                            <Title level={3}>{name}</Title>
                            <Text strong className="text-lg">
                                Giá: {price} VND
                            </Text>
                            <Text className="block">Cửa hàng: {shop.name}</Text>
                            <Text className="block">
                                Số lượng còn lại: {matchedVariant()?.quantity ?? productQuantity}
                            </Text>
                            <Divider />
                            {listVariant.map((item) => (
                                <div key={item.key} className="mb-2">
                                    <Text className="mr-2">{item.key}:</Text>
                                    <Radio.Group>
                                        {item.values.map((v) => (
                                            <Radio.Button
                                                key={v}
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
                            ))}
                            <div className="mt-4">
                                <Text className="mr-2">Số lượng:</Text>
                                <QuantitySelector
                                    initialQuantity={quantity}
                                    onChange={setQuantity}
                                />
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <Button type="primary" onClick={handleAddToCart}>
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button type="default">Mua ngay</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <Comment product={product} />
            </div>
        </>
    )
}

export default ProductDetail
