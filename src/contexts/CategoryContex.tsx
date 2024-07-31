import { Category } from '@/http'
import categoryApi from '@/http/categoryApi'

import { ReactNode, createContext, useLayoutEffect, useState } from 'react'

export interface CategoryContextType {
    categories: Category[] | []
    categoriesFlat: Category[] | []
    fetchCategory: () => Promise<void>
}

export const CategoryContext = createContext<CategoryContextType>({} as CategoryContextType)

export const buildCategoryTree = (categories: Category[], parentId: string | null): Category[] => {
    const filteredCategories = categories.filter((category) =>
        parentId === null ? category.parentIds.length === 0 : category.parentIds[0] === parentId
    )

    const tree = filteredCategories.map((category) => {
        const children = buildCategoryTree(categories, category.id)
        return children.length > 0
            ? { ...category, children, key: category.id, label: category.name, value: category.id }
            : {
                  ...category,
                  children: [],
                  key: category.id,
                  label: category.name,
                  value: category.id,
              }
    })

    return tree
}

export default function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[] | []>([] as Category[])
    const [categoriesFlat, setCategoriesFlat] = useState<Category[] | []>([] as Category[])
    const fetchCategory = async () => {
        try {
            const res = await categoryApi.get()
            setCategoriesFlat(res)
            setCategories(buildCategoryTree(res, null))
            console.log('load categories', categories)
        } catch (error) {
            console.log('Failed to fetch categories from context', error)
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
                categoriesFlat,
            }}
        >
            {children}
        </CategoryContext.Provider>
    )
}
