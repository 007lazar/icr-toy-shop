import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import { Router } from '@angular/router';
import { Utils } from '../utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private router: Router, private utils: Utils) {}

  onSubmit() {
    if (!UserService.login(this.form.value.email!, this.form.value.password!)) {
        this.utils.showAlert("Invalid credentials")
        return
    }

    this.router.navigateByUrl('/')
  }
}
