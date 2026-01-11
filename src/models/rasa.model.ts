export interface RasaModel {
    text: string
    attachment: {
        type: "recommended_toys" | "toy_list" | "type_list"
        data: any
    }
}