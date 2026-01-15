import axios from "axios";
import { ToyModel } from "../models/toy.model";

const client = axios.create({
  baseURL: 'https://toy.pequla.com/api',  
  headers: {
    'Accept': 'application/json',
    'X-Name': 'ICR-ToyShop/2025'
  }
});

export class ToyService {

  private static readonly BASE_URL = 'https://toy.pequla.com';

  static async getToys() {
    const response = await client.request<ToyModel[]>({
      url: '/toy',
      method: 'GET',
    });

    const fixedData = response.data.map(toy => ({
      ...toy,
      imageUrl: this.BASE_URL + toy.imageUrl
    }));

    return {
      ...response,
      data: fixedData
    };
  }

  static async getToyByPermalink(permalink: string) {
    const response = await client.get<ToyModel>(`/toy/permalink/${permalink}`);

    return {
      ...response,
      data: {
        ...response.data,
        imageUrl: this.BASE_URL + response.data.imageUrl
      }
    };
  }

  static async getTypes() {
    return client.get(`/type`);
  }

  static async getAgeGroups() {
    return client.get(`/age-group`);
  }
}
