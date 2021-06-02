import { User } from './../../models/user';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private subject = new Subject<any>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
   }

   public get userValue(): User {
    return this.userSubject.value;
}

sendClickEvent() {
  this.subject.next();
}
getClickEvent(): Observable<any> {
  return this.subject.asObservable();
}

login(email, password) {
  let data = {
    matricule: email,
    password: password
  }
  return this.http.post<User>(`${environment.apiUrl}/api/auth/signin`, data)
      .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
      }));
}

logout() {
  // remove user from local storage and set current user to null           
  localStorage.removeItem('user');
  this.userSubject.next(null);
  this.router.navigate(['/login']);
}

sendLogout() {
  var data = { "username": this.userValue.username, "email": this.userValue.email };
  //console.log(data);
  this.http.post(`${environment.apiUrl}/api/auth/logout`, data).subscribe((data) => {
      //console.log(data);
  });
}

register(user: User) {
  return this.http.post(`${environment.apiUrl}/api/auth/signup`, user);
}


}
