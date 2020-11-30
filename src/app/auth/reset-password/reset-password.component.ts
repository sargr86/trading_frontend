import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN} from '@core/constants/patterns';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    resetPassForm: FormGroup;
    isSubmitted = false;

    constructor(
        private fb: FormBuilder,
        public router: Router
    ) {
        this.resetPassForm = this.fb.group({
            password: ['', [Validators.required]],
            repassword: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
    }

    changePassword() {
        this.isSubmitted = true;
    }

}
