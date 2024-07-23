import { Link } from 'react-router-dom'

const imageSrcs = [
    {
        title: 'Top-Deal',
        src: 'https://salt.tikicdn.com/ts/upload/2f/52/8e/00ab5fbea9d35fcc3cadbc28d7c6b14e.png',
    },
    {
        title: 'Shopipi Trading',
        src: 'https://salt.tikicdn.com/ts/upload/72/8d/23/a810d76829d245ddd87459150cb6bc77.png',
    },
    {
        title: 'Coupon Hot',
        src: 'https://salt.tikicdn.com/ts/upload/8b/a4/9f/84d844f70e365515b6e4e3e745dac1d5.png',
    },
    {
        title: 'Xã kho',
        src: 'https://salt.tikicdn.com/ts/upload/a5/d8/06/cb6ff520f12973013c81a8b14ad5e5b3.png',
    },
    {
        title: 'Hàng nhập khẩu',
        src: 'https://salt.tikicdn.com/ts/upload/cf/46/d1/e474a9eb803909a59927600ee64ddd4f.png',
    },
    {
        title: 'Hàng nội địa',
        src: 'https://salt.tikicdn.com/cache/750x750/ts/upload/d7/b9/cf/185c3ea4d118574d7927f3d191575445.jpg.webp',
    },
    {
        title: 'Mọt sách Shopipi',
        src: 'https://salt.tikicdn.com/cache/750x750/ts/upload/28/52/b2/e77e55676a38e02c5ac7242cc43f46dc.jpg.webp',
    },
    {
        title: 'Thới giới công nghệ',
        src: 'https://salt.tikicdn.com/cache/750x750/ts/upload/25/a7/1f/5538b19e95600da86e1241082fb631bf.jpg.webp',
    },
    {
        title: 'Yêu bếp',
        src: 'https://salt.tikicdn.com/cache/750x750/ts/upload/03/f9/44/343e3b73c1e600e3c16b97843dc04bb1.jpg.webp',
    },
    {
        title: 'Khoẻ đẹp',
        src: 'https://salt.tikicdn.com/cache/750x750/ts/upload/ea/d3/81/a4ed0166b6abb19c3cfa3a48fadafd02.jpg.webp',
    },
]

const CategoryHome = () => {
    return (
        <div className="border w-[73rem] h-auto bg-white rounded-lg relative">
            <div className="flex flex-wrap justify-around items-center px-[6rem] py-2">
                {imageSrcs.map((image, index) => (
                    <Link
                        to={`/route-next/${image.title}`}
                        key={index}
                        className="w-1/5 flex flex-col items-center py-2"
                    >
                        <img
                            src={image.src}
                            alt={image.title}
                            className="w-10 h-10 object-cover rounded-xl"
                        />
                        <span className="mt-2 text-sm font-normal">{image.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoryHome
