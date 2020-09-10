import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register() {
    this.auth.register(this.registerForm.value).subscribe((dt: any) => {
      localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
