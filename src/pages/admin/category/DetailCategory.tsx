import ModalMedia from '@/components/ModalMedia'
import { useCategory, useMessage } from '@/hooks'
import categoryApi, { Category } from '@/http/categoryApi'
import ErrorPage from '@/pages/ErrorPage'
import { ErrorInfoForm } from '@/types/customType'
import { convertVietNameseToSlug } from '@/utils'
import {
    Alert,
    Button,
    Cascader,
    Collapse,
    Form,
    Image,
    Input,
    Select,
    Switch,
    Tooltip,
    TreeSelect,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import propTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { FaPlay, FaRegImage } from 'react-icons/fa'
import { FaTrashCan } from 'react-icons/fa6'
import { useNavigate, useParams, useRoutes } from 'react-router-dom'

const initCate = {
    id: '',
    slug: '',
    name: '',
    parentIds: [],
    thumb: '',
}

const itemClasses2 = {
    title: 'text-gl ml-3 p-0 ',
    titleWrapper: 'p-0',
    trigger: 'p-0 ',
    // content: "pt-3 bg-white p-3 rounded-lg border-1 shadow-md",
    // contentWrapper: "border-1 rounded-lg bg-white p-3",
}

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
        // xs: {
        //     span: 24,
        // },
        // sm: {
        //     span: 14,
        // },
    },
    formItemLayout: 'vertical',
}

const DetailCategory = ({ isAdd = false }) => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm<Category & { parentId: string | null }>()
    const [err, setErr] = useState<string | null>(null)
    const { categories, categoriesFlat, fetchCategory } = useCategory()
    const [open, setOpen] = useState(false)
    const [thumb, setThumb] = useState<string | null>(null)
    const [onCancel, setOnCancel] = useState(() => () => setOpen(false))
    const [alert, setAlert] = useState({ open: false, message: '', type: '' })
    const { loading, success, error } = useMessage()

    useEffect(() => {
        if (!isAdd && slug) {
            const foundCate = categoriesFlat.find((cate) => cate.slug === slug)
            console.log('foundCate', foundCate)
            if (foundCate) {
                setThumb(foundCate.thumb)
                form.setFieldsValue({ ...foundCate, parentId: foundCate.parentIds[0] ?? null })
            } else setErr(`Không tìm thấy danh mục '${slug}'`)
        }
    }, [categoriesFlat, isAdd, slug])

    const handleSubmit = async (values: Category) => {
        console.log('values', values)
        loading('Đang xử lý')
        if (isAdd) {
            try {
                const res = await categoryApi.addCategory(values)
                console.log('res', res)
                success('Thêm mới thành công')
                await fetchCategory()
                navigate(`/admin/category/all`)
            } catch (e) {
                error(`Thêm mới thất bại: ${e}`)
            }
        } else {
            loading('Đang xử lý')
            try {
                const res = await categoryApi.updateCategory(form.getFieldValue('id'), values)
                console.log('res', res)
                success('Cập nhật thành công')
                await fetchCategory()
                // navigate(`/admin/product/category`)
            } catch (e) {
                console.log('error', e)
                error(`Cập nhật thất bại`)
            }
        }
    }

    const onFinishFailed = (errorCate: ErrorInfoForm) => {
        const { errorFields } = errorCate
        form.scrollToField(errorFields[0].name[0], {
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
            // offsetTop: 100,
        })
        // setErr(errorFields[0].errors[0])
        setAlert({ open: true, message: errorFields[0].errors[0], type: 'error' })
        // console.log("errorCate", errorCate)
    }

    return (
        <div className="mx-12">
            <ModalMedia
                isOpen={open}
                activeField={'thumb'}
                onCancel={onCancel}
                typeMedia={'IMAGE'}
                /* onOk là hàm, tham số là object gồm activeField và selectedFile */
                onOk={({ selectedFile }) => {
                    form.setFieldValue('thumb', selectedFile?.url)
                    setThumb(selectedFile?.url ?? form.getFieldValue('thumb'))
                    setOpen(false)
                }}
            />
            <div className="text-center font-semibold py-3">Quản lí danh mục</div>

            {err && <ErrorPage type={404} subTitle={err} />}
            {!err && (
                <div>
                    <Form
                        {...formItemLayout}
                        form={form}
                        variant="filled"
                        initialValues={initCate}
                        onFinish={handleSubmit}
                        onFinishFailed={onFinishFailed}
                        className="grid grid-cols-3 gap-5"
                        // onValuesChange={handleValuesChange}
                    >
                        <div className="col-span-2 bg-white p-5">
                            <Form.Item name="parentIds" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item hasFeedback name={'name'} label={`Tên danh mục`} required>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="slug"
                                label="Slug"
                                hasFeedback
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
                                        Slug là đường dẫn hiển thị trên trình duyệt. Nó phải là duy
                                        nhất và chỉ chứa các chữ cái, số và dấu gạch ngang.
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
                            <Form.Item name="parentId" label="Danh mục cha">
                                <TreeSelect
                                    treeData={[
                                        {
                                            key: '',
                                            title: 'None',
                                            label: 'None',
                                            value: '',
                                        },

                                        ...(categories as any),
                                    ]}
                                    placeholder="None"
                                    treeDefaultExpandAll
                                    onSelect={(value: string, node: Category) => {
                                        console.log('new value', value)
                                        console.log('new node', node)
                                        form.setFieldValue('parentIds', [value, ...node.parentIds])
                                        console.log('all values', form.getFieldsValue())
                                    }}
                                    disabled={!isAdd}
                                />

                                {/* <Cascader
                                            className="w-full"
                                            options={[
                                                {
                                                    key: '',
                                                    title: 'None',
                                                    label: 'None',
                                                    value: '',
                                                },

                                                ...categories,
                                            ]}
                                            onChange={(value) => {
                                                console.log('value', value)
                                                console.log('all values', form.getFieldsValue())
                                            }}
                                            placeholder="Select category"
                                            showSearch={{
                                                filter: (inputValue, path) =>
                                                    path.some(
                                                        (option) =>
                                                            option?.label
                                                                .toLowerCase()
                                                                .indexOf(inputValue.toLowerCase()) >
                                                            -1
                                                    ),
                                            }}
                                            onSearch={(value) => console.log(value)}
                                        /> */}
                            </Form.Item>

                            <Form.Item label="Ảnh sản phẩm" name="thumb" required>
                                <div className="aspect-square w-20 h-20 relative group">
                                    <Input hidden />
                                    {thumb ? (
                                        <div className="aspect-square w-20 h-20 relative group">
                                            <Input hidden />
                                            <Tooltip title="Click đổi hình">
                                                <img
                                                    className="w-full h-full border-2 hover:cursor-pointer"
                                                    src={thumb ?? form.getFieldValue('thumb')}
                                                    onClick={() => {
                                                        setOnCancel(() => () => {
                                                            setOpen(false)
                                                        })
                                                        setOpen(true)
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    ) : (
                                        <Button
                                            type="dashed"
                                            className="w-20 h-20"
                                            onClick={() => {
                                                setOnCancel(() => () => {
                                                    setOpen(false)
                                                })
                                                setOpen(true)
                                            }}
                                        >
                                            <div className="flex flex-col justify-center items-center text-blue-400">
                                                <FaRegImage size={20} />
                                                <span className="text-ellipsis line-clamp-2 w-full text-sm ">
                                                    Thêm Ảnh
                                                </span>
                                            </div>
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Button className="button-info" htmlType="submit">
                                Tạo danh mục
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    )
}
export default DetailCategory
