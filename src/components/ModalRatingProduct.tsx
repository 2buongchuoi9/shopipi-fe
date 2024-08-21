
import { useMessage } from '@/hooks'
import { Product, Variant } from '@/http'
import ratingApi, { RatingRequest } from '@/http/ratingApi'
import { ErrorInfoForm } from '@/types/customType'
import { Button, Form, Input, Modal, Rate, Upload, UploadFile, UploadProps, Tooltip, Spin } from 'antd'
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
        <PiPlusSquare style={{ fontSize: '24px', color: '#1890ff' }} />
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

const ratingDescriptions = ['Very Bad', 'Bad', 'Okay', 'Good', 'Excellent']

const ModalRatingProduct = ({ open, onCancel, product, variant }: Props) => {
    const [form] = Form.useForm<RatingRequest>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [loading, setLoading] = useState(false)
    const [charCount, setCharCount] = useState(0)

    const handleCharCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length)
    }

    const handleFinish = async (values: RatingRequest) => {
        if (!values.comment) {
            if (!window.confirm('Are you sure you want to give this rating?')) {
                return
            }
        }
        setLoading(true)
        try {
            // Submit the form here
            await ratingApi.addRating(values)
            form.resetFields()
            setFileList([])
            setCharCount(0)
            onCancel()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title="Đánh giá sản phẩm"
            bodyStyle={{ padding: '24px' }}
            style={{ borderRadius: '8px', overflow: 'hidden' }}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    initialValues={initialValues}
                    onFinish={handleFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="value"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Please select a rating' }]}
                    >
                        <Rate
                            tooltips={ratingDescriptions}
                            style={{ fontSize: '24px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Please enter your comment' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            onChange={handleCharCount}
                            maxLength={500}
                        />
                    </Form.Item>
                    <div style={{ textAlign: 'right', marginBottom: '16px', color: '#999' }}>
                        {charCount}/500
                    </div>

                    <Form.Item
                        name="images"
                        label="Hình ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUpload}
                            beforeUpload={() => false} // Disable automatic upload
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Gửi đánh giá
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}

export default ModalRatingProduct
