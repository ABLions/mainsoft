import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanies() {
    return this.http.get(`${environment.apiEndpoint}/company`);
  }

  getCompanyByNit(nit: string) {
    return this.http.get(`${environment.apiEndpoint}/company/${nit}`);
  }

  createCompany(company: any) {
    return this.http.post(`${environment.apiEndpoint}/company`, company);
  }

  updateCompany(nit: string, company: any) {
    return this.http.put(`${environment.apiEndpoint}/company/${nit}`, company);
  }

  deleteCompany(nit: string) {
    return this.http.delete(`${environment.apiEndpoint}/company/${nit}`);
  }
}
