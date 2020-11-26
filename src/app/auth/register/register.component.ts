import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import {passwordConfirmation} from '@core/helpers/password-confirmation';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {VerifyEmailComponent} from '@core/components/modals/verify-email/verify-email.component';
import {NO_SPACE_PATTERN, NUMBER_AFTER_TEXT_PATTERN, TEXT_ONLY_PATTERN} from '@core/constants/patterns';
import {patternValidator} from '@core/helpers/pattern-validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    subscriptions: Subscription[] = [];
    isSubmitted = false;
    currentDate = new Date();
    maxDate: Date;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private auth: AuthService,
        private datePipe: DatePipe,
        private dialog: MatDialog
    ) {

        // Age-restriction of 18
        this.maxDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() - 18));
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
                full_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN)]],
                username: ['', [Validators.required, patternValidator(NUMBER_AFTER_TEXT_PATTERN)]],
                email: ['', Validators.required],
                password: ['',
                    [
                        Validators.required, patternValidator(NO_SPACE_PATTERN),
                        Validators.minLength(6), Validators.maxLength(15)
                    ],
                ],
                confirm_password: ['', Validators.required],
                birthday: [''],
            },
            {validator: passwordConfirmation('password', 'confirm_password')}
        );
    }

    register() {
        console.log(this.registerForm.value)
        if (this.registerForm.valid) {
            this.subscriptions.push(this.auth.register(this.registerForm.value).subscribe(async (dt: any) => {
                localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
                await this.router.navigate(['/']);
            }));
        }
    }

    dateChanged(e) {
        const d = this.datePipe.transform(e, 'yyyy-MM-dd');
        // this.registerForm.patchValue({birthday: d});
    }

    openModal() {
        this.isSubmitted = true;

        if (this.registerForm.valid) {

            this.auth.sendEmailVerificationCode(this.registerForm.value).subscribe((code) => {
                this.dialog.open(VerifyEmailComponent, {
                    height: '548px',
                    width: '548px',
                    data: {code}
                }).afterClosed().subscribe((confirmed) => {
                    // if (confirmed) {
                    //     this.register();
                    // }
                });
            });
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

    get username(): AbstractControl {
        return this.registerForm.get('username');
    }

    get confirmPass(): AbstractControl {
        return this.registerForm.get('confirm_password');
    }

    get birthday(): AbstractControl {
        return this.registerForm.get('birthday');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
