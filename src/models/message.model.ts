import { ToyModel } from "./toy.model"

export interface MessageModel {
    type: 'user' | 'bot' | 'error'
    text?: string
    toys?: ToyModel[]
}