import { useCategory } from '@/hooks'
import { Category } from '@/http'
import { Button } from 'antd'
import { HTMLAttributes, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

type Props = HTMLAttributes<HTMLDivElement> & {
    categories?: Category[]
    selected: Category | null
    setSelected: React.Dispatch<React.SetStateAction<Category | null>>
    first?: boolean
}

type ItemProps = HTMLAttributes<HTMLDivElement> & {
    item: Category
    selected: Category | null
    setSelected: React.Dispatch<React.SetStateAction<Category | null>>
}

const Item = ({ item, selected, setSelected, ...rest }: ItemProps) => {
    const [show, setShow] = useState(false)

    return (
        <div {...rest}>
            <span
                className="cursor-pointer"
                style={{ color: selected?.id === item.id ? 'blue' : 'black' }}
                onClick={() => setSelected(item)}
            >
                {item.name}
            </span>
            {item.children.length > 0 && (
                <Button
                    icon={show ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    className="border-none hover:border-blue-400 absolute right-1"
                    size="small"
                    onClick={() => setShow(!show)}
                />
            )}
            {item.children.length > 0 && show && (
                <CateTree
                    categories={item.children}
                    selected={selected}
                    setSelected={setSelected}
                    first={false}
                    className="cc"
                />
            )}
        </div>
    )
}

const CateTree = ({ categories, selected, setSelected, first = true, ...rest }: Props) => {
    let cate
    const { categories: allCate } = useCategory()
    if (categories === undefined) {
        cate = allCate
    } else {
        cate = categories
    }

    let cl = rest.className ? rest.className : 'bg-white border-[1px] rounded-xl'

    return (
        <div {...rest} className={cl}>
            {first && (
                <>
                    <div className="text-lg font-bold p-2">Khám phá theo danh mục</div>
                    <div className="border-t border-gray-200"></div>
                </>
            )}
            {cate.map((item, i) => (
                <div key={item.id}>
                    <Item
                        item={item}
                        selected={selected}
                        setSelected={setSelected}
                        className="relative p-2"
                    />
                    {i !== cate.length - 1 && <div className="border-t border-gray-200"></div>}
                </div>
            ))}
        </div>
    )
}
export default CateTree
