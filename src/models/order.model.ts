export interface OrderModel {
    orderId: string
    toyId: number
    name: string
    price: number
    ageGroup: string
    type: string
    imageUrl: string
    quantity: number
    status: 'na' | 'paid' | 'canceled' | 'liked' | 'disliked'
}