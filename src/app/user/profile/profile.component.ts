import {Component, OnDestroy, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {
    API_URL,
    OWL_OPTIONS,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PROFILE_PAGE_TABS
} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {User} from '@shared/models/user';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {patternValidator} from '@core/helpers/pattern-validator';
import {
    EMAIL_PATTERN,
    NO_SPACE_PATTERN,
    NUMBER_AFTER_TEXT_PATTERN,
    TEXT_ONLY_PATTERN_WITHOUT_SPECIALS
} from '@core/constants/patterns';
import {LoaderService} from '@core/services/loader.service';
import {DROPZONE_CONFIG} from 'ngx-dropzone-wrapper';
import {AuthService} from '@core/services/auth.service';
import * as  moment from 'moment';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    isSubmitted = false;
    subscriptions: Subscription[] = [];
    currentDate = new Date();
    maxDate: Date;

    dropzoneConfig = DROPZONE_CONFIG;
    dropzoneFiles = [];

    authUser;


    constructor(
        private fb: FormBuilder,
        public loader: LoaderService,
        public auth: AuthService,
        private usersService: UsersService,
        private getAuthUser: GetAuthUserPipe,
        private toastr: ToastrService,
        public router: Router
    ) {
        this.initForm();
        this.authUser = this.getAuthUser.transform();
        this.profileForm.patchValue({...this.authUser, birthday: moment(this.authUser.birthday).format('MM/DD/YYYY')});

    }

    initForm() {
        this.profileForm = this.fb.group({
            id: [''],
            full_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
            username: ['', [Validators.required, patternValidator(NUMBER_AFTER_TEXT_PATTERN)]],
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            password: ['',
                [
                    Validators.required, patternValidator(NO_SPACE_PATTERN),
                    Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)
                ],
            ],
            // confirm_password: new FormControl('', {validators: [Validators.required], updateOn: 'blur'}),
            // confirm_password: ['', Validators.required],
            birthday: ['', Validators.required],
            avatar: ['']
        });
    }

    ngOnInit(): void {
    }

    dateChanged(e) {

    }

    removeImage() {
        this.authUser.avatar = '';
        this.profileForm.patchValue({avatar: ''});
    }

    onAddedFile(e) {
        this.dropzoneFiles.push(e[0]);
        this.profileForm.patchValue({avatar: e[0].name});
        console.log(e)
    }

    buildFormData() {
        const formData: FormData = new FormData();
        const formValue = this.profileForm.value;
        const dropFileExist = Object.entries(this.dropzoneFiles).length > 0;

        for (const field in this.profileForm.value) {
            if (field === 'birthday') {
                if (formValue.birthday) {
                    formData.append(field, moment(new Date(this.profileForm.value[field])).format('YYYY-MM-DD'));
                }
            } else if (field !== 'avatar' || !dropFileExist) {
                formData.append(field, this.profileForm.value[field]);
            }
        }

        // If drop zone file exists saving it to formData object as well
        if (dropFileExist) {

            const file = this.dropzoneFiles[0];

            const fileName = `avatar_${Date.now()}.jpg`;
            formData.append('avatar', fileName);
            formData.append('user_avatar_file', file, fileName);
        }

        return formData;
    }

    saveChanges() {
        const formData = this.buildFormData();
        this.usersService.saveProfileChanges(formData).subscribe(async (dt) => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.toastr.success('The changes are saved successfully');
            await this.router.navigateByUrl('');
        });
    }

    get fullName(): AbstractControl {
        return this.profileForm.get('full_name');
    }

    get email(): AbstractControl {
        return this.profileForm.get('email');
    }

    get pass(): AbstractControl {
        return this.profileForm.get('password');
    }

    get username(): AbstractControl {
        return this.profileForm.get('username');
    }

    get confirmPass(): AbstractControl {
        return this.profileForm.get('confirm_password');
    }

    get birthday(): AbstractControl {
        return this.profileForm.get('birthday');
    }

    get profileImg(): any {
        return this.authUser ? this.authUser.avatar : false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
