import ExtraQuestion from '@/components/ExtraQuestion'
import { useAuth, useMessage } from '@/hooks'
import discountApi, { DiscountRequest } from '@/http/discountApi'
import { ErrorInfoForm } from '@/types/customType'
import { dateFormat, DiscountPriceType } from '@/utils/constants'
import { Button, Collapse, DatePicker, Form, Input, Radio, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaShopify } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'

const initDiscount: DiscountRequest = {
    name: '',
    code: '',
    type: 'FIXED_AMOUNT',
    value: 0,
    totalCount: 1,
    minOrderValue: 0,
    countUserUseDiscount: 1,
    status: true,
    isDeleted: false,
    dateStart: '',
    dateEnd: '',
}

const formItemLayout = {
    labelCol: { sm: { span: 6 } },
    wrapperCol: {},
    formItemLayout: 'vertical',
}

const DetailDiscount = ({ isAdd = false }: { isAdd: boolean }) => {
    const { id } = useParams()
    const [form] = useForm<DiscountRequest>()
    const {
        user: { email },
    } = useAuth()
    const { success, loading, error } = useMessage()

    const [code, setCode] = useState(form.getFieldValue('code') || '')
    const [type, setType] = useState(form.getFieldValue('type') || 'FIXED_AMOUNT')

    useEffect(() => {
        if (!isAdd && id) {
            ;(async () => {
                const data = await discountApi.getDiscountById(id)
                const discount = {
                    ...data,
                    code: data.code.substring(4),
                    dateStart: moment(data.dateStart, dateFormat),
                    dateEnd: moment(data.dateEnd, dateFormat),
                }
                console.log('data', discount)

                form.setFieldsValue(discount as DiscountRequest)
                setCode(discount.code)
                setType(data.type)
            })()
        }
    }, [id])

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

    const handleSubmit = async (values: DiscountRequest) => {
        const dateStart = form.getFieldValue('dateStart')
        const dateEnd = form.getFieldValue('dateEnd')

        const newData = {
            ...values,
            type,
            code: email.substring(0, 4).toLocaleUpperCase() + code,
            dateStart: dateStart.format(dateFormat),
            dateEnd: dateEnd.format(dateFormat),
        }

        console.log('values', newData)

        if (isAdd) {
            try {
                loading('Đang thêm mới voucher')
                const res = await discountApi.addDiscount(newData)
                console.log('res', res)
                success('Thêm mới voucher thành công')
            } catch (e) {
                console.log('error', e)
                error(e as string)
            }
        } else {
            const res = await discountApi.updateDiscount(newData)
            console.log('res', res)
        }
    }

    const handleChangeValues = (
        changedValues: Partial<DiscountRequest>,
        allValues: DiscountRequest
    ) => {
        console.log('changedValues', changedValues)
        console.log('allValues', allValues)

        const { code } = changedValues

        if (code) {
            const codeUpper = code.toUpperCase().slice(0, 4)
            setCode(codeUpper)
            form.setFieldsValue({ code: codeUpper })
        }
    }

    const validate = {
        dateStart: (_: any, value: any) => {
            if (!value) return Promise.reject(new Error('Ô không được để trống'))

            const dateEnd = form.getFieldValue('dateEnd')
            if (dateEnd && value > dateEnd)
                return Promise.reject(new Error('Ngày bắt đầu không được lớn hơn ngày kết thúc'))

            return Promise.resolve()
        },

        dateEnd: (_: any, value: any) => {
            if (!value) return Promise.reject(new Error('Ô không được để trống'))

            const dateStart = form.getFieldValue('dateStart')
            if (dateStart && value < dateStart)
                return Promise.reject(new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu'))

            return Promise.resolve()
        },
    }

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
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Required' }]}
                        extra="Tên Voucher sẽ không được hiển thị cho Người mua"
                    >
                        <Input count={{ max: 100, show: true }} />
                    </Form.Item>
                    <Form.Item
                        label="Mã"
                        name="code"
                        rules={[{ required: true, message: 'Required' }]}
                        extra={`Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5 kí tự. Mã giảm giá đầy đủ là: ${email
                            .substring(0, 4)
                            .toLocaleUpperCase()}${code}`}
                    >
                        <Input
                            count={{ show: true, max: 5 }}
                            addonBefore={email.substring(0, 4).toLocaleUpperCase()}
                            disabled={!isAdd}
                        />
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
                </>
            ),
        },
    ]
    const itemsCodeDiscount = [
        {
            key: 'itemsCodeDiscount',
            label: 'Thiết lập mã giảm giá',
            children: (
                <div className="">
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
                                />
                                // </Form.Item>
                            }
                            suffix={
                                <span className="">{type === 'FIXED_AMOUNT' ? 'đ' : '%GIẢM'}</span>
                            }
                            disabled={!isAdd}
                        />
                    </Form.Item>
                    <Form.Item label="Giá trị đơn hàng tối thiểu" name="minOrderValue">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tổng lượt sử dụng tối đa"
                        name="totalCount"
                        extra="Tổng số Mã giảm giá có thể sử dụng"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Luợt sử dụng tối đa của 1 người"
                        name="countUserUseDiscount"
                        extra="1 người sử dụng được tối đa mã giảm giá"
                    >
                        <Input disabled={!isAdd} />
                    </Form.Item>
                </div>
            ),
        },
    ]

    const itemsDetail = [
        {
            key: 'itemsDetail',
            label: 'Hiển thị mã giảm giá và các sản phẩm áp dụng',
            children: (
                <div className="">
                    <Form.Item label="Thiết lập hiển thị">
                        <Radio.Group className="space-y-4" defaultValue={'a'}>
                            <Radio value="a">
                                <ExtraQuestion
                                    title="Hiển thị nhiều nơi"
                                    tooltip="Voucher sẽ được hiển thị tự động trên trang chủ của Shop, trang chi tiết sản phẩm, trang thông tin giỏ hàng, Shopee Live và Shopee Feed."
                                />
                            </Radio>
                            <Radio value="b" className="flex">
                                <ExtraQuestion
                                    title="Chia sẽ thông qua mã voucher"
                                    tooltip="Voucher toàn shop được lưu thông qua mã Voucher sẽ được ghi nhận là Voucher Riêng tư"
                                />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Sản phẩm được áp dụng"
                        extra={
                            <>
                                Những sản phẩm bị hạn chế chạy khuyến mại theo quy định của Nhà nước
                                sẽ không được hiển thị nếu nằm trong danh sách sản phẩm đã chọn.
                                <Button type="link">Tìm hiểu thêm</Button>
                            </>
                        }
                    >
                        Tất cả sản phẩm
                    </Form.Item>
                </div>
            ),
        },
    ]

    return (
        <>
            <div className="w-full flex space-x-5">
                <Form
                    {...formItemLayout}
                    // layout="vertical"
                    name="dynamic_form_item"
                    form={form}
                    variant="filled"
                    initialValues={initDiscount}
                    onFinish={handleSubmit}
                    onFinishFailed={handleSubmitFailed}
                    onValuesChange={handleChangeValues}
                    // className="grid grid-cols-3 gap-5"
                >
                    <div className="space-y-8 w-full">
                        <Collapse
                            defaultActiveKey={['itemsGeneral']}
                            size="small"
                            items={itemsGeneral}
                        />
                        <Collapse
                            defaultActiveKey={['itemsCodeDiscount']}
                            size="small"
                            items={itemsCodeDiscount}
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
                <div className="sticky top-[3.5rem] right-0 w-2/5 h-[400px]">
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
export default DetailDiscount
