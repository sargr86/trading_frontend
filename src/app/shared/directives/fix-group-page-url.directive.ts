import {Directive, HostListener, Input} from '@angular/core';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';
import {Router} from '@angular/router';

@Directive({
    selector: '[appNavigateToFixedGroupUrl]'
})
export class FixGroupPageUrlDirective {

    @Input() name;

    constructor(
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe,
        private router: Router
    ) {
    }

    @HostListener('click', ['$event'])
    async onClick() {
        console.log('OK');
        const url = '/groups/' + this.name.replace(' /g', '_') + '/about';
        await this.router.navigate([this.lowerCaseRemoveSpaces.transform(url)]);
    }

}
