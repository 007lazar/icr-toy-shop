import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected year = new Date().getFullYear()
  
  constructor(private router: Router, private utils: Utils) {}

  getUserName() {
    const user = UserService.getActiveUser()
    return `${user.fullName}`
  }
  
  hasAuth(){
    return UserService.hasAuth()
  }

  doLogout() {
    return this.utils.showDialog("Are you sure u want to logout?", () => {
      UserService.logout()
      this.router.navigateByUrl('/login')
    })
  }
  
}
