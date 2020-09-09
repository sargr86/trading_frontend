import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../constants/global';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
  ) {
  }

  /**
   * Sends data for user registration
   * @param params user parameters
   */
  register(params) {
    return this.httpClient.post(`${API_URL}auth/register`, params);
  }

  /**
   * Checks to see if user logged in/ token expired
   */
  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  login(params) {
    return this.httpClient.post<any>(`${API_URL}auth/login`, params);
  }
}
