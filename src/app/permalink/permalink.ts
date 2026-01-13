import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';
import { Utils } from '../utils';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-permalink',
  imports: [RouterLink],
  templateUrl: './permalink.html',
  styleUrl: './permalink.css',
})
export class Permalink {
  protected toy = signal<ToyModel | null>(null)
  protected apiBaseUrl = 'https://toy.pequla.com';

  constructor(private route: ActivatedRoute, private utils: Utils, private router: Router) {
    this.route.params.subscribe(p => {
      if (p['permalink']) {
        ToyService.getToyByPermalink(p['permalink'])
          .then(rsp => this.toy.set(rsp.data))
      }
    })
  }

  protected addToCart() {
    if (!this.toy()) {
      this.utils.showAlert('Toy hasnt been loaded yet!')
      return
    }

    UserService.createReservation({
      orderId: uuidv4(),
      toyId: this.toy()!.toyId,
      name: this.toy()!.name,
      price: this.toy()!.price,
      description: this.toy()!.description,
      imageUrl: this.toy()!.imageUrl,
      quantity: 1,
      status: 'na'
    })

    this.router.navigateByUrl('/basket')
  }
}
