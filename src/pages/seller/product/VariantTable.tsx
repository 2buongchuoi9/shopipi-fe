import { Variant } from '@/http'
import { Form, Input, Table } from 'antd'
import { ColumnType } from 'antd/es/table'

type Type = 'product' | 'inventory'

type VariantRecordBase = {
    key: any
    [key: string]: string | number
    id: string
    productId: string
    price: number
    priceImport: number
    priceSale: number
    quantity: number
}
type VariantRecord = VariantRecordBase & {
    quantity_old: number
    priceImport_old: number
}

// Mở rộng kiểu ColumnType để bao gồm thuộc tính editable
type CustomColumnType<T> = ColumnType<T> & {
    editable?: boolean
}
type EditableCellProps = {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: string
    record: VariantRecord
    handleSave: (record: VariantRecord) => void
    type: Type
}

const flattenVariants = (variants: Variant[], type: Type): VariantRecord[] => {
    return variants.map((variant, index) => {
        const flatVariant: VariantRecord = {
            key: index,
            price: variant.price,
            id: variant.id,
            productId: variant.productId,
            priceImport: type === 'inventory' ? 0 : variant.priceImport,
            priceSale: variant.priceSale,
            quantity: type === 'inventory' ? 0 : variant.quantity,
            quantity_old: variant.quantity,
            priceImport_old: variant.priceImport,
        }

        variant.valueVariant.forEach((v) => {
            flatVariant[v.key] = v.value
        })

        return flatVariant
    })
}

const createColumns = (data: VariantRecord[]): CustomColumnType<VariantRecord>[] => {
    if (data.length === 0) return []
    const keys = Object.keys(data[0]).filter((key) => key !== 'key')

    return keys
        .filter(
            (k) =>
                k !== 'id' &&
                k !== 'productId' &&
                k !== 'price' &&
                k !== 'priceImport' &&
                k !== 'priceSale' &&
                k !== 'quantity' &&
                k !== 'quantity_old' &&
                k !== 'priceImport_old'
        )
        .map((key) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1),
            dataIndex: key,
            editable: false,
            key: key,
            render: (text: any, _: VariantRecord, index: number) => {
                const previousRecord = index > 0 ? data[index - 1] : ({} as VariantRecord)
                const currentRecord = data[index]
                const previousValue = previousRecord[key]
                const currentValue = currentRecord[key]

                let rowSpan = 1
                if (previousValue === currentValue) {
                    rowSpan = 0
                } else {
                    for (let i = index + 1; i < data.length; i++) {
                        if (data[i][key] === currentValue) {
                            rowSpan++
                        } else {
                            break
                        }
                    }
                }

                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan,
                    },
                }
            },
        }))
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}: EditableCellProps) => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value
        handleSave({ ...record, [dataIndex]: value })
    }
    return (
        <td {...restProps}>
            {editable ? (
                <Form.Item
                    style={{ margin: 0 }}
                    // 'table' is important to make sure the name is unique
                    name={record.key.toString() + dataIndex}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.reject(`${title} is required.`)
                                if (parseInt(value) <= 0)
                                    return Promise.reject(`${title} phải lớn hơn 0.`)
                                if (dataIndex.startsWith('price') && parseInt(value) < 10000)
                                    return Promise.reject(`${title} phải lớn hơn 10,000.`)
                            },
                        },
                    ]}
                >
                    <Input
                        type="number"
                        defaultValue={record[dataIndex] as number}
                        onBlur={handleBlur}
                        prefix={dataIndex.startsWith('price') ? '₫' : ''}
                    />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}

type Props = {
    variants: Variant[]
    onRecordChange: (record: VariantRecord) => void
    type: Type
}

const VariantTable = ({ variants, onRecordChange, type }: Props) => {
    const [form] = Form.useForm()

    const convertedData = flattenVariants(variants, type)

    const dynamicColumns: CustomColumnType<VariantRecord>[] = createColumns(convertedData)

    if (type === 'product') {
        dynamicColumns.push({
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            editable: true,
        })
    }

    if (type === 'inventory') {
        dynamicColumns.push({
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            editable: false,
        })
        dynamicColumns.push({
            title: 'Giá nhập cũ',
            dataIndex: 'priceImport_old',
            key: 'priceImport_old',
            editable: false,
        })
        dynamicColumns.push({
            title: 'Tồn kho',
            dataIndex: 'quantity_old',
            key: 'quantity_old',
            editable: false,
        })
        dynamicColumns.push({
            title: 'Giá nhập',
            dataIndex: 'priceImport',
            key: 'priceImport',
            editable: true,
        })

        dynamicColumns.push({
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            editable: true,
        })
    }

    const handleSave = (row: VariantRecord) => {
        onRecordChange(row)
    }

    const mergedColumns = dynamicColumns.map((col) => {
        if (!col.editable) return col

        return {
            ...col,
            onCell: (record: VariantRecord) => ({
                record,
                editable: true,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        }
    }) as ColumnType<VariantRecord>[]

    return (
        <Form form={form} name="jlzksdhbfhuiosdbfbksljdhfbvbvksdhjfv">
            <Table
                bordered
                dataSource={convertedData}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
            />
        </Form>
    )
}

export default VariantTable
