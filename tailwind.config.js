/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontSize: {
                '1sm': '12px',
                '2sm': '14px',
                '3sm': '15px',
                '4sm': '16px',
                '5sm': '17px',
                '6sm': '18px',
            },
            colors: {
                shopipi: {
                    background: '#EAEDED',
                    light_blue: '#232F3A',
                    yellow: '#FEBD69',
                    DEFAULT: '#131921',
                },
            },
        },
    },
    plugins: [],
}
