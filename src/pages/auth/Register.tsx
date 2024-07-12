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

    console.log('redirect', redirect)

    const [isSubmitting, setSubmitting] = useState(false)
    const [alert, setAlert] = useState<AlertType>({ open: false, message: '', type: 'info' })
    const { success, error: err } = useMessage()

    const handleSubmit = async (values: any) => {
        setSubmitting(true)
        try {
            console.log('values', values)
            // setSubmitting(true)
            const data = await authApi.register(values)
            console.log('aaaaa', data)
            success('Đăng nhập thành công')

            clientId.set(data.user.id)
            accessToken.set(data.token.accessToken)
            refreshTokenStorage.set(data.token.refreshToken)
            await fetchUser()
            await fetchCart()

            navigate(redirect ?? '/')
        } catch (e) {
            console.log('error', e)
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
            // offsetTop: 100,
        })
        err(errorFields[0].errors[0])
    }
    return (
        <div className="relative">
            {alert.open && (
                <Alert
                    className="mb-5 sticky top-[43px] z-20 "
                    message={alert?.message}
                    type={alert?.type ?? 'error'}
                    showIcon
                    closable
                    onClose={() => setAlert({ open: false, message: '', type: 'error' })}
                />
            )}

            <div className="w-1/3 mx-auto pt-10">
                <Form onFinish={handleSubmit} onFinishFailed={onFinishFailed} layout="inline">
                    <div className="mb-10 flex justify-center text-base">
                        <img src="/logo.png" className="h-[50px]" alt="" />
                    </div>
                    <div className="space-y-5 px-5 py-5  rounded-md shadow-slate-700 shadow-lg">
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
                            <Input size="large" placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: 'Mật khẩu không được trống',
                                },
                            ]}
                        >
                            <Input.Password
                                id="password"
                                size="large"
                                name="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            dependencies={['password']}
                            name="ConfirmPassword"
                            label="Confirm password"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: 'Mật khẩu không được trống',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'Mật khẩu không trùng khớp, vui lòng kiểm tra lại'
                                            )
                                        )
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                id="password"
                                size="large"
                                name="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Name không được trống' }]}
                        >
                            <Input size="large" placeholder="Email" />
                        </Form.Item>

                        <Button
                            htmlType="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            typeof="submit"
                            size="large"
                            type="primary"
                            block
                            className="text-white-400  bg-blue-400"
                        >
                            Đăng ký
                        </Button>
                        <Link to={google_url_login}>đăng nhập bằng google</Link>
                        <Link to={facebook_url_login}>đăng nhập bằng facebook</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}
export default Register
