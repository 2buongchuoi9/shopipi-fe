import CateTree from '@/components/CateTree'
import { useCategory } from '@/hooks'
import { Category } from '@/http'
import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const CategoryPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const [cate, setCate] = useState<Category | null>(null)
    const { categories, categoriesFlat } = useCategory()

    useEffect(() => {
        // if (categoriesFlat.length > 0) {
        const category = categories.find((item) => item.slug === slug)
        category && setCate(category)
        // }
    }, [slug, categories])

    return (
        <div>
            <div className="flex">
                <div className="w-1/5">
                    {/* <div>{cate?.children && <CateTree category={cate} />}</div> */}
                </div>
            </div>
        </div>
    )
}
export default CategoryPage
