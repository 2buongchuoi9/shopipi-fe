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
    const { thumb, price, priceSale, name, slug, shop, discount } = product

    return (
        <div>
            <Link
                to={`/product/${slug}`}
                className="flex flex-col items-center text-sm font-normal p-1.5"
            >
                <img className="object-cover w-full h-80 rounded-lg" src={thumb} alt="HomeCard" />
                <div className="mt-2 flex justify-center items-center w-full gap-1">
                    <span className="mt-1 bg-red-500 text-white rounded-md">{discount}</span>
                    <span className="mt-1 text-1sm bg-yellow-300 rounded-md">{badge}</span>
                </div>
                <div className="flex mt-2">
                    <span className="">{priceSale?.vnd()}</span>
                    <span className="line-through">{price?.vnd()}</span>
                </div>
                <div>
                    <span>shop:{shop.name}</span>
                </div>
                <div className="mt-2 flex justify-center items-center w-full mb-5">
                    <span className="inline-block min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
    console.log('product', product)

    return (
        <div>
            {type === 'any' && <Card product={product} />}
            {type === 'detail' && <Detail product={product} />}
        </div>
    )
}
export default ProductCard
