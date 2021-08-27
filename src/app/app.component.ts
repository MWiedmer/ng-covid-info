import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Cases} from "./model/Cases";
import {CasesVacc} from "./model/CasesVacc";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'covid-info';
    private contextUrl = 'https://www.covid19.admin.ch/api/data/context';  // URL to web api
    private context: any;


    options: any;
    options2: any;
    optioinsPie: any;

    cases: Cases[] = [];
    hospCases: Cases[] = [];
    vaccinatedCases: CasesVacc[] = [];
    vaccinatedHosp: CasesVacc[] = [];

    xAxisData: any[] = [];
    newCases: any[] = [];
    newCasesVacc: any[] = [];
    newHospitalized: any[] = [];
    newHospitalizedVacc: any[] = [];

    latestVaccinated: number = 0;
    latestUnvaccinated: number = 0;


    ngOnInit(): void {

        let sumofUnvaccCases = 0;
        let sumOfVaccCases = 0;
        // Cases total
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.cases).subscribe((cases: any) => {
                this.cases = cases.filter((cases: { geoRegion: string; }) => cases.geoRegion == "CH").slice(-50);
                for (let entry of this.cases) {
                    this.xAxisData.push(entry.datum);
                    this.newCases.push(entry.entries);
                }
                sumofUnvaccCases = this.cases[this.cases.length-1].sumTotal;
                console.log(this.cases[this.cases.length-1].sumTotal);
                console.log("Entries Total: " + sumofUnvaccCases)
            });
        });

        // Hospitalisations Total
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.hosp).subscribe((hospCases: any) => {
                this.hospCases = hospCases.filter((hospCases: { geoRegion: string; }) => hospCases.geoRegion == "CH").slice(-50);
                for (let entry of this.hospCases) {
                    this.newHospitalized.push(entry.entries);
                }
                console.log("Entries Hospitalized: " + this.hospCases.length)
            });
        });

        // Get Vaccinated Hospitalized
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.hospVaccPersons).subscribe((vaccinatedHosp: any) => {
                this.vaccinatedHosp = vaccinatedHosp.slice(-50);
                for (let entry of this.vaccinatedHosp) {
                    this.newHospitalizedVacc.push(entry.entries);
                }
                console.log("Entries Vaccinated Hospitalized: " + this.vaccinatedHosp.length)
            });
        });


       // Vaccinated Cases
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.casesVaccPersons).subscribe((vaccinatedCases: any) => {
                this.vaccinatedCases = vaccinatedCases.slice(-50);
                for (let entry of this.vaccinatedCases) {
                    this.newCasesVacc.push(entry.entries);
                }
                sumOfVaccCases = this.vaccinatedCases[this.vaccinatedCases.length-1].sumTotal;
                sumofUnvaccCases = sumofUnvaccCases - sumOfVaccCases;
                console.log("Entries Vaccinated: " + this.vaccinatedCases.length)
            });
        });


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

        this.optioinsPie = {
            title: {
                text: 'Share Vaccinated / Unvaccinated',
                subtext: 'Total',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['Unvaccinated', 'Vaccinated']
            },
            calculable: true,
            series: [
                {
                    name: 'area',
                    type: 'pie',
                    radius: [30, 110],
                    roseType: 'area',
                    data: [
                        {value: sumofUnvaccCases, name: 'Unvaccinated'},
                        {value: sumOfVaccCases, name: 'Vaccinated'}
                    ]
                }
            ]

        };




    }

    constructor(private http: HttpClient) {
    }


}
