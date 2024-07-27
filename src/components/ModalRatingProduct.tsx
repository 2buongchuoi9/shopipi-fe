import { useMessage } from '@/hooks'
import { Product, Variant } from '@/http'
import ratingApi, { RatingRequest } from '@/http/ratingApi'
import { ErrorInfoForm } from '@/types/customType'
import { Button, Form, Input, Modal, Rate, Upload, UploadFile, UploadProps } from 'antd'
import { useState } from 'react'
import { PiPlusSquare } from 'react-icons/pi'

type Props = {
    product: Product
    variant: Variant
    open: boolean
    onCancel: () => void
}

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        {/* <PiPlusSquare /> */}
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
)
const initialValues: RatingRequest = {
    comment: '',
    isComment: false,
    images: [],
    parentId: null,
    productId: '',
    value: 1,
    variantId: '',
}

const ModalRatingProduct = ({ open, onCancel, product, variant }: Props) => {
    const [form] = Form.useForm<RatingRequest>()
    const [fileList, setFileList] = useState<File[]>([])
    const { loading, success } = useMessage()

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        console.log('newFileList', newFileList)
        setFileList(newFileList.map((file) => file.originFileObj as File))
    }

    const handleSubmit = async (values: any) => {
        try {
            loading('Đang cập nhật')
            const formData = new FormData()
            formData.append('productId', product.id)
            formData.append('variantId', variant.id)
            formData.append('value', values.value)
            formData.append('comment', values.comment)
            if (fileList.length > 0) {
                fileList.forEach((file) => {
                    formData.append('images', file)
                })
            }

            const res = await ratingApi.addRatingWithFile(formData)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
        success('Cập nhật thành công')
    }

    const onFinishFailed = (errorPassword: ErrorInfoForm) => {
        const { errorFields } = errorPassword
        form.scrollToField(errorFields[0].name[0], {
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
            // offsetTop: 100,
        })
        // err(errorFields[0].errors[0])
    }

    return (
        <>
            {/* <Button
                type="primary"
                className="mb-4"
                onClick={async () => {
                    const res = await ratingApi.addRating({
                        comment:
                            'Sản phẩm k giống hình, dáng quần thực sự quá xấu, k có túi bên, khoá giả, túm lại la thất vọng',
                        isComment: false,
                        images: [
                            'http://res.cloudinary.com/anhdaden/image/upload/v1719726212/shopipi_fpt/mz8ipsummrpstz3rrmol.jpg',
                        ],
                        parentId: null,
                        productId: '',
                        value: 1,
                        variantId: '',
                    })
                    console.log('Rating:', res)
                    // success('Rating success')
                }}
            >
                test rate
            </Button> */}

            <Modal
                title="Đánh giá sản phẩm"
                open={open}
                onCancel={() => {
                    form.resetFields()
                    setFileList([])
                    onCancel()
                }}
                onOk={form.submit}
                okText="Gửi đánh giá"
                okButtonProps={{ onClick: form.submit }}
            >
                <div className="flex items-center space-x-2 py-2">
                    <img src={product.thumb} alt="" className="w-14 h-14 object-cover" />
                    <div className="">
                        <p>{product.name}</p>
                        <p className="text-gray-500 text-sm">
                            phân loại hàng: {variant.valueVariant.map((v) => v.value).join(' ')}
                        </p>
                        <span className="space-x-2">
                            <span className="line-through text-gray-400">
                                {variant.price?.vnd()}
                            </span>
                            <span className="text-green-600 font-semibold">
                                {variant.priceSale?.vnd()}
                            </span>
                        </span>
                    </div>
                </div>
                <Form
                    form={form}
                    initialValues={initialValues}
                    layout="vertical"
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Đánh giá" name="value">
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        required
                        name="comment"
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung không được để trống',
                            },
                            {
                                min: 10,
                                message: 'Nội dung phải dài hơn 10 kí tự',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Hình ảnh">
                        <Upload
                            listType="picture-card"
                            accept="image/*"
                            onChange={handleChange}
                            beforeUpload={() => false}
                            onPreview={() => {}}
                        >
                            {fileList.length < 3 ? uploadButton : null}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default ModalRatingProduct
