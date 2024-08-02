import { Product } from '@/http'
import { Radio, Rate } from 'antd'
import { Link } from 'react-router-dom'

type Props = CardProps & {
    type?: 'detail' | 'any' | 'newCards'
}

type CardProps = {
    product: Product
}

const badge = 'Deal có giới hạn'

const Card = ({ product }: CardProps) => {
    const { thumb, price, priceSale, name, slug, shop, discount, variants, ratingAvg } = product

    return (
        <div className="border rounded-lg w-full h-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Link
                to={`/product/${slug}`}
                className="flex flex-col items-center text-sm font-normal p-2 bg-white rounded-lg hover:bg-gray-50"
            >
                <img className="object-cover w-full h-48 rounded-sm" src={thumb} alt={name} />
                <div className="mt-2 flex justify-center items-center w-full gap-2">
                    {price !== priceSale && (
                        <span className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
                            {discount}
                        </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-yellow-300 rounded-md">{badge}</span>
                </div>
                <div className="flex mt-2 justify-center gap-3 w-full">
                    <span className="text-green-600 font-semibold">{priceSale?.vnd()}</span>
                    {price !== priceSale && (
                        <span className="line-through text-gray-400">{price?.vnd()}</span>
                    )}
                </div>
                <div className="text-gray-800 mt-1 space-x-2">
                    <span>
                        <Rate allowHalf value={ratingAvg || 5} className="text-1sm p-0" disabled />
                    </span>
                    <span>
                        Đã bán:{' '}
                        {variants.map((v) => v.sold).reduce((sold, current) => sold + current, 0)}
                    </span>
                </div>
                <div className="mt-2 flex justify-center items-center w-[10rem] mb-2">
                    <span className="inline-block min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
                        {name}
                    </span>
                </div>
                <div className="flex justify-center items-center w-full mb-1">
                    <span className="inline-block border rounded-2xl py-1 px-2 text-xs min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
                        Giao hàng miễn phí
                    </span>
                </div>
            </Link>
        </div>
    )
}

const CardNewSale = ({ product }: CardProps) => {
    const { thumb, priceSale, name, slug } = product

    return (
        <div className="shadow-lg w-full h-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Link
                to={`/product/${slug}`}
                className="flex flex-col items-center text-sm font-normal p-2 bg-white rounded-lg hover:bg-gray-50"
            >
                <img className="object-cover w-full h-48 rounded-sm" src={thumb} alt={name} />
                <div className="mt-2 flex justify-start font-roboto items-start w-full mb-5">
                    <span className="inline-block min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {name}
                    </span>
                </div>
                <div className="flex flex-col justify-between w-full">
                    <span className="text-red-600 font-semibold">{priceSale?.vnd()}</span>
                    <div className="w-full mt-1">
                        <progress
                            value={0.5}
                            max={1}
                            className="w-full h-3 rounded-full overflow-hidden"
                            style={{ appearance: 'none' }}
                        />
                        <style>
                            {`
                            progress::-webkit-progress-bar {
                                background-color: #EEEDEB;
                                border-radius: 8px;
                            }
                            progress::-webkit-progress-value {
                                background-color: #FF6969;
                                border-radius: 8px;
                            }
                            progress::-moz-progress-bar {
                                background-color: #FF6969;
                                border-radius: 8px;
                            }
                        `}
                        </style>
                    </div>
                </div>
            </Link>
        </div>
    )
}

const Detail = ({ product }: CardProps) => {
    const {
        thumb,
        price,
        priceSale,
        name,
        slug,
        shop,
        attribute: { listVariant },
    } = product

    return (
        <div className="flex items-center text-sm font-normal p-4 bg-white shadow-lg rounded-lg">
            <img className="object-cover w-2/5 h-80 rounded-lg" src={thumb} alt={name} />
            <div className="w-3/5 p-4 bg-gray-100 rounded-lg ml-4">
                <div className="text-xl font-semibold mb-2">{name}</div>
                <div className="text-lg text-red-500 mb-2">
                    Price: {priceSale ? priceSale : price}
                </div>
                <Link className="text-md text-gray-700 mb-2" to={`/shop/${shop.slug}`}>
                    Shop: {shop.name}
                </Link>
                <div className="text-md text-gray-700 mb-4">Mã giảm giá: conc</div>
                <div className="space-y-4">
                    {listVariant.map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                            <div className="font-medium text-gray-700">{item.key}:</div>
                            <Radio.Group className="flex space-x-2">
                                {item.values.map((v) => (
                                    <Radio.Button
                                        key={v}
                                        value={v}
                                        className="px-2 py-1 border rounded-lg"
                                    >
                                        {v}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ProductCard = ({ product, type = 'any' }: Props) => {
    return (
        <div>
            {type === 'any' && <Card product={product} />}
            {type === 'newCards' && <CardNewSale product={product} />}
            {type === 'detail' && <Detail product={product} />}
        </div>
    )
}

export default ProductCard
