import { OrderModel } from "../models/order.model"
import { UserModel } from "../models/user.model"

export class UserService {
    public static USERS_KEY = 'toy_users'
    public static ACTIVE_USER_KEY = 'toy_active_user'

    static getUsers(): UserModel[] {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([{
                fullName: 'Lazar Milovanovic',
                email: "007lazar@gmail.com",
                password: "laza123",
                phone: "0652068821",
                addres: "Vojvode Stepe 331",
                favoriteToys: [],
                orders: []
            },
            {
                fullName: 'Rados Milenkovic',
                email: "rados02@gmail.com",
                password: "rados123",
                phone: "061234567",
                addres: "Unjanska za Vranje",
                favoriteToys: [],
                orders: []
            }
        ]))
        }

        return JSON.parse(localStorage.getItem(this.USERS_KEY)!)
    }

    static getUserByEmail(email: string) {
        const users = this.getUsers()
        const selectedUser = users.find(u => u.email === email)


        if (!selectedUser) throw new Error('USER_NOT_FOUND')

        return selectedUser;
    }

    static login(email: string, password: string) {

        try {
            const user = this.getUserByEmail(email)
            if (user.password === password) {
                localStorage.setItem(this.ACTIVE_USER_KEY, user.email)
                return true
            }

            return false
        } catch {
            return false
        }
    }

    static logout() {
        localStorage.removeItem(this.ACTIVE_USER_KEY)
    }

    static hasAuth() {
        return localStorage.getItem(this.ACTIVE_USER_KEY)
    }

    static getActiveUser() {
        if (!this.hasAuth())
            throw new Error("NO_ACTIVE_USER")

        return this.getUserByEmail(localStorage.getItem(this.ACTIVE_USER_KEY)!)
    }

    static createReservation(order: OrderModel) {
        const current = this.getActiveUser()
        const all = this.getUsers()

        for (let u of all) {
            if (u.email === current.email) {
                u.orders.push(order)
            }
        }

        localStorage.setItem(this.USERS_KEY, JSON.stringify(all))
    }

    static updateOrder(orderId: string, status: 'na' | 'paid' | 'canceled' | 'liked' | 'disliked') {
        const all = this.getUsers()

        for (let u of all) {
            if (u.email === localStorage.getItem(this.ACTIVE_USER_KEY)) {
                for (let o of u.orders) {
                    if (o.orderId === orderId) {
                        o.status = status
                    }
                }
            }
        }

        localStorage.setItem(this.USERS_KEY, JSON.stringify(all))
    }

    static updateProductQuantity(orderId: string, option: 'inc' | 'dec') {
        const all = this.getUsers()

        for (let u of all) {
            if (u.email === localStorage.getItem(this.ACTIVE_USER_KEY)) {
                for (let o of u.orders) {
                    if (o.orderId === orderId) {
                        if (option == 'inc') {
                            o.quantity++
                        } else if (option == 'dec' && o.quantity > 1) {
                            o.quantity--
                        }
                    }
                }
            }
        }

        localStorage.setItem(this.USERS_KEY, JSON.stringify(all))
    }

    static deleteOrder(orderId: string) {
        const all = this.getUsers()

        for (let u of all) {
            if (u.email === localStorage.getItem(this.ACTIVE_USER_KEY)) {
                u.orders = u.orders.filter(o => o.orderId !== orderId)
            }
        }

        localStorage.setItem(this.USERS_KEY, JSON.stringify(all))
    }
}