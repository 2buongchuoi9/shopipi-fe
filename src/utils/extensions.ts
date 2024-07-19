// Khai báo mở rộng cho Number
declare global {
    interface Number {
        vnd(): string
    }
}

// Thêm phương thức vào Number.prototype
Number.prototype.vnd = function (): string {
    return this.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export {} // Điều này đảm bảo tệp này được coi là mô-đun
