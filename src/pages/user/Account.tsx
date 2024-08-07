import { useAuth, useMessage } from '@/hooks'
import { User } from '@/http/authApi'
import fileApi from '@/http/fileApi'
import shopApi from '@/http/shopApi'
import { convertVietNameseToSlug } from '@/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Form, Input, Spin, Upload, message } from 'antd'
import { useEffect, useState } from 'react'

const formItemLayout = {
    labelCol: {
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
    formItemLayout: 'vertical',
}

const Account = () => {
    const { user, fetchUser } = useAuth()
    const [form] = Form.useForm<User>()
    const [image, setImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const { loading, success, error } = useMessage()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleOnSubmit = async (values: User) => {
        setIsSubmitting(true)
        try {
            loading('Đang cập nhật')
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('slug', values.slug)
            formData.append('phone', values.phone || '')
            if (imageFile) {
                formData.append('image', imageFile)
            }

            const res = await shopApi.updateWithFile(user.id, formData)
            console.log(res)
            await fetchUser()
            success('Cập nhật thành công')
        } catch (e) {
            console.log(e)
            error('Cập nhật thất bại')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                id: user.id,
                name: user.name,
                email: user.email,
                slug: user.slug,
                phone: user?.phone,
            })
            setImage(user.image)
        }
    }, [user])

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <div className="p-2 border-b-[1px] mb-4">
                <p className="text-2xl font-semibold">Hồ sơ của tôi</p>
                <p className="text-sm text-gray-600">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
            </div>
            <Form {...formItemLayout} form={form} onFinish={handleOnSubmit}>
                <div className="flex w-full">
                    <div className="w-2/3 pr-4">
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="name" label="Họ tên" required>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            required
                            rules={[
                                {
                                    validator: (_, value) => {
                                        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
                                        if (!value)
                                            return Promise.reject(
                                                new Error('slug không được để trống')
                                            )
                                        if (!slugPattern.test(value))
                                            return Promise.reject(
                                                new Error(
                                                    'slug không hợp lệ, chỉ chứa chữ thường và số, dấu gạch ngang'
                                                )
                                            )
                                        return Promise.resolve()
                                    },
                                },
                            ]}
                            extra={
                                <div>
                                    Slug là đường dẫn hiển thị trên trình duyệt. Nó phải là duy nhất
                                    và chỉ chứa các chữ cái, số và dấu gạch ngang.
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            form.setFields([
                                                {
                                                    name: 'slug',
                                                    value: convertVietNameseToSlug(
                                                        form.getFieldValue('name')
                                                    ),
                                                    errors: [],
                                                },
                                            ])
                                        }
                                    >
                                        Generate by name
                                    </Button>
                                </div>
                            }
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email" required>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại" required>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
                            <img
                                src={image || ''}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="mt-2">
                            <Button
                                type="primary"
                                onClick={() => {
                                    document.getElementById('imageUpload')?.click()
                                }}
                            >
                                Thay đổi ảnh
                            </Button>
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Dụng lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG
                        </p>
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        Lưu
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default Account
