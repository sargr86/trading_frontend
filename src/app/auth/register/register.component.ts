import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import {passwordConfirmation} from '@core/helpers/password-confirmation';

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
        confirm_password: ['', Validators.required],
      },
      {validator: passwordConfirmation('password', 'confirm_password')}
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.subscriptions.push(this.auth.register(this.registerForm.value).subscribe(async (dt: any) => {
        localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        await this.router.navigate(['/']);
      }));
    }
  }

  get fullName(): AbstractControl {
    return this.registerForm.get('full_name');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get pass(): AbstractControl {
    return this.registerForm.get('password');
  }

  get confirmPass(): AbstractControl {
    return this.registerForm.get('confirm_password');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
