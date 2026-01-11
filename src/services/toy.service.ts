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

  static async getToys(search: string = '', type: number = 0, ageGroup: number = 0) {
    return client.request<ToyModel[]>({
      url: '/toy',
      method: 'GET',
    });
  }

  static async getToyByPermalink(permalink: string) {
    return client.get<ToyModel>(`/toy/permalink/${permalink}`);
  }

  static async getTypes() {
    return client.get(`/type`);
  }

  static async getAgeGroups() {
    return client.get(`/age-group`);
  }
}
