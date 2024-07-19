import ExtraQuestion from '@/components/ExtraQuestion'
import { useAuth, useMessage } from '@/hooks'
import discountApi, { DiscountRequest } from '@/http/discountApi'
import saleApi, { Sale, SaleRequest } from '@/http/saleApi'
import { ErrorInfoForm } from '@/types/customType'
import { dateFormat, DiscountPriceType } from '@/utils/constants'
import { Button, Collapse, DatePicker, Form, Input, Radio, Select, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaShopify } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'
import ModalSelectProduct from '../ModalSelectProduct'
import { Product } from '@/http'
import { ColumnsType } from 'antd/es/table'
import productApi from '@/http/productApi'
import { MdCancel } from 'react-icons/md'

const initSale: SaleRequest = {
    id: '',
    name: '',
    productIds: [],
    type: 'FIXED_AMOUNT',
    value: 0,
    dateStart: '',
    dateEnd: '',
    shopId: '',
}

const formItemLayout = {
    labelCol: { sm: { span: 6 } },
    wrapperCol: {},
    formItemLayout: 'vertical',
}

const DetailSale = ({ isAdd = false }: { isAdd: boolean }) => {
    const { id } = useParams()
    const [form] = useForm<SaleRequest>()
    const { user } = useAuth()
    const { success, loading, error } = useMessage()
    const [isAll, setIsAll] = useState(false)
    const [open, setOpen] = useState(false)
    const [type, setType] = useState(form.getFieldValue('type') || 'FIXED_AMOUNT')
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        if (!isAdd && id) {
            ;(async () => {
                const data = await saleApi.getById(id)

                const products = await Promise.all(
                    data.productIds.map(async (id) => await productApi.findById(id))
                )
                console.log('products', products)

                setProducts(products)

                const discount = {
                    ...data,
                    dateStart: moment(data.dateStart, dateFormat),
                    dateEnd: moment(data.dateEnd, dateFormat),
                }
                console.log('data', discount)

                form.setFieldsValue(discount as SaleRequest)
                setType(data.type)
            })()
        }
    }, [id])

    useEffect(() => {
        // call api to get list product
        ;(async () => {
            if (user.id && isAll) {
                const data = await productApi.getAll({ limit: 1000, shopId: user.id })
                const products = data.content
                    .filter((item) => item.variants.length > 0 && item.state === 'ACTIVE')
                    .map((item) => ({ ...item, key: item.id }))

                setProducts(products)
            }
        })()
    }, [user.id, isAll])

    const handleSubmitFailed = (errorInfo: ErrorInfoForm) => {
        console.log('errorInfo', errorInfo)

        const { errorFields } = errorInfo
        form.scrollToField(errorFields[0].name[0], {
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
            // offsetTop: 100,
        })
        // error(errorFields[0].errors[0])
    }

    const handleSubmit = async (values: SaleRequest) => {
        if (products.length === 0) return error('Vui lòng chọn sản phẩm')

        const dateStart = form.getFieldValue('dateStart')
        const dateEnd = form.getFieldValue('dateEnd')

        if (!user.id) return error('Không tìm thấy shop id')

        const newData = {
            ...values,
            type,
            dateStart: dateStart.format(dateFormat),
            dateEnd: dateEnd.format(dateFormat),
            productIds: products.map((item) => item.id),
            shopId: user.id,
        }

        console.log('values', newData)

        if (isAdd) {
            try {
                loading('Đang thêm mới voucher')
                delete newData.id
                const res = await saleApi.addSale(newData)
                console.log('res', res)
                success('Thêm mới voucher thành công')
            } catch (e) {
                console.log('error', e)
                error(e as string)
            }
        } else {
            try {
                loading('Đang thêm mới voucher')
                const res = await saleApi.updateSale(form.getFieldValue('id'), newData)
                console.log('res', res)
                success('update voucher thành công')
            } catch (e) {
                console.log('error', e)
                error(e as string)
            }
        }
    }

    const handleChangeValues = (changedValues: Partial<SaleRequest>, allValues: SaleRequest) => {
        console.log('changedValues', changedValues)
        console.log('allValues', allValues)
    }

    const validate = {
        dateStart: (_: any, value: any) => {
            if (!value) return Promise.reject(new Error('Ô không được để trống'))

            const dateEnd = form.getFieldValue('endDate')
            if (dateEnd && value > dateEnd)
                return Promise.reject(new Error('Ngày bắt đầu không được lớn hơn ngày kết thúc'))

            return Promise.resolve()
        },

        dateEnd: (_: any, value: any) => {
            if (!value) return Promise.reject(new Error('Ô không được để trống'))

            const dateStart = form.getFieldValue('startDate')
            if (dateStart && value < dateStart)
                return Promise.reject(new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu'))

            return Promise.resolve()
        },
    }

    const columns: ColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, { thumb }) => (
                <div className="flex items-center">
                    <img src={thumb} alt="" className="w-10 h-10 object-cover" />
                    <p className="ml-2">{text}</p>
                </div>
            ),
        },
        {
            title: 'Biến thể',
            dataIndex: 'quantity',
            key: 'quantity',
            hidden: type === 'sale',
            render: (text, { variants }) => <div>{variants.length} </div>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            hidden: type === 'inventory',
            render: (_, { variants }) => (
                <div>
                    {Math.min(...variants.map((item) => item.price))}đ -{' '}
                    {Math.max(...variants.map((item) => item.price))}đ
                </div>
            ),
        },
        {
            title: 'kho hàng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá nhập',
            dataIndex: 'id',
            key: 'id2',
            render: (_) => (
                <div
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                        // xóa sản phẩm khỏi danh sách nhập hàng
                        setProducts((prev) => prev.filter((p) => p.id !== _))
                    }}
                >
                    <MdCancel />
                </div>
            ),
        },
    ]

    const itemsGeneral = [
        {
            key: 'itemsGeneral',
            label: 'Thông tin cơ bản',
            children: (
                <>
                    {/* ẩn id, để dùng khi update product */}
                    <Form.Item label="ID" name="id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item label="Loại mã">
                        <div className="flex items-center w-52 space-x-2 p-3 rounded-xl border-[1px]">
                            <FaShopify className="text-blue-500" size={20} />
                            <p>Voucher toàn shop</p>
                        </div>
                        <Input hidden />
                    </Form.Item>
                    <Form.Item
                        label="Tên Khuyến mãi"
                        name="name"
                        rules={[{ required: true, message: 'Required' }]}
                        extra="Tên Voucher sẽ không được hiển thị cho Người mua"
                    >
                        <Input count={{ max: 100, show: true }} />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian bắt đầu"
                        name="dateStart"
                        hasFeedback
                        required
                        rules={[{ validator: validate.dateStart }]}
                    >
                        <DatePicker format={dateFormat} showTime inputReadOnly disabled={!isAdd} />
                    </Form.Item>
                    <Form.Item
                        label="Thời gian kết thúc"
                        name="dateEnd"
                        hasFeedback
                        required
                        rules={[{ validator: validate.dateEnd }]}
                    >
                        <DatePicker format={dateFormat} showTime inputReadOnly />
                    </Form.Item>
                    <Form.Item
                        label="Loại giảm giá | Mức giảm"
                        name="value"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input
                            type="number"
                            addonBefore={
                                // <Form.Item>
                                <Select
                                    options={Object.keys(DiscountPriceType).map((key) => ({
                                        key,
                                        label: DiscountPriceType[
                                            key as keyof typeof DiscountPriceType
                                        ],
                                        value: key,
                                    }))}
                                    value={type}
                                    style={{ width: 120 }}
                                    onChange={(value) => setType(value as string)}
                                    disabled={!isAdd}
                                />
                                // </Form.Item>
                            }
                            suffix={
                                <span className="">{type === 'FIXED_AMOUNT' ? 'đ' : '%GIẢM'}</span>
                            }
                            disabled={!isAdd}
                        />
                    </Form.Item>
                </>
            ),
        },
    ]

    const itemsDetail = [
        {
            key: 'itemsDetail',
            label: 'Hiển thị mã giảm giá và các sản phẩm áp dụng',
            children: (
                <div className="">
                    <Form.Item
                        label="Sản phẩm được áp dụng"
                        extra="sản phẩm phải đang hoạt động trạng thái cờ duyệt hoặc ẩn sẽ không được hiển thị"
                    >
                        <Radio.Group
                            className=""
                            value={isAll}
                            onChange={(e) => setIsAll(e.target.value)}
                        >
                            <Radio value={true}>Tất cả sản phẩm của Shop</Radio>
                            <Radio value={false} className="">
                                Sản phẩm cụ thể
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    {!isAll && (
                        <div>
                            <Button type="primary" onClick={() => setOpen(true)} className="mb-3">
                                chọn sản phẩm
                            </Button>
                        </div>
                    )}
                    {products.length > 0 && (
                        <Table columns={columns} dataSource={products} pagination={false} />
                    )}
                </div>
            ),
        },
    ]

    return (
        <>
            <ModalSelectProduct
                onCancel={() => setOpen(false)}
                open={open}
                type="sale"
                onSelectedProduct={(selectedProducts) => {
                    if (selectedProducts.length === 0) return
                    setProducts((prev) => {
                        const newProducts = selectedProducts.filter(
                            (product) => !prev.find((item) => item.id === product.id)
                        )
                        return [...prev, ...newProducts]
                    })
                    setOpen(false)
                }}
            />
            <div className="w-full flex space-x-5">
                <Form
                    {...formItemLayout}
                    // layout="vertical"
                    name="dynamic_form_item"
                    form={form}
                    variant="filled"
                    initialValues={initSale}
                    onFinish={handleSubmit}
                    onFinishFailed={handleSubmitFailed}
                    onValuesChange={handleChangeValues}
                    className="w-3/4"
                >
                    <div className="space-y-8 ">
                        <Collapse
                            defaultActiveKey={['itemsGeneral']}
                            size="small"
                            items={itemsGeneral}
                        />
                        <Collapse
                            defaultActiveKey={['itemsDetail']}
                            size="small"
                            items={itemsDetail}
                        />

                        <div className="sticky bottom-0 right-0 w-full flex justify-end border-[1px] rounded-xl p-3 bg-white">
                            <div className="space-x-5">
                                <Button>Hủy</Button>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
                <div className="sticky top-[3.5rem] right-0 w-1/4 h-[400px]">
                    <div className="border-[1px] rounded-lg space-y-3 bg-white py-5">
                        <p className="px-5">Xem trước</p>
                        <div className="h-[350px] overflow-hidden">
                            <img
                                src="https://deo.shopeemobile.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/multilang_voucher_illustration_vn.91c94ef.png"
                                alt=""
                            />
                        </div>
                        <p className="px-5">
                            Người mua có thể sử dụng voucher này cho tất cả sản phẩm của Shop
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DetailSale
