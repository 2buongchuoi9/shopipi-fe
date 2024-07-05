import { ErrorPayload } from '@/http'
import productApi, { Attribute, Map, Product, Variant, ListMap } from '@/http/productApi'
import { Button, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AllProduct = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const data = await productApi.getAll()
                setProducts(data.content.map((item) => ({ ...item, key: item.id })))
            } catch (error) {
                if (error instanceof ErrorPayload) {
                    console.error('ErrorPayload', error)
                }
            }
        })()
    }, [])

    console.log('products', products)

    const column: ColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'type',
            key: 'type',
            render: (type, record) => {
                const { name, thumb } = record
                return (
                    <div className="flex justify-start items-center">
                        <img src={thumb} alt={name} className="w-10 h-10 object-cover" />
                        <div className="ml-2">
                            <Tooltip title={name}>
                                <p className="text-ellipsis line-clamp-2">{name}</p>
                            </Tooltip>
                            <p>{type}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        // {
        //     title: 'Create At',
        //     dataIndex: 'createAt',
        //     key: 'createAt',
        //     render: (createAt) => <Tooltip title={createAt}>{createAt.substring(0, 10)}</Tooltip>,
        // },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span className="flex flex-col justify-start">
                    <Button size="small" type="link" className="flex justify-start">
                        <Link to={`/product/detail/${record.slug}`}> cập nhật</Link>
                    </Button>
                    <Button size="small" type="link" className="flex justify-start">
                        xóa
                    </Button>
                    <Button size="small" type="link" className="flex justify-start">
                        xem thêm
                    </Button>
                </span>
            ),
        },
    ]

    const columnVariant: ColumnsType<Variant> = [
        {
            title: 'Tên biến thể',
            dataIndex: 'valueVariant',
            key: 'conc',
            render: (valueVariant: Map[]) => {
                return valueVariant.map((variant: Map) => variant.value).join(', ')
            },
        },
        {
            title: 'Kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <Tooltip title={quantity}>{quantity}</Tooltip>,
        },
    ]

    return (
        <div>
            <h1>Product All</h1>
            <Table
                dataSource={products}
                columns={column}
                bordered
                // scroll={{ y: 1000 }}
                expandable={{
                    expandedRowRender: (record) => {
                        const {
                            variants,
                            attribute,
                            category,
                            price,
                            priceImport,
                            totalComment,
                            totalRating,
                        } = record
                        console.log('attribute', attribute)

                        const renderAttribute = (key: keyof Attribute) => {
                            if (key === 'listVariant') {
                                return (attribute.listVariant as ListMap[]).map((item, index) => (
                                    <li key={index}>
                                        {item.key}: {item.values.join(', ')}
                                    </li>
                                ))
                            } else {
                                return (
                                    <li key={key}>
                                        {key}: {(attribute[key] as string) ?? 'none'}
                                    </li>
                                )
                            }
                        }

                        return (
                            <div className="flex">
                                <div>
                                    <h2>Biến thể</h2>
                                    <Table
                                        dataSource={variants}
                                        columns={columnVariant}
                                        pagination={false}
                                    />
                                </div>
                                <div>
                                    <h2>Thuộc tính</h2>
                                    <ul className="list-disc list-inside">
                                        {Object.keys(attribute).map((key) =>
                                            renderAttribute(key as keyof Attribute)
                                        )}
                                        <li>Category: {category.name}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h2>chi tiết</h2>
                                    <ul className="list-disc list-inside">
                                        <li>Giá: {price}</li>
                                        <li>Giá nhập: {priceImport}</li>
                                        <li>Số bình luận: {totalComment}</li>
                                        <li>Số đánh giá: {totalRating}</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    },
                    // rowExpandable: (record) => !!record.variants && record.variants.length > 0,
                }}
            />
        </div>
    )
}
export default AllProduct
