import { Product } from '@/http'
import { Radio } from 'antd'
import { Link } from 'react-router-dom'

type Props = CardProps & {
    type?: 'detail' | 'any' | 'cac con cac style list'
}

type CardProps = {
    product: Product
}

const badge = 'Deal có giới hạn'

const Card = ({ product }: CardProps) => {
    const { thumb, price, priceSale, name, slug, shop, discount, variants } = product

    return (
        <div className="shadow-lg w-[60%] h-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Link
                to={`/product/${slug}`}
                className="flex flex-col items-center text-sm font-normal p-2 bg-white rounded-lg hover:bg-gray-50"
            >
                <img className="object-cover w-full h-[12rem] rounded-sm" src={thumb} alt={name} />
                <div className="mt-2 flex justify-center items-center w-full gap-2">
                    <span className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
                        {discount}
                    </span>
                    <span className="px-2 py-1 text-xs bg-yellow-300 rounded-md">{badge}</span>
                </div>
                <div className="flex mt-2 justify-between w-full">
                    <span className="text-green-600 font-semibold">{priceSale?.vnd()}</span>
                    <span className="line-through text-gray-400">{price?.vnd()}</span>
                </div>
                <div className="text-gray-800 mt-1">
                    <span>shop: {shop.name}</span>
                    <span>
                        Đã bán:{' '}
                        {variants.map((v) => v.sold).reduce((sold, current) => sold + current, 0)}
                    </span>
                </div>
                <div className="mt-2 flex justify-center items-center w-full mb-5">
                    <span className="inline-block min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
                        {name}
                    </span>
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
        <div className="flex items-center text-sm font-normal p-1.5">
            <img className="object-cover w-2/5 h-80 rounded-lg" src={thumb} alt="HomeCard" />
            <div className="w-3/5 bg-slate-300">
                <div className="">{name}</div>
                <div>price:{price}</div>
                <div>shop:{shop.name}</div>
                <div>mã giảm giá:conc</div>
                <div>
                    {listVariant.map((item) => {
                        return (
                            <div key={item.key} className="flex">
                                <div>{item.key}:</div>
                                <Radio.Group>
                                    {item.values.map((v) => (
                                        <Radio.Button value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const ProductCard = ({ product, type = 'any' }: Props) => {
    return (
        <div>
            {type === 'any' && <Card product={product} />}
            {type === 'detail' && <Detail product={product} />}
        </div>
    )
}
export default ProductCard
