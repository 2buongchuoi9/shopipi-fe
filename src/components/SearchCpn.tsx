import { useDebounce } from '@/hooks'
import searchApi, { ResultSearch } from '@/http/searchApi'
import { AutoComplete, Avatar, Input, Rate } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SearchCpn = () => {
    const [input, setInput] = useState('')
    const keySearch = useDebounce({ value: input, delay: 500 })
    const [resultSearch, setResultSearch] = useState<ResultSearch | null>(null)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (!keySearch.trim()) {
            setResultSearch(null)
            setDropdownVisible(false)
            return
        }

        ;(async () => {
            setLoad(true)
            const res = await searchApi.search({ keySearch, size: 10 })
            setResultSearch(res)
            console.log('res', res)

            setDropdownVisible(true)
            setLoad(false)
        })()
    }, [keySearch])

    const getOptions = () => {
        if (!resultSearch) return []

        const shopOptions =
            resultSearch.shops.content.length > 0
                ? [
                      {
                          label: 'Shops',
                          options: resultSearch.shops.content.map((shop) => ({
                              value: shop.name,
                              label: (
                                  <Link to={`/shop/${shop.slug}`}>
                                      <div className="flex items-center space-x-2">
                                          <Avatar src={shop?.image}>{shop.name}</Avatar>
                                          <div>
                                              <strong>{shop.name}</strong>
                                              <p>{shop.email}</p>
                                          </div>
                                      </div>
                                  </Link>
                              ),
                          })),
                      },
                  ]
                : []

        const productOptions =
            resultSearch.products.content.length > 0
                ? [
                      {
                          label: 'Products',
                          options: resultSearch.products.content.map((product) => ({
                              value: product.name,
                              label: (
                                  <Link to={`/product/${product.slug}`}>
                                      <div className="flex items-center space-x-2">
                                          <Avatar src={product?.thumb}>{product.name}</Avatar>
                                          <div>
                                              <strong className="text-clip">{product.name}</strong>
                                              <div className="flex items-center">
                                                  <p>đã bán: {product.sold}</p>

                                                  <span className="flex">
                                                      <Rate
                                                          value={
                                                              product.ratingAvg === 0
                                                                  ? 5
                                                                  : product.ratingAvg
                                                          }
                                                          disabled
                                                          className="text-1sm"
                                                      />
                                                      <p className="text-gray-600">
                                                          ({product.totalRating} đánh giá)
                                                      </p>
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  </Link>
                              ),
                          })),
                      },
                  ]
                : []

        return [...productOptions, ...shopOptions]
    }

    return (
        <div>
            <AutoComplete
                options={getOptions()}
                open={dropdownVisible}
                onSelect={() => setDropdownVisible(false)} // Ẩn dropdown khi chọn một gợi ý
                value={input}
                onDropdownVisibleChange={(open) => setDropdownVisible(open)} // Cập nhật trạng thái dropdown
                className="w-full"
            >
                <Input
                    placeholder="Tìm kiếm sản phẩm, shop,.."
                    onChange={(e) => setInput(e.target.value)}
                    allowClear
                />
            </AutoComplete>
        </div>
    )
}

export default SearchCpn
