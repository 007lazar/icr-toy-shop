import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';
import { Utils } from '../utils';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permalink',
  imports: [RouterLink, FormsModule],
  templateUrl: './permalink.html',
  styleUrl: './permalink.css',
})
export class Permalink {
  protected toy = signal<ToyModel | null>(null)
  protected apiBaseUrl = 'https://toy.pequla.com';
  protected reviews = signal<ToyModel['reviews']>([])
  protected selectedRating = 0;
  protected reviewComment = '';
  protected hasUser = false;
  protected filteredProducts = computed(() => {

  });

  constructor(private route: ActivatedRoute, private utils: Utils, private router: Router) {
    this.hasUser = !!UserService.hasAuth();
    this.route.params.subscribe(p => {
      if (p['permalink']) {
        ToyService.getToyByPermalink(p['permalink'])
          .then(rsp => {
            this.toy.set(rsp.data);
            this.loadReviews();
          });
      }
    });
  }

  protected loadReviews() {
    const toy = this.toy();
    if (!toy) return;
    const reviews = ToyService.getReviews(toy.toyId);
    this.reviews.set(reviews ?? []);
  }

  protected addToCart() {
    if (!this.toy()) {
      this.utils.showAlert('Toy hasnt been loaded yet!')
      return
    }

    if(!this.hasUser) {
      return this.utils.showDialog("Redirect to Login?", () => this.router.navigateByUrl('login'), "No", "Yes")
    }

    UserService.createReservation({
      orderId: uuidv4(),
      toyId: this.toy()!.toyId,
      name: this.toy()!.name,
      price: this.toy()!.price,
      ageGroup: this.toy()!.ageGroup.name,
      type: this.toy()!.type.name,
      imageUrl: this.toy()!.imageUrl,
      quantity: 1,
      status: 'na'
    })

    this.router.navigateByUrl('/cart')
  }


  submitReview() {
    if (!this.toy() || this.selectedRating === 0 || !this.reviewComment.trim()) return;

    const user = UserService.getActiveUser();
    ToyService.addReview(this.toy()!.toyId, user.fullName, this.reviewComment, this.selectedRating);
    this.loadReviews()
    this.utils.showRating(`Thanks! You rated this toy ${this.selectedRating} ⭐`);
    this.selectedRating = 0;
    this.reviewComment = '';
  }

  protected hasBoughtThisToy(): boolean {
    if (!this.toy() || !this.hasUser) return false;
    const statusGroup = ['paid', 'liked', 'disliked']
    try {
      const user = UserService.getActiveUser()
      return user.orders.some(o => o.toyId == this.toy()!.toyId 
      && statusGroup.includes(o.status)) ?? false;
    } catch {
      return false
    }
  }

}
