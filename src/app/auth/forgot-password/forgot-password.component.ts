import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN} from '@core/constants/patterns';
import {AuthService} from '@core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    forgotPassForm: FormGroup;
    isSubmitted = false;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public auth: AuthService
    ) {
        this.forgotPassForm = this.fb.group({
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]]
        });
    }

    ngOnInit(): void {
    }

    sendEmail() {
        this.isSubmitted = true;
        this.router.navigate(['auth/reset-password']);
        this.auth.sendForgotPassEmail(this.forgotPassForm.value).subscribe(dt => {

        });
    }

}
