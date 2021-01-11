import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@core/services/auth.service';
import {Subscription} from 'rxjs';
import {patternValidator} from '@core/helpers/pattern-validator';
import {AuthGuard} from '@core/guards/auth.guard';
import {EMAIL_PATTERN} from '@core/constants/patterns';
import {VerifyEmailComponent} from '@core/components/modals/verify-email/verify-email.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    subscriptions: Subscription[] = [];
    isSubmitted = false;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private auth: AuthService,
        private authGuard: AuthGuard,
        private dialog: MatDialog
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            password: ['', Validators.required],
        });

    }

    ngOnInit(): void {
    }

    login() {
        this.isSubmitted = true;
        if (this.loginForm.valid) {
            // this.subscriptions.push(this.auth.resendEmailVerificationCode({
            //     ...this.loginForm.value,
            //     resend: true
            // }).subscribe(() => {
            //     this.dialog.open(VerifyEmailComponent, {
            //         height: '548px',
            //         width: '548px',
            //         data: this.loginForm.value
            //     }).afterClosed().subscribe(async (result) => {
            //         await this.router.navigate([this.authGuard.redirectUrl ? this.authGuard.redirectUrl : '/']);
            //     });
            //
            // }));
            this.subscriptions.push(this.auth.login(this.loginForm.value).subscribe(async (dt: any) => {
                localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
                await this.router.navigate([this.authGuard.redirectUrl ? this.authGuard.redirectUrl : '/']);
            }));
        }
    }

    get email(): AbstractControl {
        return this.loginForm.get('email');
    }

    get pass(): AbstractControl {
        return this.loginForm.get('password');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
