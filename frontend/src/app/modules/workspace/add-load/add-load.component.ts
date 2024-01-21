import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class AddLoadComponent implements OnInit {
  public createPayloadForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastr: NotificationService,
    private readonly loadService: LoadService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.createPayloadForm = this.formBuilder.group({
      name: ['', Validators.required],
      payload: ['', Validators.required],
      pickup: ['', Validators.required],
      delivery: ['', Validators.required],
      width: [0, Validators.required],
      length: [0, Validators.required],
      height: [0, Validators.required],
    });
  }

  createPayload() {
    if (!this.createPayloadForm.valid) {
      this.toastr.warning('Заповніть будь ласка форму');
      return;
    }

    const load: Load = {
      name: this.createPayloadForm.controls['name'].value,
      payload: this.createPayloadForm.controls['payload'].value,
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
