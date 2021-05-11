import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'updateUserStocks'
})
export class UpdateUserStocksPipe implements PipeTransform {

    constructor() {
    }

    transform(userStocks: any[], stock: any, selectedTypeId: any): any {
        let following = !!userStocks.find(f => f.name === stock.name);

        if (!following) {
            userStocks.push({
                name: stock.name,
                symbol: stock.symbol,
                change: stock.change,
                changesPercentage: stock.changesPercentage,
                price: stock.price,
                type_id: selectedTypeId || stock.type_id
            });
            following = true;
        } else {
            userStocks = userStocks.filter(f => f.name !== stock.name);
            following = false;
        }


        return {userStocks, following};
        // return userStocks;
    }

}
