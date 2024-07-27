import ModalAddress from '@/components/ModalAddress'
import { useAuth, useMessage } from '@/hooks'
import { Address } from '@/http'
import shopApi from '@/http/shopApi'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { FaPlus } from 'react-icons/fa'

const AddressComponent = () => {
    const { user, fetchUser } = useAuth()
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState<number | null>(null)
    const [address, setAddress] = useState<Address[]>([])
    const [selectAddress, setSelectAddress] = useState<Address | null>(null)
    const { loading, success } = useMessage()

    useEffect(() => {
        if (user) {
            setAddress(user?.address || [])
        }
    }, [user])

    return (
        <>
            <ModalAddress
                open={open}
                onCancel={() => setOpen(false)}
                onSuccess={async () => {
                    setOpen(false)
                    await fetchUser()
                }}
                address={selectAddress}
                index={index}
            />
            <div>
                <div className="space-y-3 ">
                    <Button block type="dashed" icon={<FaPlus />} onClick={() => setOpen(true)}>
                        Thêm địa chỉ mới
                    </Button>

                    {address.map((item, i) => (
                        <div key={i} className="bg-white flex justify-between p-2">
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
                                    địa chỉ: {item.province}, {item.district}, {item.address}
                                </p>
                                <p>điện thoại: {item.phone}</p>
                            </div>
                            <div className="space-y-2 ">
                                <div className="">
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            setIndex(i)
                                            setSelectAddress(item)
                                            setOpen(true)
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
                    ))}
                </div>
            </div>
        </>
    )
}
export default AddressComponent
