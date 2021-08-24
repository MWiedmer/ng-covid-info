import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {BagFetcherService} from "./bag-fetcher.service";
import {Cases} from "./model/Cases";
import {Observable} from "rxjs";
import {MatTableModule} from '@angular/material/table';
import {CasesVacc} from "./model/CasesVacc";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'covid-info';
    options: any;
    options2: any;

    cases: Cases[] = [];
    hospCases: Cases[] = [];
    vaccinatedCases: CasesVacc[] = [];
    vaccinatedHosp: CasesVacc[] = [];

     xAxisData: any[] = [];
     newCases: any[] = [];
     newCasesVacc: any[] = [];
     newHospitalized: any[] = [];
     newHospitalizedVacc: any[] = [];





    ngOnInit(): void {

        this.bagFetcherService.getCases()
            .subscribe(cases => {
                    this.cases = cases.filter(cases => cases.geoRegion == "CH").slice(-50);
                    for (let entry of this.cases) {
                        this.xAxisData.push(entry.datum);
                        this.newCases.push(entry.entries);
                    }
                    console.log("Entries Cases: " + this.cases.length)
                }
            );

        this.bagFetcherService.getHospitalized()
            .subscribe(hospCases => {
                    this.hospCases = hospCases.filter(hospCases => hospCases.geoRegion == "CH").slice(-50);
                    for (let entry of this.hospCases) {
                        this.newHospitalized.push(entry.entries);
                    }
                    console.log("Entries Hospitalized: " + this.hospCases.length)
                }
            );

        this.bagFetcherService.getVaccinatedHospitalized()
            .subscribe(vaccinatedHosp => {
                    this.vaccinatedHosp = vaccinatedHosp.slice(-50);
                    for (let entry of this.vaccinatedHosp) {
                        this.newHospitalizedVacc.push(entry.entries);
                    }
                    console.log("Entries Vaccinated Hosp: " + this.vaccinatedHosp.length)
                }
            );

        this.bagFetcherService.getVaccinatedCases()
            .subscribe(vaccinatedCases => {
                    this.vaccinatedCases = vaccinatedCases.slice(-50);
                    for (let entry of this.vaccinatedCases) {
                        this.newCasesVacc.push(entry.entries);
                    }
                    console.log("Entries Vaccinated: " + this.vaccinatedCases.length)
                }
            );




        this.options = {
            legend: {
                data: ['New Cases', 'New vaccinated Cases'],
                align: 'left',
            },
            tooltip: {},
            xAxis: {
                data: this.xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [
                {
                    name: 'New Cases',
                    type: 'bar',
                    data: this.newCases,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'New vaccinated Cases',
                    type: 'bar',
                    data: this.newCasesVacc,
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate(idx: number) {
                return idx * 5;
            },
        };

        this.options2 = {
            legend: {
                data: ['New Hospitalized', 'New vaccinated Hospitalized'],
                align: 'left',
            },
            tooltip: {},
            xAxis: {
                data: this.xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            yAxis: {},
            series: [
                {
                    name: 'New Hospitalized',
                    type: 'bar',
                    data: this.newHospitalized,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'New vaccinated Hospitalized',
                    type: 'bar',
                    data: this.newHospitalizedVacc,
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate(idx: number) {
                return idx * 5;
            },
        };


    }

    constructor(private bagFetcherService: BagFetcherService) {
    }


}
