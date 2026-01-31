import axios from "axios";
import { ToyModel } from "../models/toy.model";
import { v4 as uuidv4 } from 'uuid'

const client = axios.create({
  baseURL: 'https://toy.pequla.com/api',
  headers: {
    'Accept': 'application/json',
    'X-Name': 'ICR-ToyShop/2025'
  }
});

export class ToyService {

  private static readonly BASE_URL = 'https://toy.pequla.com';
  private static readonly REVIEWS_KEY = 'toy_reviews';

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


  static getReviews(toyId: number) : ToyModel['reviews']{
    const allReviews = JSON.parse(localStorage.getItem(this.REVIEWS_KEY) || '{}');
    return allReviews[toyId] || [];
  }

  static addReview(toyId: number, user: string, comment: string, rating: number) {
    const allReviews = JSON.parse(localStorage.getItem(this.REVIEWS_KEY) || '{}');
    if (!allReviews[toyId]) allReviews[toyId] = [];

    allReviews[toyId].push({
      id: uuidv4(),
      user,
      comment,
      rating,
      date: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(allReviews));
    return allReviews[toyId];
  }

  static getAverageRating(toyId: number): number {
    const reviews = this.getReviews(toyId) ?? []
    if(reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return +(sum / reviews.length).toFixed(1); 
  }

}
