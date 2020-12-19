import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshtoken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer : any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBRkMzgFiZimoXmj6kFd5NqCNzV5u5By20',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.HandleError),
        tap((resData) => {
         this.HandleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBRkMzgFiZimoXmj6kFd5NqCNzV5u5By20',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.HandleError),
      tap((resData) => {
       this.HandleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn);
      }));
  }

  autoLogin(){
    const userData :{
      email:string,
      id: string,
      _token: string,
      _tokenExpirationDate : string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number){
   this.tokenExpirationTimer =  setTimeout(() => {
        this.logout();
    }, expirationDuration);

  }

  private HandleAuthentication(email:string, userId: string, idToken: string, expiresIn: string){
    const expirationDate = new Date(
        new Date().getTime() + +expiresIn * 1000
      );
    const user = new User(
        email,
        userId,
        idToken,
        expirationDate
      );
      this.user.next(user);
      this.autoLogout(+expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  private HandleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND': {
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage =
          'The password is invalid or the user does not have a password.';
        break;
      }
      case 'USER_DISABLED': {
        errorMessage =
          'The user account has been disabled by an administrator.';
        break;
      }
      case 'EMAIL_EXISTS': {
        errorMessage =
          'The email address is already in use by another account.';
        break;
      }
      case 'OPERATION_NOT_ALLOWED': {
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      }
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      }
      default: {
        break;
      }
    }
    return throwError(errorMessage);
  }
}
