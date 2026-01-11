import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';

@Component({
  selector: 'app-permalink',
  imports: [RouterLink],
  templateUrl: './permalink.html',
  styleUrl: './permalink.css',
})
export class Permalink {
  protected toy = signal<ToyModel | null>(null)
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(p => {
      if (p['permalink']) {
        ToyService.getToyByPermalink(p['permalink'])
          .then(rsp => this.toy.set(rsp.data))
      }
    })
  }
}
