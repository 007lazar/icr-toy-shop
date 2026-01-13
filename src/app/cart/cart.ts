import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderModel } from '../../models/order.model';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Utils } from '../utils';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected activeUser = signal<UserModel | null>(null)
  protected statusMap = {
    'na': 'Waiting',
    'paid': 'Paid',
    'canceled': 'Canceled',
    'liked': "Liked",
    'disliked': "Disliked"
  }


  constructor(private router: Router, private utils: Utils) {
    if (!UserService.hasAuth()) {
      router.navigateByUrl('/login')
      return
    }

    this.activeUser.set(UserService.getActiveUser())
  }


  protected increaseQty(order: OrderModel) {
    UserService.updateProductQuantity(order.orderId, 'inc')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected decreaseQty(order: OrderModel) {
    UserService.updateProductQuantity(order.orderId, 'dec')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected pay(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'paid')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected cancel(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'canceled')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected like(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'liked')
    this.activeUser.set(UserService.getActiveUser())

  }

  protected dislike(order: OrderModel) {
    UserService.updateOrder(order.orderId, 'disliked')
    this.activeUser.set(UserService.getActiveUser())
  }

  protected deleteOrder(order: OrderModel) {
    if (order.status === 'na') {
      this.utils.showAlert("Please choose an option!")
    } else if (order.status === 'paid') {
      this.utils.showAlert("Please leave a review!")
    } else {
      UserService.deleteOrder(order.orderId)
      this.activeUser.set(UserService.getActiveUser())
    }
  }
}
