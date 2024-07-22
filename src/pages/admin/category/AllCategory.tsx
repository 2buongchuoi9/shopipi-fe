import { useCategory, useMessage } from '@/hooks'
import { Category } from '@/http'
import categoryApi from '@/http/categoryApi'
import { AlertType } from '@/types/customType'
import { Alert, Button, Dropdown, Image, Popconfirm, Table, Tag } from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import { memo, useContext, useRef, useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'

const queryInitialState = {
    page: 0,
    size: 10,
    sort: null,
    keySearch: null,
}

const AllCategory = () => {
    const navigate = useNavigate()

    const { categories, categoriesFlat, fetchCategory } = useCategory()
    const [query, setQuery] = useState(queryInitialState)
    const { loading, success, error } = useMessage()
    const [alert, setAlert] = useState<AlertType>({ open: false, message: '', type: 'info' })

    const column: ColumnsType<Category> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (name, { thumb, slug }) => (
                <div className="flex items-center space-x-2">
                    <Image src={thumb} width={50} />
                    <Link to={`/admin/category/detail/${slug}`}>{name}</Link>
                </div>
            ),
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parentIds',
            key: 'parentIds',
            render: (_, { parentIds }) => {
                return parentIds.map((parentId) => {
                    const parent = categoriesFlat.find((category) => category.id === parentId)
                    return parent ? (
                        <Tag key={parentId} color="blue">
                            {parent.name ?? 'none'}
                        </Tag>
                    ) : null
                })
            },
        },
        {
            title: 'children count',
            dataIndex: 'children',
            key: 'children',
            render: (_, { id }) =>
                categoriesFlat.filter((category) => category.parentIds.includes(id)).length ||
                'noooo',
        },
        {
            title: 'Hành động',
            dataIndex: 'slug',
            key: 'slug',
            render: (slug, { id }) => (
                <div className="flex ">
                    <Button
                        type="text"
                        onClick={() => {
                            navigate(`/admin/category/detail/${slug}`)
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={async () => {
                            try {
                                await categoryApi.deleteCategory(id)
                                success('Xóa thành công')
                                await fetchCategory()
                            } catch (e) {}
                        }}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="text">Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ]

    return (
        <div>
            {alert.open && (
                <Alert
                    className="mb-5 sticky top-[43px] z-20"
                    message={alert?.message}
                    type={alert?.type || 'error'}
                    showIcon
                    closable
                    onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
                />
            )}
            <div className="mx-12">
                <div className="text-center font-semibold py-3">Tất cả danh mục</div>
                <div className="bg-white rounded-lg shadow-lg p-4 mb-5">
                    <div className="flex items-center space-x-4 mb-4">
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate('/admin/category/add')
                            }}
                            className="button-info"
                        >
                            Thêm danh mục mới
                        </Button>

                        <Search
                            className="w-1/3"
                            // delay={500}
                            // OnValueDebounced={(value) =>
                            //     setQuery((prev) => ({ ...prev, keySearch: value }))
                            // }
                        />
                    </div>
                    <Table
                        pagination={false}
                        columns={column}
                        dataSource={categories}
                        rootClassName="overflow-x-auto w-full"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default AllCategory
