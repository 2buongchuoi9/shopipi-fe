import { useMessage } from '@/hooks'
import { Address } from '@/http'
import shopApi from '@/http/shopApi'
import { District, ErrorInfoForm } from '@/types/customType'
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import districts from '../../public/address/district.json'
import province from '../../public/address/province.json'

type Props = {
    open: boolean
    onCancel: () => void
    onSuccess: () => void
    address?: Address | null
    index?: number | null
}

const ModalAddress = ({ open, onCancel, onSuccess, address, index }: Props) => {
    const [form] = Form.useForm<Address>()
    const { success, error, loading } = useMessage()

    const [keyDistrict, setKeyDistrict] = useState<keyof District | null>(null)

    const handleSubmit = async (values: Address) => {
        if (address && index) {
            try {
                await shopApi.updateAddress(index as number, values)
                success('Cập nhật thành công')
                onSuccess()
            } catch (e) {
                error('Cập nhật thất bại')
            }
            return
        } else {
            try {
                await shopApi.addAddress(values)
                success('Thêm mới thành công')
                onSuccess()
            } catch (e) {
                error('Thêm mới thất bại')
            }
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
    useEffect(() => {
        if (address) {
            form.setFieldsValue(address)
        }
    }, [address])
    return (
        <div>
            <Modal
                open={open}
                onCancel={onCancel}
                title="Địa chỉ"
                footer={[
                    <div key={'1'} className="space-x-5">
                        <Button
                            onClick={() => {
                                form.resetFields()
                                onCancel()
                            }}
                            className="btn-cancel"
                        >
                            Hủy
                        </Button>
                        <Button type="primary" onClick={form.submit}>
                            {address ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>,
                ]}
            >
                <Form
                    onFinish={handleSubmit}
                    form={form}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 6 }}
                >
                    <Form.Item
                        label="Số điện thoại"
                        required
                        hasFeedback
                        name="phone"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="Phone" />
                    </Form.Item>
                    <Form.Item
                        label="Họ tên"
                        required
                        hasFeedback
                        name="name"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        label="Tỉnh thành"
                        required
                        hasFeedback
                        name="province"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Select
                            showSearch
                            options={province}
                            onChange={(_, options) => {
                                if (!Array.isArray(options)) {
                                    setKeyDistrict(options.key as keyof District)
                                    form.setFieldValue('district', null)
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Quận huyện"
                        required
                        hasFeedback
                        name="district"
                        tooltip={!form.getFieldValue('province') && 'chọn tỉnh thành trước'}
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Select
                            showSearch
                            // disabled={!form.getFieldValue('province')}
                            disabled={keyDistrict === null}
                            options={districts[keyDistrict as keyof typeof districts]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        required
                        hasFeedback
                        name="address"
                        rules={[{ required: true, message: 'Không được để trống' }]}
                    >
                        <Input placeholder="Address" />
                    </Form.Item>
                    <Form.Item name="isDefault" valuePropName="checked" required hasFeedback>
                        <Checkbox>Đặt làm mặc định</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default ModalAddress
