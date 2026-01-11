import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  protected products = signal<ToyModel[]>([]);
  protected previousSearch = 'N/A';
  protected search = '';

  constructor() {
    this.loadProducts();
  }

  protected loadProducts() {
    ToyService.getToys(this.search)
      .then(rsp => this.products.set(rsp.data));
  }

  protected addToCart(toy: ToyModel) {
    console.log('Added to cart:', toy);
  }
}
