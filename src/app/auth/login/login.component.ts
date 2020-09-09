import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe((dt: any) => {
      localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
