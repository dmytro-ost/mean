import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { WORKSPACE_ROUTE } from 'src/app/core/constants';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public hide = true;
  public registrationForm!: FormGroup;
  public loginForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastr: NotificationService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    public readonly localStorageService: LocalStorageService,
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initRegistrationForm();
    this.initLoginForm();
  }

  public login() {
    if (!this.loginForm.valid) {
      this.toastr.warning('Заповніть будь ласка форму');
      return;
    }

    this.userService
      .login({
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      })
      .pipe(
        map((token) => {
          this.localStorageService.saveToken(token.jwt_token);
          this.authService.setLogin();
          this.router.navigate([WORKSPACE_ROUTE]);
        }),
        catchError((error) => {
          this.toastr.badRequestError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  public registerNewUser() {
    if (!this.registrationForm.valid) {
      this.toastr.warning('Заповніть будь ласка форму');
      return;
    }

    const newUser: User = {
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value,
      role: this.registrationForm.controls['role'].value,
    };

    this.userService
      .registerNewUser(newUser)
      .pipe(
        map((answer) => this.toastr.info(answer.message)),
        switchMap((_) =>
          this.userService.login({
            email: newUser.email,
            password: newUser.password,
          })
        ),
        map((token) => {
          this.localStorageService.saveToken(token.jwt_token);
          this.authService.setLogin();
          this.router.navigate([WORKSPACE_ROUTE]);
        }),
        catchError((error) => {
          this.toastr.badRequestError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private initRegistrationForm(): void {
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  private initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
