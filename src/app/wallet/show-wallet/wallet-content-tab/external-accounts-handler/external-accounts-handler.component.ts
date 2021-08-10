import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountsService} from '@core/services/wallet/accounts.service';
import {LoaderService} from '@core/services/loader.service';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-external-accounts-handler',
    templateUrl: './external-accounts-handler.component.html',
    styleUrls: ['./external-accounts-handler.component.scss']
})
export class ExternalAccountsHandlerComponent implements OnInit {
    bankAccount;
    debitCardAccount;
    defaultExtAccount;
    dataLoading = false;

    @Input() userCards = [];
    @Output() extAccountChanged = new EventEmitter();


    constructor(
        private accountsService: AccountsService,
        public router: Router,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.getStripeAccount();
    }

    getStripeAccount() {
        const params = {stripe_account_id: this.userCards?.[0]?.stripe_account_id};
        if (params.stripe_account_id) {
            this.accountsService.getStripeAccount(params).subscribe(dt => {
                const externalAccounts = dt?.external_accounts?.data;
                this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
                this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
                this.defaultExtAccount = externalAccounts.find(t => t.default_for_currency).object;
                console.log(this.defaultExtAccount)
                this.subject.changeDefaultExtAccount(this.defaultExtAccount);
            });
        }

    }

    async addExtAccount() {
        await this.router.navigate(['wallet/save-bank-account']);
    }


    removeBankAccount(bankAccount) {
        this.dataLoading = true;
        const params = {account_id: bankAccount.account, bank_id: bankAccount.id};
        this.accountsService.removeBankAccount(params).subscribe(dt => {
            this.bankAccount = null;
            this.dataLoading = false;
        });
    }

    removeDebitCard(debitCard) {
        this.dataLoading = true;
        const params = {account_id: debitCard.account, card_id: debitCard.id};
        this.accountsService.removeDebitCard(params).subscribe(dt => {
            this.debitCardAccount = null;
            this.dataLoading = false;
        });
    }

    setAsDefaultExtAccount(acc) {
        this.dataLoading = true;
        this.accountsService.setAsDefaultExternalAccount({
            stripe_account_id: acc.account,
            ext_account_id: acc.id
        }).subscribe(dt => {
            const externalAccounts = dt?.external_accounts?.data;
            this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
            this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
            this.dataLoading = false;
            this.defaultExtAccount = externalAccounts.find(t => t.default_for_currency).object;
            this.extAccountChanged.emit(this.defaultExtAccount);
            this.subject.changeDefaultExtAccount(this.defaultExtAccount);
        });
    }

}
