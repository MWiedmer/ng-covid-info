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
    private context:any;


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
       
        this.http.get(this.contextUrl).subscribe(context => {   
            this.context  = context;                     
            this.http.get( this.context.sources.individual.json.daily.cases).subscribe((cases: any) => {              
              this.cases = cases.filter((cases: { geoRegion: string; }) => cases.geoRegion == "CH").slice(-50);      
              for (let entry of this.cases) {
                this.xAxisData.push(entry.datum);
                this.newCases.push(entry.entries);
            }
            console.log("Entries Cases: " + this.cases.length)                  
            });
          });



            this.http.get(this.contextUrl).subscribe(context => {   
                this.context  = context;                         
                this.http.get( this.context.sources.individual.json.daily.hosp).subscribe((hospCases: any) => {                  
                  this.hospCases = hospCases.filter((hospCases: { geoRegion: string; }) => hospCases.geoRegion == "CH").slice(-50);      
                  for (let entry of this.hospCases) {                
                    this.newHospitalized.push(entry.entries);
                }
                console.log("Entries Hospitalized: " + this.hospCases.length)                  
                });
              });

            // Get Vaccinated Hospitalized
            this.http.get(this.contextUrl).subscribe(context => {   
                this.context  = context;                         
                this.http.get( this.context.sources.individual.json.daily.hospVaccPersons).subscribe((vaccinatedHosp: any) => {                  
                  this.vaccinatedHosp = vaccinatedHosp.slice(-50);      
                  for (let entry of this.vaccinatedHosp) {                
                    this.newHospitalizedVacc.push(entry.entries);
                }
                console.log("Entries Vaccinated Hospitalized: " + this.vaccinatedHosp.length)                  
                });
              });



            this.http.get(this.contextUrl).subscribe(context => {   
                this.context  = context;                         
                this.http.get( this.context.sources.individual.json.daily.casesVaccPersons).subscribe((vaccinatedCases: any) => {                
                  this.vaccinatedCases = vaccinatedCases.slice(-50);      
                  for (let entry of this.vaccinatedCases) {                
                    this.newCasesVacc.push(entry.entries);
                }
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


    }

    constructor(private http: HttpClient ) {
    }


}
