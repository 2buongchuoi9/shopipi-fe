import { useAuth, useCart, useMessage } from '@/hooks'
import authApi from '@/http/authApi'
import { AlertType, ErrorInfoForm } from '@/types/customType'
import { facebook_url_login, google_url_login } from '@/utils'
import { accessToken, clientId, refreshTokenStorage } from '@/utils/localStorageUtils'
import { Alert, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const Register = () => {
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') ?? '/'
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const { fetchUser } = useAuth()
    const { fetchCart } = useCart()

    const [isSubmitting, setSubmitting] = useState(false)
    const [alert, setAlert] = useState<AlertType>({ open: false, message: '', type: 'info' })
    const { success, error: err } = useMessage()

    const handleSubmit = async (values: any) => {
        setSubmitting(true)
        try {
            const data = await authApi.register(values)
            success('Đăng nhập thành công')

            clientId.set(data.user.id)
            accessToken.set(data.token.accessToken)
            refreshTokenStorage.set(data.token.refreshToken)
            await fetchUser()
            await fetchCart()

            navigate(redirect ?? '/')
        } catch (e) {
            err('Đăng nhập thất bại')
        } finally {
            setSubmitting(false)
        }
    }

    const onFinishFailed = (errorProduct: ErrorInfoForm) => {
        const { errorFields } = errorProduct
        form.scrollToField(errorFields[0].name[0], {
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        })
        err(errorFields[0].errors[0])
    }

    return (
        <div className="relative p-10 flex items-center justify-center bg-gray-50">
            {alert.open && (
                <Alert
                    className="mb-5 sticky top-[43px] z-20"
                    message={alert?.message}
                    type={alert?.type ?? 'error'}
                    showIcon
                    closable
                    onClose={() => setAlert({ open: false, message: '', type: 'error' })}
                />
            )}
            <div className="w-full max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
                <div className="text-center mb-10">
                    <img src="/logo.png" className="h-12 mx-auto" alt="Logo" />
                </div>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Email không được trống' },
                            {
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email không đúng định dạng',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Name không được trống' }]}
                    >
                        <Input size="large" placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        required
                        rules={[{ required: true, message: 'Mật khẩu không được trống' }]}
                    >
                        <Input.Password size="large" placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Mật khẩu không được trống' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error('Mật khẩu không trùng khớp, vui lòng kiểm tra lại')
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Địa chỉ không được trống' }]}
                    >
                        <Input size="large" placeholder="Address" />
                    </Form.Item>

                    <div className="flex space-x-4 mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isSubmitting}
                            className="w-full"
                        >
                            Đăng ký
                        </Button>
                        <Button
                            size="large"
                            onClick={() => navigate(`/login?redirect=${redirect}`)}
                            className="w-full"
                        >
                            Đăng nhập
                        </Button>
                    </div>

                    <div className="flex justify-between mt-6">
                        <Link
                            to={google_url_login}
                            className="w-1/2 mr-2 px-4 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-100"
                        >
                            Đăng nhập bằng Google
                        </Link>
                        <Link
                            to={facebook_url_login}
                            className="w-1/2 ml-2 px-4 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-100"
                        >
                            Đăng nhập bằng Facebook
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Register
