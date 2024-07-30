import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import categoryApi, { Category } from '@/http/categoryApi'
import './Home.css'

const CategoryLeft = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await categoryApi.get()
                setCategories(categoryData)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="w-[16rem] h-full bg-white p-8 rounded-lg mb-6">
            <span className="text-[15px] font-semibold ml-2">Danh mục</span>
            <div className="h-[calc(100vh-4rem)] overflow-y-scroll custom-scrollbar">
                {categories.map((category) => (
                    <Link
                        to={`/category/${category.id}`}
                        key={category.id}
                        className="flex items-center py-3 px-2 space-x-2 hover:bg-gray-200 rounded-xl transition duration-300 ease-in-out"
                    >
                        <img
                            src={category.thumb}
                            alt={category.name}
                            className="w-7 h-7 object-cover rounded-xl transform hover:scale-110 transition duration-300 ease-in-out"
                        />
                        <span className="text-sm font-normal hover:text-blue-500 transition duration-300 ease-in-out">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoryLeft
