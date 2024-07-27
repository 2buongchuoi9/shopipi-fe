export type AlertType = {
    open: boolean
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
}

export type ErrorInfoForm = { errorFields: { name: (string | number)[]; errors: string[] }[] }

export type District = {
    key: string
    label: string
    value: string
    parent: string
}

export type Districts = {
    [key: string]: District[]
}

export type Province = {
    key: string
    Label: string
    value: string
}
