type CartProps = { value: string | number; title: string; description: string }

const DashboardCart = ({ value, title, description }: CartProps) => {
    return (
        <div className="px-5 py-3 bg-white border-[1px] rounded-lg">
            <span className="text-xl font-bold">{value}</span>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-gray-500 text-1sm">{description}</p>
        </div>
    )
}
export default DashboardCart
