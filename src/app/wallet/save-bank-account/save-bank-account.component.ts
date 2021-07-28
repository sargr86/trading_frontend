import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN, NUMBER_AFTER_TEXT_PATTERN, TEXT_ONLY_PATTERN_WITHOUT_SPECIALS} from '@core/constants/patterns';
import {Subscription} from 'rxjs';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UsersService} from '@core/services/users.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-save-bank-account',
    templateUrl: './save-bank-account.component.html',
    styleUrls: ['./save-bank-account.component.scss']
})
export class SaveBankAccountComponent implements OnInit, OnDestroy {

    stripeBankAccountForm: FormGroup;
    isSubmitted = false;
    subscriptions: Subscription[] = [];
    authUser;

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersService: UsersService,
        private toastr: ToastrService,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();
        this.stripeBankAccountForm = this.fb.group({
            user_id: this.authUser.id,
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            individual: this.fb.group({
                first_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                last_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
                dob: ['', Validators.required],
                phone: ['000 000 0000', Validators.required],
                id_number: ['000000000', Validators.required],
                address: this.fb.group({
                    country: ['US', Validators.required],
                    city: ['New York', Validators.required],
                    state: ['New York', Validators.required],
                    line1: ['13 Street', Validators.required],
                    line2: ['47 W', Validators.required],
                    postal_code: ['10001', Validators.required],
                })
            }),
            business_profile: this.fb.group({
                mcc: ['5734', Validators.required],
                url: ['https://metl.tv/', Validators.required],
            }),
            external_account: this.fb.group({
                object: ['bank_account'],
                country: ['US', Validators.required],
                routing_number: ['110000000', Validators.required],
                account_number: ['000123456789', Validators.required],
            })
        });

        this.stripeBankAccountForm.patchValue({individual: this.authUser, email: this.authUser.email});
    }

    ngOnInit(): void {
    }

    saveBankAccount() {
        this.usersService.addStripeBankAccount(this.stripeBankAccountForm.value).subscribe(async (dt) => {
            await this.router.navigate(['wallet/show']);
            this.toastr.success('The bank account has been added successfully');
        });
    }

    get firstName(): AbstractControl {
        return this.stripeBankAccountForm.get('first_name');
    }

    get lastName(): AbstractControl {
        return this.stripeBankAccountForm.get('last_name');
    }

    get email(): AbstractControl {
        return this.stripeBankAccountForm.get('email');
    }

    get birthday(): AbstractControl {
        return this.stripeBankAccountForm.get('birthday');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
