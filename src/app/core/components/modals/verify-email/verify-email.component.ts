import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  email = 'test@gmail.com';
  verifyCodeForm: FormGroup;
  sentCode: number;
  codeVerified = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<VerifyEmailComponent>,
    private fb: FormBuilder
  ) {
    console.log(data)
    this.sentCode = data.code;
    this.verifyCodeForm = this.fb.group({code: [null, Validators.required]});
  }

  ngOnInit(): void {
  }

  verifyCode() {
    console.log(+this.verifyCodeForm.value.code, this.sentCode)
    if (this.sentCode === +this.verifyCodeForm.value.code) {
      this.codeVerified = true;
      this.matDialogRef.close(true);
    }
  }

}
