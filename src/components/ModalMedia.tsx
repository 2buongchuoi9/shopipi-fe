import {
    Button,
    Card,
    Descriptions,
    Image,
    Input,
    Layout,
    Pagination,
    Radio,
    Select,
    Space,
    Tabs,
    Tooltip,
    Typography,
    Upload,
    theme,
} from 'antd'
import Modal from 'antd/es/modal/Modal'
import { Fragment, ReactNode, memo, useContext, useEffect, useState } from 'react'
import { MdOutlineCloudUpload } from 'react-icons/md'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import video_icon from '@/assets/video_icon.svg'
import { UploadRequestOption, UploadRequestError } from 'rc-upload/lib/interface'

import dayjs from 'dayjs'
import fileApi, { File, MediaType, mediaType } from '@/http/fileApi'
import { useMessage } from '@/hooks'

dayjs().locale('vi')

const getItems = (key: string | number, label: ReactNode, children: ReactNode) => ({
    key,
    label,
    children,
})

const optionsTypeMedia = Object.keys(mediaType).map((key) => ({
    label: key,
    value: key,
}))

export type ActiveFieldMediaType = string | (string | number)[] | null

export type OnOkMediaProps = {
    activeField: ActiveFieldMediaType
    selectedFile: File | null
}

type Props = {
    isOpen: boolean
    activeField: ActiveFieldMediaType
    onOk: ({ activeField, selectedFile }: OnOkMediaProps) => void
    onReload?: () => void
    onCancel: () => void
    activeTap?: '1' | '2'
    typeMedia: MediaType
    isEdit?: boolean
}

