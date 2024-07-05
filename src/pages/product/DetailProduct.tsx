import ModalMedia, { ActiveFieldMediaType, OnOkMediaProps } from '@/components/ModalMedia'
import { useCategory } from '@/contexts/CategoryContex'
import { useMessage } from '@/contexts/MessageContext'
import { Attribute, ProductRequest, Variant, ListMap, productType } from '@/http'
import { MediaType, mediaType } from '@/http/fileApi'
import { convertVietNameseToSlug } from '@/utils'
import { Button, Cascader, Collapse, Divider, Form, Input, Radio, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import _, { uniqueId } from 'lodash'
import { cloneElement, useEffect, useState } from 'react'
import { CiCircleRemove } from 'react-icons/ci'
import { FaImage, FaPlay, FaPlus, FaRegImage, FaTrashCan } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'
import VariantTable from './VariantTable'
import productApi from '@/http/productApi'
const rawData = [
    {
        key: 'color',
        values: ['red', 'blue'],
    },
    {
        key: 'size',
        values: ['S', 'M'],
    },
    // {
    //     key: 'material',
    //     values: ['cotton', 'polyester'],
    // },
]

const initProduct = {
    attribute: {
        brand: '',
        origin: '',
        listVariant: [],
    } as Attribute,
    type: productType[0],
    name: null,
    thumb: null,
    video: null,
    images: [],
    price: 0,
    priceImport: 0,
    description: null,
    categoryId: null,
    status: false,
}

const formItemLayout = {
    labelCol: { sm: { span: 3 } },
    wrapperCol: {},
    formItemLayout: 'vertical',
}

const formItemLayoutDetailed = {
    labelCol: { sm: { span: 6 } },
    wrapperCol: { sm: { span: 18 } },
    formItemLayout: 'vertical',
}

const combineVariants = (
    data: ListMap[],
    index = 0,
    currentVariant: { [key: string]: string } = {},
    result: Variant[] = [],
    id: string = '',
    productId: string = ''
): Variant[] => {
    if (index === data.length) {
        result.push({
            id,
            productId,
            quantity: 0,
            valueVariant: Object.keys(currentVariant).map((key) => ({
                key,
                value: currentVariant[key],
            })),
        })
        return result
    }

    const { key, values } = data[index]
    values.forEach((value) => {
        currentVariant[key] = value
        combineVariants(data, index + 1, currentVariant, result)
    })

    return result
}

const DetailProduct = ({ isAdd = false }: { isAdd: boolean }) => {
    const { slug } = useParams<{ slug: string }>()
    const [form] = useForm<ProductRequest>()
    const { categories } = useCategory()
    const { loading, error, success } = useMessage()
    const [openMedia, setOpenMedia] = useState(false)
    const [activeField, setActiveField] = useState<ActiveFieldMediaType>(null)
    const [typeMedia, setTypeMedia] = useState<MediaType>(mediaType.IMAGE)
    const [onCancel, setOnCancel] = useState(() => () => setOpenMedia(false))

    // const [productReq, setProductReq] = useState<ProductRequest>(initProduct)

    // biến thể sản phẩm đổ vào bảng
    const [variants, setVariants] = useState<Variant[]>([])

    // theo giõi ảnh bìa (chỗ này cần optimize lại, không cần dùng state, chỉ cần lấy từ form là đủ)
    const [thumb, setThumb] = useState<string | null>(null)

    useEffect(() => {
        console.log('variants', variants)
    }, [variants])

    useEffect(() => {
        if (!isAdd && slug) {
            ;(async () => {
                const res = await productApi.findBySlug(slug)
                console.log('res', res)
                const product = { ...res, categoryId: res.category.id }
                // setProductReq(product)
                setVariants(res.variants)
                form.setFieldsValue(product)
                form.setFieldValue('attribute', product.attribute)
                console.log('all valuesádasdasdasdasd', form.getFieldsValue())
            })()
        }
    }, [slug])

    const handleSubmitFailed = (errorInfo: {
        errorFields: { name: (string | number)[]; errors: string[] }[]
    }) => {
        console.log('errorInfo', errorInfo)

        const { errorFields } = errorInfo
        form.scrollToField(errorFields[0].name[0], {
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
            // offsetTop: 100,
        })
        error(errorFields[0].errors[0])
    }

    const handleSubmit = async (values: ProductRequest) => {
        // Kiểm tra số lượng của các phân loại
        const variantError = variants.find(({ quantity }) => quantity <= 0)
        if (variantError) {
            const name = variantError.valueVariant.map((v) => v.key + ':' + v.value).join(', ')
            error(`Số lượng của phân loại ${name} không hợp lệ`)
        }

        const newData = { ...values, variants }
        console.log('newData', newData)
        console.log('listVariant', values?.attribute?.listVariant)

        // Chuyển categoryId từ mảng thành string
        if (Array.isArray(newData.categoryId))
            newData.categoryId = newData.categoryId[newData.categoryId.length - 1]

        // Cập nhật type của attribute important in backend
        newData.attribute.type = newData.type

        try {
            const res = await productApi.addProduct(newData)
            console.log('res', res)

            success('quá oke')
        } catch (e) {
            console.log('error', e)
        }
    }

    const handleChangeValues = (
        changedValues: Partial<ProductRequest>,
        allValues: ProductRequest
    ) => {
        console.log('changedValues', changedValues)
        console.log('allValues', allValues)

        // Cập nhật lại state variants khi thay đổi listVariant
        const { attribute } = changedValues

        if (attribute?.listVariant) {
            const listVariant = form.getFieldValue(['attribute', 'listVariant']) as ListMap[]
            console.log('listVariant', listVariant)

            // Cập nhât lại state variants
            const newVariants = combineVariants(listVariant)
            setVariants(newVariants)
        }

        // input quantity trong table variant thay đổi thì cập nhật lại state variants
    }

    const handleChooseFile = (fieldName: ActiveFieldMediaType, mediaType: MediaType) => {
        setActiveField(fieldName)
        setTypeMedia(mediaType)
        setOpenMedia(true)
    }

    const handleOkModal = ({ activeField, selectedFile }: OnOkMediaProps) => {
        if (activeField) {
            const values = form.getFieldsValue()
            // console.log('activeField', activeField)
            _.set(values, activeField, selectedFile?.url)
            form.setFieldsValue(values)
            if (Array.isArray(activeField) && activeField.includes('images')) {
                const thumb = form.getFieldValue('thumb')
                if (!thumb) form.setFieldValue('thumb', selectedFile?.url)
            }
            setOpenMedia(false)
        } else console.log('loi ok modal activeField', activeField, selectedFile?.url)
    }

    const validate = {
        name: (_: any, value: string) => {
            if (!value) return Promise.reject('Tên sản phẩm không được để trống')
            return Promise.resolve()
        },
        price: (_: any, value: number) => {
            if (value <= 0) return Promise.reject('Giá bán không được nhỏ hơn 0')
            return Promise.resolve()
        },
        priceImport: (_: any, value: number) => {
            if (value <= 0) return Promise.reject('Giá nhập không được nhỏ hơn 0')
            return Promise.resolve()
        },
        categoryId: (_: any, value: string) => {
            if (!value) return Promise.reject('Ngành hàng không được để trống')
            return Promise.resolve()
        },
        variantKey: (_: any, value: string) => {
            value = value.trim()
            if (value.length < 1)
                return Promise.reject(new Error('Tên phân loại không được để trống'))

            const listVariants = form.getFieldValue(['attribute', 'listVariant'])
            const keys = listVariants.map((variant: any) => variant.key)
            const uniqueKeys = new Set(keys)
            if (keys.length !== uniqueKeys.size) {
                return Promise.reject(new Error('Các tên phân loại phải khác nhau'))
            }
            return Promise.resolve()
        },
        variantValues: (name: (string | number)[], value: string) => {
            value = value.trim()
            if (value.length < 1)
                return Promise.reject(new Error('Các phân loại không được để trống'))

            const values = form.getFieldValue(name)
            const uniqueValues = new Set(values)
            if (values.length !== uniqueValues.size) {
                return Promise.reject(new Error('Các phân loại phải khác nhau'))
            }

            return Promise.resolve()
        },
    }

    const itemsGeneral = [
        {
            key: 'itemsGeneral',
            label: 'Thông tin cơ bản',
            children: (
                <>
                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        name="images"
                        rules={[
                            {
                                required: true,
                                message: 'Sản phẩm phải có ít nhất 2 hình ảnh',
                            },
                        ]}
                    >
                        <Form.List
                            name="images"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        return Array.isArray(value) && value.length >= 2
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error(
                                                      'Hình ảnh sản phẩm phải có ít nhất 2 hình ảnh'
                                                  )
                                              )
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => (
                                <div className="flex space-x-3">
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Form.Item {...restField} name={[name]} key={key}>
                                            <div className="aspect-square w-20 h-20 relative group">
                                                <Input hidden />
                                                <img
                                                    className="w-full h-full"
                                                    src={form.getFieldValue(['images', name])}
                                                />

                                                <div className="w-full flex justify-evenly bg-gray-700 absolute bottom-0 right-0">
                                                    <Tooltip
                                                        title="Chọn làm ảnh bìa"
                                                        placement="bottom"
                                                    >
                                                        <FaImage
                                                            size={18}
                                                            className="hidden group-hover:block text-red-500  hover:cursor-pointer"
                                                            onClick={() => {
                                                                form.setFieldValue(
                                                                    'thumb',
                                                                    form.getFieldValue([
                                                                        'images',
                                                                        name,
                                                                    ])
                                                                )
                                                                setThumb(
                                                                    form.getFieldValue('thumb')
                                                                )
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="xóa hình" placement="bottom">
                                                        <FaTrashCan
                                                            size={18}
                                                            className="hidden group-hover:block text-red-500  hover:cursor-pointer"
                                                            onClick={() => remove(name)}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </Form.Item>
                                    ))}
                                    <Button
                                        type="dashed"
                                        className="w-20 h-20 hover:cursor-pointer p-0 "
                                        onClick={() => {
                                            const currentLength = fields.length
                                            setOnCancel(() => () => {
                                                remove(currentLength)
                                                setOpenMedia(false)
                                            })
                                            handleChooseFile(
                                                ['images', currentLength],
                                                mediaType.IMAGE
                                            )
                                            add('') // important to add new field
                                        }}
                                    >
                                        <div className="flex flex-col justify-center items-center text-blue-400">
                                            <FaRegImage size={20} />
                                            <p className="text-ellipsis line-clamp-2 w-full text-sm ">
                                                Thêm ảnh
                                            </p>
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* thumb */}
                    <Form.Item
                        label="Ảnh bìa"
                        name="thumb"
                        dependencies={['images']}
                        rules={[{ required: true, message: 'ảnh bìa không được để trống' }]}
                    >
                        <div className="flex items-center space-x-3">
                            <Input hidden />
                            <div className="aspect-square w-20 h-20 relative group">
                                <img
                                    className="w-20 h-20"
                                    src={thumb ?? form.getFieldValue('thumb') ?? ''}
                                />
                            </div>
                            <ul className="list-inside list-disc text-wrap flex-1 text-[#999999]">
                                <li>Tải lên hình ảnh 1:1</li>
                                <li>
                                    Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý
                                    hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy
                                    cập vào sản phẩm của bạn
                                </li>
                            </ul>
                        </div>
                    </Form.Item>

                    {/* video */}
                    <Form.Item label="Video sản phẩm" name="video">
                        <div className="flex items-center space-x-3">
                            <div className="aspect-square w-20 h-20 relative group">
                                <Input hidden />
                                {form.getFieldValue('video') ? (
                                    <div className="aspect-square w-20 h-20 relative group">
                                        <Input hidden />
                                        <video
                                            className="w-full h-full border-2 hover:cursor-pointer"
                                            src={form.getFieldValue('video')}
                                            onClick={() => {
                                                setOnCancel(() => () => {
                                                    setOpenMedia(false)
                                                })
                                                handleChooseFile(['video'], mediaType.VIDEO)
                                            }}
                                        />
                                        <div className="w-full flex justify-evenly bg-gray-700 absolute bottom-0 right-0">
                                            <Tooltip title="Xem video" placement="bottom">
                                                <FaPlay
                                                    size={18}
                                                    className="hidden group-hover:block text-red-500  hover:cursor-pointer"
                                                    onClick={() => {
                                                        error('Chưa xử lý')
                                                    }}
                                                />
                                            </Tooltip>
                                            <Tooltip title="xóa hình" placement="bottom">
                                                <FaTrashCan
                                                    size={18}
                                                    className="hidden group-hover:block text-red-500  hover:cursor-pointer"
                                                    onClick={() =>
                                                        form.setFieldValue('video', null)
                                                    }
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="dashed"
                                        className="w-20 h-20"
                                        onClick={() => {
                                            setOnCancel(() => () => {
                                                setOpenMedia(false)
                                            })
                                            handleChooseFile(['video'], mediaType.VIDEO)
                                        }}
                                    >
                                        <div className="flex flex-col justify-center items-center text-blue-400">
                                            <FaRegImage size={20} />
                                            <span className="text-ellipsis line-clamp-2 w-full text-sm ">
                                                Thêm video
                                            </span>
                                        </div>
                                    </Button>
                                )}
                            </div>
                            <ul className="list-inside list-disc text-wrap text-[#999999]">
                                <li>
                                    Kích thước tối đa 30Mb, độ phân giải không vượt quá 1280x1280px
                                </li>
                                <li>Độ dài: 10s-60s</li>
                                <li>Định dạng: MP4</li>
                                <li>
                                    Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử lý.
                                    Video sẽ tự động hiển thị sau khi đã xử lý thành công
                                </li>
                            </ul>
                        </div>
                    </Form.Item>

                    {/* name */}
                    <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                        <Input placeholder="Tên sản phẩm + Thương hiệu + Modal + Thông số kỹ thuật" />
                    </Form.Item>

                    {/* slug */}
                    <Form.Item
                        name="slug"
                        label="Slug"
                        hasFeedback
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Slug không được để trống',
                            },
                            {
                                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                message:
                                    'Slug không hợp lệ (chỉ chứa chữ thường và số, dấu gạch ngang)',
                            },
                        ]}
                        extra={
                            <div>
                                slug là đường dẫn hiển thị trên trình duyệt, không chứa dấu cách
                                <Tooltip title={`Auto theo name`}>
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            console.log('form', form.getFieldsValue())
                                            form.setFieldValue(
                                                'slug',
                                                convertVietNameseToSlug(form.getFieldValue('name'))
                                            )
                                        }}
                                    >
                                        "Tự động tạo slug từ tên sản phẩm"
                                    </Button>
                                </Tooltip>
                            </div>
                        }
                    >
                        <Input />
                    </Form.Item>

                    {/* loại sản phẩm */}
                    <Form.Item label="Loại sản phẩm" name="type" rules={[{ required: true }]}>
                        <Radio.Group>
                            {productType.map((type) => (
                                <Radio value={type} key={type}>
                                    {type}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    {/* category */}
                    <Form.Item label="Ngành hàng" name="categoryId" rules={[{ required: true }]}>
                        <Cascader
                            className="w-full"
                            options={categories}
                            onChange={(value) => {
                                console.log('value', value)
                                console.log('all values', form.getFieldsValue())
                            }}
                            placeholder="Select category"
                            showSearch={{
                                filter: (inputValue, path) =>
                                    path.some(
                                        (option) =>
                                            option.label
                                                .toLowerCase()
                                                .indexOf(inputValue.toLowerCase()) > -1
                                    ),
                            }}
                            onSearch={(value) => console.log(value)}
                        />
                    </Form.Item>

                    {/* description */}
                    <Form.Item label="Mô tả sản phẩm" name="description">
                        <TextArea
                            placeholder="Mô tả sản phẩm"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>
                </>
            ),
        },
    ]

    const itemsDetailed = [
        <Form.Item
            label="Giá bán"
            name="price"
            rules={[{ required: true }]}
            {...formItemLayoutDetailed}
        >
            <Input type="number" />
        </Form.Item>,
        <Form.Item
            label="Giá nhập"
            name="priceImport"
            rules={[{ required: true }]}
            {...formItemLayoutDetailed}
        >
            <Input type="number" />
        </Form.Item>,
    ]
    const itemsSales = [
        {
            key: 'itemsSales',
            label: 'Thông tin Bán hàng',
            children: (
                <>
                    <Form.Item label="Phân loại hàng">
                        <Form.List name={['attribute', 'listVariant']}>
                            {(fields, { add, remove }) => (
                                <div className="space-y-3">
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="bg-[#F6F6F6] relative">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[{ validator: validate.variantKey }]}
                                                className="p-3 pb-0"
                                            >
                                                <Input
                                                    className="w-1/2"
                                                    placeholder={`Tên phân loại ${name + 1}`}
                                                    count={{
                                                        show: true,
                                                        max: 14,
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.List name={[name, 'values']}>
                                                {(
                                                    fields,
                                                    { add: addChild, remove: removeChild }
                                                ) => (
                                                    <div className="grid grid-cols-2 px-3 gap-y-0 gap-x-10">
                                                        {fields.map(
                                                            ({
                                                                key: childKey,
                                                                name: childName,
                                                                fieldKey: childFieldKey,
                                                                ...restField
                                                            }) => (
                                                                <div
                                                                    key={childKey}
                                                                    className="relative w-full"
                                                                >
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={childName}
                                                                        rules={[
                                                                            {
                                                                                validator: (
                                                                                    _,
                                                                                    value
                                                                                ) =>
                                                                                    validate.variantValues(
                                                                                        [
                                                                                            'attribute',
                                                                                            'listVariant',
                                                                                            name,
                                                                                            'values',
                                                                                        ],
                                                                                        value
                                                                                    ),
                                                                            },
                                                                        ]}
                                                                        className="mr-5"
                                                                    >
                                                                        <Input
                                                                            placeholder={`Nhập ${
                                                                                childName + 1
                                                                            }`}
                                                                        />
                                                                    </Form.Item>
                                                                    <FaTrashCan
                                                                        size={15}
                                                                        onClick={() =>
                                                                            removeChild(childName)
                                                                        }
                                                                        className="absolute top-1/4 right-0 translate-y-[1/2] text-[#00000073] hover:cursor-pointer hover:text-red-500"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                        <div className="top-0 right-0">
                                                            <Button
                                                                icon={<FaPlus />}
                                                                onClick={() => addChild()}
                                                                className="text-blue-400 hover:text-blue-500"
                                                            >
                                                                Thêm
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Form.List>
                                            <CiCircleRemove
                                                size={25}
                                                className="absolute top-0 right-0 m-2 text-[#00000073] hover:cursor-pointer hover:text-red-500"
                                                onClick={() => remove(name)}
                                            />
                                        </div>
                                    ))}
                                    <div className="pt-3">
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                icon={<FaPlus />}
                                                onClick={() => add()}
                                                className="text-blue-400 hover:text-blue-500"
                                            >
                                                Thêm nhóm phân loại
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>

                    <Form.Item label="Danh sách phân loại" name={'table'}>
                        <VariantTable
                            variants={variants}
                            onQuantityChange={(record) => {
                                console.log('variantRecord', record)
                                if (record.quantity > 0) {
                                    setVariants((prev) => {
                                        prev[record.key].quantity = record.quantity
                                        return prev
                                    })
                                }
                                console.log('variants', variants)
                            }}
                        />
                    </Form.Item>
                </>
            ),
        },
    ]

    return (
        <>
            {isAdd ? 'add' : 'detail'} product
            <ModalMedia
                isOpen={openMedia}
                activeField={activeField}
                onCancel={onCancel}
                typeMedia={typeMedia}
                /* onOk là hàm, tham số là object gồm activeField và selectedFile */
                onOk={handleOkModal}
            />
            <Form
                {...formItemLayout}
                // layout="vertical"
                name="dynamic_form_item"
                form={form}
                variant="filled"
                initialValues={initProduct}
                onFinish={handleSubmit}
                onFinishFailed={handleSubmitFailed}
                onValuesChange={handleChangeValues}
                // className="grid grid-cols-3 gap-5"
            >
                <div className="space-y-8">
                    <Collapse
                        defaultActiveKey={['itemsGeneral']}
                        size="small"
                        items={itemsGeneral}
                    />
                    <Collapse defaultActiveKey={['itemsSales']} size="small" items={itemsSales} />
                    <Collapse
                        defaultActiveKey={['thong tin chi tiet']}
                        size="small"
                        items={[
                            {
                                key: 'thong tin chi tiet',
                                label: 'Thông tin chi tiết',
                                children: (
                                    <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                                        {itemsDetailed.map((item) =>
                                            cloneElement(item, {
                                                ...formItemLayoutDetailed,
                                                key: uniqueId(),
                                            })
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default DetailProduct
