import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import categoryApi, { Category } from '@/http/categoryApi'
import './Home.css'
import { FcNext, FcPrevious } from 'react-icons/fc'

const ProductPageHome = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerPage = 7

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

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0))
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            Math.min(prevIndex + itemsPerPage, categories.length - itemsPerPage)
        )
    }

    return (
        <div className="flex gap-4 items-center mt-2 bg-white w-full rounded-lg mb-3 p-5 shadow-lg">
            <button
                onClick={handlePrev}
                className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-300"
            >
                <FcPrevious size={24} />
            </button>
            <div className="flex overflow-hidden w-full justify-center">
                <div
                    className="flex gap-2 p-1 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 10}%)` }}
                >
                    {categories.slice(currentIndex, currentIndex + itemsPerPage).map((category) => (
                        <Link
                            to={`/product?category=${category.slug}`}
                            key={category.id}
                            className="flex p-1 rounded-lg border hover:shadow-xl transition-shadow duration-300 ease-in-out items-center bg-gray-50"
                        >
                            <div className="flex items-center">
                                <h3 className="font-normal text-[12px]">{category.name}</h3>
                                <img
                                    src={category.thumb}
                                    alt={category.name}
                                    className="w-8 h-8 object-cover rounded-md"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <button
                onClick={handleNext}
                className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-300"
            >
                <FcNext size={24} />
            </button>
        </div>
    )
}

export default ProductPageHome