/* onOk là hàm, tham số là object gồm activeField và selectedFile */
function ModalMedia({
    isOpen = false,
    activeField = null,
    onOk,
    onReload,
    onCancel,
    activeTap = '1',
    typeMedia = 'ALL',
    isEdit = true,
}: Props) {
    const { token } = theme.useToken()
    const { success, error } = useMessage()
    const [totalElement, setTotalElement] = useState(0)
    const [selectImage, setSelectImage] = useState<File | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [query, setQuery] = useState({
        page: 0,
        size: 100,
        sort: 'createdAt,desc',
        type: typeMedia,
    })
    const [whatUpload, setWhatUpload] = useState<MediaType>(mediaType.IMAGE)

    const [loadingDelete, setLoadingDelete] = useState(false)

    useEffect(() => {
        console.log('query', query)
    }, [query.type, query.page, query.size])

    const fetchApi = async () => {
        const data = await fileApi.get(query)
        setQuery((prev) => ({ ...prev, page: data.currentPage, size: data.pageSize }))
        setTotalElement(data.totalElement)
        setImages(data.content)
    }

    // fetch api when open modal
    useEffect(() => {
        if (isOpen) {
            fetchApi()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, query.page, query.size, query.type])

    // reset query when change typeMedia
    useEffect(() => {
        if (isOpen) {
            setQuery((prev) => ({ ...prev, type: typeMedia }))
            typeMedia !== 'ALL' && setWhatUpload(typeMedia)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    if (!isOpen) return null

    const handelUploadImage = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fileApi.uploadImage(formData)
            if (onSuccess) {
                onSuccess(res, new XMLHttpRequest()) // Gọi onSuccess với đối số đúng
            }
        } catch (err) {
            if (onError) {
                onError(err as UploadRequestError) // Gọi onError với đối số lỗi
            }
        }

        onReload && onReload()
    }

    return (
        <div>
            <Modal
                title="Media"
                open={isOpen}
                onOk={() => {
                    onOk({ activeField, selectedFile: selectImage })
                }}
                onCancel={onCancel}
                footer={
                    selectImage ? (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <Space>
                                    đã chọn
                                    <Image src={selectImage.url} style={{ height: '32px' }} />
                                </Space>
                            </div>
                            <Button
                                type="primary"
                                style={{ backgroundColor: token.colorPrimaryHover }}
                                onClick={() => onOk({ activeField, selectedFile: selectImage })}
                            >
                                Select file
                            </Button>
                        </div>
                    ) : null
                }
                width={1300}
                style={{
                    position: 'sticky',
                }}
            >
                <Tabs
                    // style={{ maxHeight: "600px", overflowY: "scroll" }}
                    type="card"
                    defaultActiveKey={activeTap}
                    items={[
                        {
                            label: 'chọn',
                            key: '1',
                            children: (
                                <Layout>
                                    <Content>
                                        <div style={{ overflowY: 'scroll', height: '500px' }}>
                                            <Select
                                                onChange={(value) =>
                                                    setQuery((prev) => ({ ...prev, type: value }))
                                                }
                                                className="w-44"
                                                value={query.type}
                                                defaultValue={query.type}
                                                options={optionsTypeMedia}
                                            />
                                            <ul className="flex justify-center flex-wrap ">
                                                {images &&
                                                    images.map((v) => (
                                                        <li
                                                            key={v.url}
                                                            onClick={() => setSelectImage(v)}
                                                            className={`m-3 border-2 rounded-lg overflow-hidden cursor-pointe drop-shadow-md relative ${
                                                                selectImage === v
                                                                    ? 'border-blue-600'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <RenderImage file={v} />
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <Pagination
                                            pageSize={query.size}
                                            current={query.page + 1}
                                            total={totalElement}
                                            showTotal={(total) => `total: ${total} items`}
                                            showSizeChanger={true}
                                            onShowSizeChange={(current, pageSize) =>
                                                setQuery((prev) => ({
                                                    ...prev,
                                                    page: 0,
                                                    size: pageSize,
                                                }))
                                            }
                                            onChange={(page, pageSize) =>
                                                setQuery((prev) => ({
                                                    ...prev,
                                                    page: page - 1,
                                                    size: pageSize,
                                                }))
                                            }
                                            pageSizeOptions={['50', '100', '150', '200']}
                                        />
                                    </Content>
                                    <Sider style={{ background: 'transparent' }} width={'25%'}>
                                        <Card
                                            title="Chi tiết đính kèm"
                                            style={{ overflowY: 'scroll', height: '500px' }}
                                        >
                                            {selectImage?.type === 'IMAGE' ? (
                                                <Image
                                                    src={selectImage?.url}
                                                    style={{ minHeight: '80px' }}
                                                />
                                            ) : selectImage?.type === 'VIDEO' ? (
                                                <video
                                                    src={selectImage?.url}
                                                    controls
                                                    loop
                                                    muted
                                                    autoPlay
                                                    style={{ minHeight: '80px' }}
                                                    className="border-[1px] shadow-md"
                                                ></video>
                                            ) : selectImage ? (
                                                <RenderImage file={selectImage} />
                                            ) : (
                                                <Image src="null" style={{ minHeight: '80px' }} />
                                            )}

                                            <Descriptions
                                                layout="horizontal"
                                                column={1}
                                                items={[
                                                    getItems(
                                                        1,
                                                        'Description: ',
                                                        <Input
                                                            value={selectImage?.description}
                                                            onChange={(e) => {
                                                                if (e.target.value && selectImage)
                                                                    setSelectImage({
                                                                        ...selectImage,
                                                                        description: e.target.value,
                                                                    })
                                                            }}
                                                        />
                                                    ),
                                                    getItems(1, 'Type: ', selectImage?.type),
                                                    getItems(
                                                        1,
                                                        'Created at: ',
                                                        selectImage?.createdAt
                                                    ),
                                                    getItems(
                                                        1,
                                                        'Created by: ',
                                                        selectImage?.createdBy?.email
                                                    ),
                                                    getItems(
                                                        2,
                                                        'Extension type: ',
                                                        selectImage?.extension
                                                    ),
                                                    getItems(
                                                        3,
                                                        'Size: ',
                                                        (selectImage?.size ?? 0 / 1024).toFixed(2) +
                                                            ' kb'
                                                    ),
                                                    getItems(
                                                        3,
                                                        'url: ',
                                                        <Typography.Paragraph
                                                            copyable={{
                                                                text: selectImage?.url,
                                                            }}
                                                        >
                                                            Copy Url
                                                        </Typography.Paragraph>
                                                    ),
                                                ]}
                                            />
                                            {selectImage && (
                                                <div className="space-x-2">
                                                    {isEdit && (
                                                        <>
                                                            <Button
                                                                onClick={async () => {
                                                                    try {
                                                                        setLoadingDelete(true)
                                                                        await fileApi.delete(
                                                                            selectImage.id
                                                                        )
                                                                        success(
                                                                            'delete file success'
                                                                        )
                                                                        onReload && onReload()
                                                                    } catch (err) {
                                                                        error('delete file failed')
                                                                    }
                                                                    setLoadingDelete(false)
                                                                }}
                                                                danger
                                                                // disabled={
                                                                //     !roles.includes(Roles.ADMIN)
                                                                // }
                                                                // className={
                                                                //     !roles.includes(Roles.ADMIN) &&
                                                                //     'hidden'
                                                                // }
                                                                loading={loadingDelete}
                                                            >
                                                                delete
                                                            </Button>
                                                            <Button
                                                                onClick={async () => {
                                                                    console.log(
                                                                        'updateFile',
                                                                        selectImage
                                                                    )
                                                                    try {
                                                                        await fileApi.update(
                                                                            selectImage.id,
                                                                            selectImage
                                                                        )
                                                                        success(
                                                                            'update file success'
                                                                        )
                                                                        onReload && onReload()
                                                                    } catch (err) {
                                                                        error('update file failed')
                                                                    }
                                                                }}
                                                            >
                                                                Update
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        onClick={() => {
                                                            window.open(selectImage.url)
                                                        }}
                                                        type="primary"
                                                    >
                                                        Xem file
                                                    </Button>
                                                </div>
                                            )}
                                        </Card>
                                    </Sider>
                                </Layout>
                            ),
                        },
                        {
                            label: 'thêm',
                            key: '2',
                            children: (
                                <div style={{ overflowY: 'scroll', height: '500px' }}>
                                    <div>
                                        <Radio.Group
                                            value={whatUpload}
                                            onChange={(e) => setWhatUpload(e.target.value)}
                                        >
                                            {Object.keys(mediaType).map((key) => (
                                                <Radio.Button key={key} value={key}>
                                                    {key.toLowerCase()}
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>

                                        <Upload.Dragger
                                            // action={`${api.getUri}/file/upload-image`}
                                            customRequest={handelUploadImage}
                                            accept={
                                                whatUpload === mediaType.IMAGE
                                                    ? 'image/*'
                                                    : whatUpload === mediaType.VIDEO
                                                    ? 'video/*'
                                                    : '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/zip,application/x-zip-compressed'
                                            }
                                            listType="picture"
                                            name="file"
                                            onChange={(info) => {
                                                const { status } = info.file
                                                if (status === 'done') {
                                                    success(
                                                        `${info.file.name} file uploaded successfully.`
                                                    )
                                                    fetchApi()
                                                } else if (status === 'error') {
                                                    error(`${info.file.name} file upload failed.`)
                                                }
                                            }}
                                        >
                                            <p className="ant-upload-drag-icon flex justify-center">
                                                <MdOutlineCloudUpload size={50} />
                                            </p>
                                            <p className="ant-upload-text">
                                                Click or drag file to this area to upload
                                            </p>
                                            <p className="ant-upload-hint">
                                                Support for a single or bulk upload. Strictly
                                                prohibited from uploading company data or other
                                                banned files.
                                            </p>
                                        </Upload.Dragger>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                ></Tabs>
            </Modal>
        </div>
    )
}

const RenderImage = ({ file }: { file: any }) => {
    return (
        <>
            <Tooltip title={`${file?.title}`}>
                <div className="aspect-square overflow-hidden w-full">
                    {file?.type === 'VIDEO' ? (
                        <video
                            className={`w-40 h-40 object-cover`}
                            src={file?.url}
                            preload="metadata"
                        ></video>
                    ) : (
                        <img className={`w-40 h-40 object-cover`} src={file?.url} alt="" />
                    )}
                </div>
                <div className="absolute top-2 right-2">
                    {file?.type === mediaType.VIDEO.toUpperCase() && (
                        <img className="w-[14px] h-[14px] object-cover" src={video_icon} alt="" />
                    )}
                </div>
            </Tooltip>
        </>
    )
}

export default ModalMedia
