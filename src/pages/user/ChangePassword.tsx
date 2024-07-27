import { useMessage } from '@/hooks'
import shopApi from '@/http/shopApi'
import { ErrorInfoForm } from '@/types/customType'
import { Button, Form, Input } from 'antd'
import { useState } from 'react'

const ChangePassword = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const { success, error: err } = useMessage()

    const handleSubmit = async (values: any) => {
        setLoading(true)

        try {
            const res = await shopApi.changePassword(values)
            setLoading(false)
            success('success')
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
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
        <div className=" bg-white">
            <p className="text-xl p-3">Đổi mật khẩu</p>
            <div className=" p-3 w-[25rem] mx-auto border-[1px] rounded-lg">
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    className="mt-6"
                    layout="vertical"
                >
                    <Form.Item
                        name="password"
                        required
                        hasFeedback
                        label="Mật khẩu cũ"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="Old password" />
                    </Form.Item>
                    <Form.Item
                        name="passwordNew"
                        required
                        hasFeedback
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="new password" />
                    </Form.Item>
                    <Form.Item
                        name="passwordNewConfirm"
                        required
                        hasFeedback
                        label="Xác nhận mật khẩu mới"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="confirm password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    )
}
export default ChangePassword
