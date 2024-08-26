import { FaLandmarkFlag } from 'react-icons/fa6'
import { PiCurrencyDollarFill } from 'react-icons/pi'
import { TbWorld } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import './footer.css'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content m-[3rem] ml-[20rem]">
                <div className="footer-section">
                    <h3>Get to Know Us</h3>
                    <ul>
                        <li>Make Money with Us</li>
                        <li>Amazon Payment</li>
                        <li>Let Us Help You</li>
                        <li>Amazon Payment</li>
                        <li>Let Us Help You</li>
                        <li>Amazon Payment</li>
                        <li>Let Us Help You</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>CÔNG TY TNHH CÔNG NGHỆ VÀ THƯƠNG MẠI TTS</h3>
                    <ul>
                        <li>
                            Địa chỉ ĐKKD: Tầng 1, Toà nhà số 109-111, Đường 08, Khu dân cư Trung
                            Sơn, Xã Bình Hưng, Huyện Bình Chánh, Thành phố Hồ Chí Minh, Việt Nam
                        </li>
                        <li>
                            Kho Tân Phú: 284/11 Lũy Bán Bích, Phường Hòa Thạnh, Quận Tân Phú, Thành
                            phố Hồ Chí Minh, Việt Nam
                        </li>
                        <li>Giấy chứng nhận Đăng ký Kinh doanh số </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Thông tin</h3>
                    <ul>
                        <li>Email: info@foodmap.asia</li>
                        <li>Hotline: 02877702614 (8h00 - 18h00)</li>
                        <li>
                            <a href="">
                                Điều khoản và điều kiện sử dụng <b>0314592854</b> " do Sở Kế hoạch
                                và Đầu tư Thành phố Hồ Chí Minh cấp ngày 24/08/2017"
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Hỗ trợ</h3>
                    <ul>
                        <li>Phương thức thanh toán</li>
                        <li>Vận chuyển và giao nhận</li>
                        <li>Chính sách đổi trả và hoàn tiền</li>
                        <li>Liên hệ</li>
                        <li>Let Us Help You</li>
                        <li>Amazon Payment</li>
                        <li>Let Us Help You</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottoms">
                <span>
                    <div className="mr-16 mt-1">
                        <Link to={'/'}>
                            <img
                                className="h-[25px] w-[80px]"
                                src="https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png"
                                alt="Amazon logo"
                            />
                        </Link>
                    </div>
                </span>
                <span className="flex gap-4 cursor-pointer text-gray-700">
                    <div className="border border-gray-300 rounded-md p-2 transition-colors duration-200">
                        <a className="flex gap-2 items-center">
                            <TbWorld className="text-blue-500" />
                            <span>Ngôn ngữ</span>
                        </a>
                    </div>
                    <div className="border border-gray-300 rounded-md p-2 transition-colors duration-200">
                        <a className="flex gap-2 items-center">
                            <PiCurrencyDollarFill className="text-blue-500" />
                            <span>VND: Việt nam đồng</span>
                        </a>
                    </div>
                    <div className="border border-gray-300 rounded-md p-2 transition-colors duration-200">
                        <a className="flex gap-2 items-center">
                            <FaLandmarkFlag className="text-red-500" />
                            <span>Việt Nam</span>
                        </a>
                    </div>
                </span>
            </div>
            <div className="mt-3 bg-white p-[5rem]">
                <Footer2 />
            </div>
            <hr />
            <div className="footer-bottom">
                <p>&copy; 2023 | Developed by Già Gân team</p>
            </div>
        </div>
    )
}

const Footer2 = () => (
    <div className="footer-content2">
        <div className="footer-section2">
            <h3>Get to Know Us</h3>
            <ul>
                <li>Make Money with Us</li>
                <li>Amazon Payment</li>
                <li>Let Us Help You</li>
                <li>Amazon Payment</li>
                <li>Let Us Help You</li>
                <li>Amazon Payment</li>
                <li>Let Us Help You</li>
            </ul>
        </div>
        <div className="footer-section2">
            <h3>CÔNG TY TNHH CÔNG NGHỆ VÀ THƯƠNG MẠI TTS</h3>
            <ul>
                <li>
                    Địa chỉ ĐKKD: Tầng 1, Toà nhà số 109-111, Đường 08, Khu dân cư Trung Sơn, Xã
                    Bình Hưng, Huyện Bình Chánh, Thành phố Hồ Chí Minh, Việt Nam
                </li>
                <li>
                    Kho Tân Phú: 284/11 Lũy Bán Bích, Phường Hòa Thạnh, Quận Tân Phú, Thành phố Hồ
                    Chí Minh, Việt Nam
                </li>
                <li>Giấy chứng nhận Đăng ký Kinh doanh số </li>
            </ul>
        </div>
        <div className="footer-section2">
            <h3>Thông tin</h3>
            <ul>
                <li>Email: info@foodmap.asia</li>
                <li>Hotline: 02877702614 (8h00 - 18h00)</li>
                <li>
                    <a href="">
                        Điều khoản và điều kiện sử dụng <b>0314592854</b> " do Sở Kế hoạch và Đầu tư
                        Thành phố Hồ Chí Minh cấp ngày 24/08/2017"
                    </a>
                </li>
            </ul>
        </div>
        <div className="footer-section2">
            <h3>Hỗ trợ</h3>
            <ul>
                <li>Foodmap CSR</li>
                <li>Reload Your Balance</li>
                <li>Returns & Replacements</li>
                <li>Amazon Payment</li>
                <li>Let Us Help You</li>
                <li>Amazon Payment</li>
                <li>Let Us Help You</li>
            </ul>
        </div>
    </div>
)

export default Footer
