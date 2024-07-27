import { useAuth, useMessage } from '@/hooks'
import { User } from '@/http/authApi'
import fileApi from '@/http/fileApi'
import shopApi from '@/http/shopApi'
import { convertVietNameseToSlug } from '@/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Form, Input, Spin, Upload } from 'antd'
import { useEffect, useState } from 'react'

const formItemLayout = {
    labelCol: {
        // xs: {
        //     span: 24,
        // },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
    formItemLayout: 'vertical',
}

const Account = () => {
    const { user, fetchUser } = useAuth()
    const [form] = Form.useForm<User>()
    const [image, setImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const { loading, success } = useMessage()

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        // try {
        //     setLoading(true)
        //     if (
        //         image?.startsWith(
        //             'http://res.cloudinary.com/anhdaden/image/upload/' ||
        //                 'https://res.cloudinary.com/anhdaden/image/upload/'
        //         )
        //     )
        //         await fileApi.deleteByUrl(image)

        //     if (!file) return
        //     const formData = new FormData()
        //     formData.append('file', file as Blob)
        //     const { url } = await fileApi.uploadImage(formData)
        //     setImage(url)
        // } catch (e) {}
        // setLoading(false)

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
        } catch (e) {
            console.log(e)
        }
        success('Cập nhật thành công')
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
        <div className="w-full  bg-white">
            <div className="p-2 border-b-[1px]">
                <p className="text-xl">Hồ sơ của tôi</p>
                <p className="text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <Form {...formItemLayout} form={form} onFinish={handleOnSubmit}>
                <div className="flex w-full">
                    <div className="w-2/3">
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
                        <Form.Item name="email" label="email" required>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại" required>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full">
                            <img
                                src={image || ''}
                                alt="avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="mt-2">
                            <Button
                                className=""
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
                        <p className="">Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG</p>
                    </div>
                </div>
                <div className="border-[1px] rounded-lg bg-white  flex justify-end mt-5 sticky bottom-0 right-0 p-4">
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </div>
            </Form>
        </div>
    )
}
export default Account
