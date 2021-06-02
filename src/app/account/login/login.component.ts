import { AccountService } from './../../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //public toastService: ToastService,        
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    // get return url from route parameters or default to '/' 
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.f[controlName].hasError(errorName);
  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    //console.log("check!");

    this.loading = true;
    this.accountService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.toastr.error( 'erreur', 'Mots de passe ou utilisateur incorrect');
            });
}

}
