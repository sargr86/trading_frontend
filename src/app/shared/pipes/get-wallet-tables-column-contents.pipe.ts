import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {CapitalizeAddSpacesPipe} from '@shared/pipes/capitalize-add-spaces.pipe';

@Pipe({
    name: 'getColumnContent'
})
export class GetWalletTablesColumnContentsPipe implements PipeTransform {

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private removeUndCapitalize: CapitalizeAddSpacesPipe
    ) {

    }


    transform(col: string, element: any): string {
        let content;

        switch (col) {
            case 'date':
                content = this.datePipe.transform(element.created * 1000, 'MMM dd yyyy HH:mm:ss');
                break;
            case 'amount':
            case 'amount_submitted':
                content = this.currencyPipe.transform(element.amount / 100, element.currency.toUpperCase());
                break;
            case 'channel':
            case 'payout_for':
                content = this.removeUndCapitalize.transform(element.metadata?.channel);
                break;
            case 'type':
                content = element.description;
                break;
            case 'status':
                content = this.removeUndCapitalize.transform(element.status);
                break;
            case 'payment_method':
                const card = element?.payment_method_details?.card;
                if (card) {
                    content = `**** **** **** ${card.last4}`;
                }
                break;
            case 'product_description':
                content = element.description;
                break;
            case 'product_name':
                content = element.metadata.name;
                break;
            default:
                content = element[col];
                break;
        }
        return content;
    }

}
