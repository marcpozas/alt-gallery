import { UserService } from './../../../services/user.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ height: '0', opacity: '0' })),
      transition(':enter, :leave', [
        animate('300ms ease-in-out', style({ height: '*', opacity: '1' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  title: string = "Login";
  formErrors: any = {
    login: {
      "identification": false
    },
    register: {
      "identification": false,
      "password": false
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoginComponent>,
              private user: UserService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.title = this.data.mode;
    this.loginForm = this.fb.group({
      identification: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    this.checkForm();
    if (this.title === 'Login' && this.loginForm.valid) {
      console.log('Login form submitted with values:', this.loginForm.value);
      this.user.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.successSnackBar("Logged", 3000)
          this.onClose();
        },
        (error) => {
          console.error('Login failed', error);
          this.formErrors["login"]["identification"] = true;
        }
      );

    } else if (this.title === 'Register' && this.registerForm.valid) {
      console.log('Registration form submitted with values:', this.registerForm.value);
      this.user.register(this.registerForm.value).subscribe(
        (response) => {
          if (response.status === 'ok' && response.message === 'User registered') {
            this.successSnackBar("Registration successfull!", 3000)
            this.onClose();
          }
        },
        (error) => {
          if (error.error.message === 'This username or email already exists.') {
            console.error('Registration failed', error.error.message);
            this.formErrors["register"]["identification"] = true;
          } else if (error.error.message === 'Passwords are different') {
            console.error('Different passwords');
            this.formErrors["register"]["password"] = true;
          }
        }
      );
    }
  }

  public onModeChange(mode: string): void {
    this.title = mode;
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public checkForm(): void {
    this.formErrors["login"]["identification"] = false;
    this.formErrors["register"]["identification"] = false;
    this.formErrors["register"]["password"] = false;
  }

  public successSnackBar(message: string, duration: number): void {
    this.snackBar.open(message, "Close", {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'registration-snackbar'
    });
  }
}
