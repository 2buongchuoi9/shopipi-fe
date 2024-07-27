import { useAuth, useMessage } from '@/hooks'
import { Address } from '@/http'
import shopApi from '@/http/shopApi'
import { District, ErrorInfoForm } from '@/types/customType'
import { Button, Checkbox, Form, Input, Modal, Radio, Select } from 'antd'
import { useEffect, useState } from 'react'
import districts from '../../public/address/district.json'
import province from '../../public/address/province.json'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import ModalAddress from './ModalAddress'

type Props = {
    open: boolean
    onCancel: () => void
    onOk: (address: Address) => void
}

const ModalSelectedAddress = ({ open, onCancel, onOk }: Props) => {
    const {
        user: { address },
        fetchUser,
    } = useAuth()
    const [selectAddress, setSelectAddress] = useState<Address | null>(
        address?.find((item) => item.isDefault) || null
    )
    const [selectAddressEdit, setSelectAddressEdit] = useState<Address | null>(null)
    const [index, setIndex] = useState<number | null>(null)
    const { loading, success } = useMessage()
    const [openAddress, setOpenAddress] = useState(false)

    return (
        <div>
            <ModalAddress
                open={openAddress}
                onCancel={() => setOpenAddress(false)}
                onSuccess={async () => await fetchUser()}
                address={selectAddressEdit}
                index={index}
            />
            <Modal open={open} onCancel={onCancel} title="Địa chỉ">
                <div>
                    {address &&
                        address.map((item, i) => (
                            <div key={i} className="bg-white flex justify-between p-2">
                                <div className="flex items-center">
                                    <Radio value={item}></Radio>
                                    <div>
                                        <p className="flex">
                                            {item.name?.toLocaleUpperCase()}{' '}
                                            {item.isDefault && (
                                                <div className="flex items-center text-green-500">
                                                    <AiOutlineCheckCircle className="mr-2" />
                                                    <span>Địa chỉ mặc định</span>
                                                </div>
                                            )}
                                        </p>
                                        <p>
                                            địa chỉ: {item.province}, {item.district},{' '}
                                            {item.address}
                                        </p>
                                        <p>điện thoại: {item.phone}</p>
                                    </div>
                                    <div className="space-y-2 ">
                                        <div className="">
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    setIndex(i)
                                                    setSelectAddressEdit(item)
                                                    setOpenAddress(true)
                                                }}
                                            >
                                                chỉnh sửa
                                            </Button>
                                            {!item.isDefault && (
                                                <Button
                                                    danger
                                                    onClick={async () => {
                                                        loading('Đang xóa')
                                                        await shopApi.deleteAddress(i)
                                                        await fetchUser()
                                                        success('Xóa thành công')
                                                    }}
                                                >
                                                    xóa
                                                </Button>
                                            )}
                                        </div>
                                        {!item.isDefault && (
                                            <Button
                                                onClick={async () => {
                                                    loading('đang cập nhật')
                                                    await shopApi.updateAddress(i, {
                                                        ...item,
                                                        isDefault: true,
                                                    })
                                                    await fetchUser()
                                                    success('cập nhật thành công')
                                                }}
                                            >
                                                đặt làm mặc định
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </Modal>
        </div>
    )
}
export default ModalSelectedAddress
