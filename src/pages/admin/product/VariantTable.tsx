import { ListMap, Variant } from '@/http'
import { Table, Input, Form } from 'antd'
import { ColumnType } from 'antd/es/table'

const rawData = [
    {
        key: 'color',
        values: ['red', 'blue'],
    },
    {
        key: 'size',
        values: ['S', 'M'],
    },
]

type VariantRecord = {
    key: any
    [key: string]: string | number
    quantity: number
    id: string
    productId: string
}

type PropsCreateVariant = {
    data: ListMap[]
    index?: number
    current?: any
    result?: VariantRecord[]
}

// Mở rộng kiểu ColumnType để bao gồm thuộc tính editable
type CustomColumnType<T> = ColumnType<T> & {
    editable?: boolean
}

const flattenVariants = (variants: Variant[]): VariantRecord[] => {
    return variants.map((variant, index) => {
        const flatVariant: VariantRecord = {
            key: index,
            quantity: variant.quantity,
            id: variant.id,
            productId: variant.productId,
        }

        variant.valueVariant.forEach((v) => {
            flatVariant[v.key] = v.value
        })

        return flatVariant
    })
}
const createColumns = (
    // keys: string[],
    data: VariantRecord[]
): CustomColumnType<VariantRecord>[] => {
    if (data.length === 0) return []
    const keys = Object.keys(data[0]).filter((key) => key !== 'key')

    return keys
        .filter((k) => k !== 'id' && k !== 'productId' && k !== 'quantity')
        .map((key) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1),
            dataIndex: key,
            editable: false,
            key: key,
            render: (text: any, record: VariantRecord, index: number) => {
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

type EditableCellProps = {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: string
    record: VariantRecord
    handleSave: (record: VariantRecord) => void
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
                    name={record.key.toString()}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.reject(`${title} is required.`)
                                if (parseInt(value) <= 0)
                                    return Promise.reject(`${title} must be greater than 0.`)
                                return Promise.resolve()
                            },
                        },
                    ]}
                >
                    <Input
                        type="number"
                        defaultValue={record[dataIndex] as number}
                        onBlur={handleBlur}
                    />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}
const VariantTable = ({
    variants,
    onQuantityChange,
}: {
    variants: Variant[]
    onQuantityChange: (record: VariantRecord) => void
}) => {
    const [form] = Form.useForm()

    console.log('variants from variant table', JSON.stringify(variants))

    // console.log('rawData', rawData)

    const convertedData = flattenVariants(variants)
    console.log('convertedData', convertedData)

    const dynamicColumns: CustomColumnType<VariantRecord>[] = createColumns(convertedData)

    console.log(dynamicColumns)

    dynamicColumns.push({
        title: 'Kho hàng',
        dataIndex: 'quantity',
        key: 'quantity',
        editable: true,
    })
    // dynamicColumns.push({
    //     title: 'conc',
    //     dataIndex: 'key',
    //     key: 'ạdhkasjd',
    //     editable: false,
    //     render: (text, record) => JSON.stringify(record),
    // })

    const handleSave = (record: VariantRecord) => {
        console.log('record', record)
        onQuantityChange(record)
    }

    const mergedColumns = dynamicColumns.map((col) => {
        if (!col.editable) {
            return col
        }

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
        <Form
            form={form}
            name="jlzksdhbfhuiosdbfbksljdhfbvbvksdhjfv"
            // onValuesChange={(changedValues, allValues) => {
            //     const { key } = changedValues
            //     onQuantityChange('keyssss', key)
            // }}
        >
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
