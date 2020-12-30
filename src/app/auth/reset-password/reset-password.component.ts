import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN, NO_SPACE_PATTERN} from '@core/constants/patterns';
import {passwordConfirmation} from '@core/helpers/password-confirmation';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '@core/constants/global';
import {AuthService} from '@core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    resetPassForm: FormGroup;
    isSubmitted = false;
    emailPassed = false;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public auth: AuthService,
        private route: ActivatedRoute
    ) {

        const email = this.route.snapshot?.queryParams?.email;
        this.emailPassed = !!email;

        this.resetPassForm = this.fb.group({
            email: [email, [Validators.required, patternValidator(EMAIL_PATTERN)]],
            password: ['',
                [
                    Validators.required, patternValidator(NO_SPACE_PATTERN),
                    Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)
                ],
            ],
            confirm_password: ['', [Validators.required]]
        }, {validator: passwordConfirmation('password', 'confirm_password')});
    }

    ngOnInit(): void {
    }

    changePassword() {
        this.isSubmitted = true;
        if (this.resetPassForm.valid) {
            this.auth.resetPass(this.resetPassForm.value).subscribe(dt => {
                localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
                this.router.navigate(['/']);
            });
        }
    }

    get pass(): AbstractControl {
        return this.resetPassForm.get('password');
    }

    get confirmPass(): AbstractControl {
        return this.resetPassForm.get('confirm_password');
    }

}
