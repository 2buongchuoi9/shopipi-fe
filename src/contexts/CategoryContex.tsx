import { Category } from '@/http'
import categoryApi from '@/http/categoryApi'

import { ReactNode, createContext, useContext, useLayoutEffect, useState } from 'react'

type CategoryMenuType = Category & {
    label: string
    value: string | number
}

interface CategoryContextType {
    categories: CategoryMenuType[] | []
    fetchCategory: () => void
}

export const CategoryContext = createContext<CategoryContextType>({} as CategoryContextType)

export const useCategory = () => useContext(CategoryContext)

export default function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<CategoryMenuType[] | []>([] as CategoryMenuType[])
    const fetchCategory = async () => {
        try {
            const res = await categoryApi.get()
            const cates = res.map(((c) => ({ ...c, label: c.name, value: c.id })) || [])
            setCategories(cates)
            console.log('load categories', categories)
        } catch (error) {
            console.log('Failed to fetch categories from context')
            setCategories([])
        }
    }

    useLayoutEffect(() => {
        fetchCategory()
    }, [])

    return (
        <CategoryContext.Provider
            value={{
                categories,
                fetchCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    )
}
