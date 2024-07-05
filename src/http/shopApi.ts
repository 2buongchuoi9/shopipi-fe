export type Role = "ADMIN" | "USER" | "SHOP"

export type Shop = {
    id: string
    name: string
    email: string
    image: string | null
    status: boolean
    verify: boolean
    authType: string
    roles: Role[]
    addressShipping: string | null
    createAt: string // Consider using Date if possible
    oauth2Id: string | null
}
