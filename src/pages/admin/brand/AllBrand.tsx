import { useCategory } from '@/hooks'
import { Brand } from '@/http/brandApi'
import { useState } from 'react'

const AllBrand = () => {
    const { brands: brandsRoot } = useCategory()
    const [brands, setBrands] = useState<Brand[] | []>(brandsRoot)

    return <div></div>
}
export default AllBrand
