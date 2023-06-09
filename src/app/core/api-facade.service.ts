import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const BASE_URL = environment.restApiUrl;

@Injectable({
	providedIn: 'root',
})
export class ApiFacadeService {
	constructor(
		private http: HttpClient
	) {

	}

	private getCommonHeader(): HttpHeaders {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/json; charset=utf-8');
		return headers;
	}

	/**
	 * Make http request to get data from back-end.
	 * @param requestUrl The http request URL right after the base URL. Eg. 'user/profile'.
	 * @param params Parameters to be passed into the api for filtering purposes.
	 */
	public httpRequestGet(requestUrl: string, params?: object): Observable<any> {
		const httpRequestOptions: any = {
			headers: this.getCommonHeader(),
		};

		if (params) {
			httpRequestOptions.params = params;
		}

		return this.http.get(
			`${BASE_URL}/${requestUrl}`,
			httpRequestOptions,
		);
	}
}
