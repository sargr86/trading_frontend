import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-crypto-currency',
  templateUrl: './crypto-currency.component.html',
  styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
  ) {
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.modalService.hide();
  }

}
