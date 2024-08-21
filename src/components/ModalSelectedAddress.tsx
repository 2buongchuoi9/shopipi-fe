import React from 'react';
import { Modal, Button } from 'antd';
import useUser from '../hooks/useUser';
import shopApi, { Address } from '../http/shopApi';
import '../assets/style/ModalSelectedAddress.css';



type ModalSelectedAddressProps = {
    visible: boolean;
    onClose: () => void;
};

const ModalSelectedAddress: React.FC<ModalSelectedAddressProps> = ({ visible, onClose }) => {
    const { user, fetchUser } = useUser();

    const renderAddressCard = (address: Address, index: number) => (
        <div key={index} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            <div className="address-details">
                <p className="address-name">{address.name}</p>
                <p className="address-text">
                    {address.address}, {address.district}, {address.province}
                </p>
                <p className="address-phone">{address.phone}</p>
            </div>
            <div className="address-actions">
                <Button
                    type="primary"
                    onClick={async () => {
                        // handle edit address
                    }}
                >
                    Chỉnh sửa
                </Button>
                <Button
                    danger
                    onClick={async () => {
                        await shopApi.deleteAddress(index);
                        await fetchUser();
                    }}
                >
                    Xóa
                </Button>
                {!address.isDefault && (
                    <Button
                        onClick={async () => {
                            await shopApi.updateAddress(index, {
                                ...address,
                                isDefault: true,
                            });
                            await fetchUser();
                        }}
                    >
                        Đặt làm mặc định
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            title="Địa chỉ của bạn"
            className="address-modal"
        >
           <div className="address-list">
                {user.address?.map(renderAddressCard)}
            </div>

        </Modal>
    );
};

export default ModalSelectedAddress;
