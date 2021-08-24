import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {Cases} from "./model/Cases";
import {CasesVacc} from "./model/CasesVacc";

@Injectable({
    providedIn: 'root'
})
export class BagFetcherService {

    private casesUrl = 'https://www.covid19.admin.ch/api/data/20210824-jrvdp23s/sources/COVID19Cases_geoRegion.json';
    private hospUrl = 'https://www.covid19.admin.ch/api/data/20210824-jrvdp23s/sources/COVID19Hosp_geoRegion.json'
    private vaccinatedCasesUrl = 'https://www.covid19.admin.ch/api/data/20210824-jrvdp23s/sources/COVID19Cases_vaccpersons.json';
    private vaccinatedHospUrl = 'https://www.covid19.admin.ch/api/data/20210824-jrvdp23s/sources/COVID19Hosp_vaccpersons.json'
    private contextUrl = 'https://www.covid19.admin.ch/api/data/context';  // URL to web api

    constructor(private http: HttpClient) {

    }

    /** GET heroes from the server */
    getCases(): Observable<Cases[]> {
        return this.http.get<Cases[]>(this.casesUrl)
    }

    /** GET heroes from the server */
    getHospitalized(): Observable<Cases[]> {
        return this.http.get<Cases[]>(this.hospUrl)
    }

    getVaccinatedCases(): Observable<CasesVacc[]> {
        return this.http.get<CasesVacc[]>(this.vaccinatedCasesUrl)
    }

    getVaccinatedHospitalized(): Observable<CasesVacc[]> {
        return this.http.get<CasesVacc[]>(this.vaccinatedHospUrl)
    }

}
