import { Component, computed, signal } from '@angular/core';
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
  protected search = signal('');
  protected type = signal('');
  protected ageGroup = signal('');
  protected filteredProducts = computed(() => {
    let items = this.products();

    const search = this.search().trim().toLowerCase();
    const type = this.type();
    const ageGroup = this.ageGroup();

    if (search) {
      items = items.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      );
    }

    if (type) {
      items = items.filter(t =>
        t.type.name.toLowerCase() === type.toLowerCase()
      );
    }

    if (ageGroup) {
      items = items.filter(t =>
        t.ageGroup.name === ageGroup
      );
    }

    return items;
  });


  constructor() {
    this.loadProducts();
  }

  protected loadProducts() {
    ToyService.getToys()
      .then(rsp => this.products.set(rsp.data))
  }

  protected clearFilters() {
    this.search.set('');
    this.type.set('');
    this.ageGroup.set('');
  }

}
