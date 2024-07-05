module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

        "@typescript-eslint/no-explicit-any": "off",
        "react/display-name": "off", // Tắt thông báo display-name của eslint
        "no-extra-semi": true, // Báo lỗi khi có dấu ; thừa
    },
}
