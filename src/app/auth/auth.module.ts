import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { VerifyEmailComponent } from '@core/components/modals/verify-email/verify-email.component';
import {MaterialModule} from '@core/modules/material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyEmailComponent, ForgotPasswordComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        MaterialModule
    ]
})
export class AuthModule {
}
