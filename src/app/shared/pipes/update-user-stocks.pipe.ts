import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'updateUserStocks'
})
export class UpdateUserStocksPipe implements PipeTransform {

    transform(userStocks: any[], stock: any, selectedTypeId: any): any {
        const following = userStocks.find(f => f.name === stock.name);

        if (!following) {
            userStocks.push({
                name: stock.name,
                symbol: stock.symbol,
                change: stock.change,
                changesPercentage: stock.changesPercentage,
                price: stock.price,
                type_id: selectedTypeId
            });
        } else {
            userStocks = userStocks.filter(f => f.name !== stock.name);
        }

        return userStocks;

    }

}
