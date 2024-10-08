import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import categoryApi, { Category } from '@/http/categoryApi'
import './Home.css'

const ProductPageHome = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await categoryApi.get()
                const topLevelCategories = allCategories.filter(
                    (category) => category.parentIds.length === 0
                )
                setCategories(topLevelCategories)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="flex gap-4 items-center mt-2 bg-white w-full rounded-lg mb-3">
            <div className="flex flex-wrap gap-2 p-6">
                {categories.map((category) => (
                    <Link
                        to={`/product?category=${category.slug}`}
                        key={category.id}
                        className="flex px-2 py-1 rounded-lg border hover:shadow-xl transition-shadow duration-300 ease-in-out items-center"
                    >
                        <div className="flex items-center">
                            <h3 className="font-normal text-[14px] mr-2">{category.name}</h3>
                            <img
                                src={category.thumb}
                                alt={category.name}
                                className="w-8 h-7 object-cover rounded-md"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ProductPageHome
