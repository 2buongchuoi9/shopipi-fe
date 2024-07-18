import http, { Page, ParamsRequest } from './http'

export type VariantInventory = {
    variantId: string
    quantity: number
    priceImport: number
}

export type InventoryRequest = Omit<Inventory, 'id' | 'createdAt'>

export type Inventory = {
    id: string
    shopId: string
    productId: string
    variantInventory: VariantInventory[]
    isDeleted: boolean
    createdAt: string
}

const inventoryApi = {
    getAll: async (params: ParamsRequest) =>
        await http.get<Page<Inventory>>('/inventory', { params }),
    addInventory: async (InventoryRequest: InventoryRequest) =>
        await http.post('/inventory', InventoryRequest),
    addManyInventory: async (ListInventoryRequest: InventoryRequest[]) =>
        await http.post('/inventory/add-many', ListInventoryRequest),
}

export default inventoryApi
