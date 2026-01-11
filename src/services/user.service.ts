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
            }]))
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
        if(!this.hasAuth())
            throw new Error("NO_ACTIVE_USER")

        return this.getUserByEmail(localStorage.getItem(this.ACTIVE_USER_KEY)!)
    }
}