import { Component, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { Utils } from '../utils';
import { OrderModel } from '../../models/order.model';

@Component({
  selector: 'app-basket',
  imports: [],
  templateUrl: './basket.html',
  styleUrl: './basket.css',
})
export class Basket {
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
