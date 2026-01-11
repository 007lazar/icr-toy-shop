import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected activeUser = signal<UserModel | null>(null)

  constructor(private router: Router, private utils: Utils) {
    if (!UserService.hasAuth()) {
      router.navigateByUrl('/login')
      return
    }

    this.activeUser.set(UserService.getActiveUser())
  }
}