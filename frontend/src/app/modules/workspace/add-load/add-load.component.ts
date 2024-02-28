import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError, map } from 'rxjs/operators';
import { Load } from 'src/app/models/load.model';
import { LoadService } from 'src/app/services/load.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-load',
  templateUrl: './add-load.component.html',
  styleUrls: ['./add-load.component.scss'],
})
export class AddLoadComponent implements OnInit, ErrorStateMatcher {
  public createPayloadForm!: FormGroup;

  constructor(
    private readonly toastr: NotificationService,
    private readonly loadService: LoadService,
    private readonly router: Router
  ) {}

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }

  matcher = new ErrorStateMatcher();

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.createPayloadForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      payload: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      pickup: new FormControl('', Validators.required),
      delivery: new FormControl('', Validators.required),
      width: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      length: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      height: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
    });

    // this.createPayloadForm = this.formBuilder.group({
    //   name: ['', Validators.required, Validators.maxLength(3)],
    //   payload: ['', Validators.required],
    //   pickup: ['', Validators.required],
    //   delivery: ['', Validators.required],
    //   width: [0, Validators.required],
    //   length: [0, Validators.required],
    //   height: [0, Validators.required],
    // });
  }

  createPayload() {
    if (!this.createPayloadForm.valid) {
      this.toastr.warning('Заповніть будь ласка форму');
      return;
    }

    const load: Load = {
      name: this.createPayloadForm.controls['name'].value,
      payload: +this.createPayloadForm.controls['payload'].value,
      pickup_address: this.createPayloadForm.controls['pickup'].value,
      delivery_address: this.createPayloadForm.controls['delivery'].value,
      dimensions: {
        width: +this.createPayloadForm.controls['width'].value,
        length: +this.createPayloadForm.controls['length'].value,
        height: +this.createPayloadForm.controls['height'].value,
      },
    };

    this.loadService
      .createNewLoad(load)
      .pipe(
        map((answer) => {
          this.toastr.info(answer.message);
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.toastr.badRequestError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
