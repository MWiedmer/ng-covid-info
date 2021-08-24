import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";
import {Cases} from "./model/Cases";

@Injectable({
  providedIn: 'root'
})
export class BagFetcherService {

  private casesUrl = 'https://www.covid19.admin.ch/api/data/20210824-jrvdp23s/sources/COVID19Cases_geoRegion.json';
  private contextUrl = 'https://www.covid19.admin.ch/api/data/context';  // URL to web api

  constructor(private http: HttpClient) {

  }

  /** GET heroes from the server */
   getCases(): Observable<Cases[]> {
    return this.http.get<Cases[]>(this.casesUrl)
  }

}
