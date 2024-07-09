export type AlertType = {
    open: boolean
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
}

export type ErrorInfoForm = { errorFields: { name: (string | number)[]; errors: string[] }[] }
