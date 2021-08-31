import {Component, OnInit, ViewChild} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Cases} from "./model/Cases";
import {CasesVacc} from "./model/CasesVacc";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    

    title = 'covid-info';
    private contextUrl = 'https://www.covid19.admin.ch/api/data/context';  // URL to web api
    private context: any;

    doDisplay: boolean = true;


    options: any;
    options2: any;

    optioinsPie: any;
    updateOptions: any;
    updateOptions2: any;
    updatePieOptions: any;

    cases: Cases[] = [];

    hospCases: Cases[] = [];
    vaccinatedCases: CasesVacc[] = [];
    vaccinatedHosp: CasesVacc[] = [];

    xAxisData: any[] = [];
    newCases: any[] = [];
    newCasesRollingAvg: any[] = [];
    newCasesVaccRollAvg: any[] = [];
    newCasesVacc: any[] = [];
    newHospitalized: any[] = [];
    newHospitalizedVacc: any[] = [];

    latestVaccinated: number = 0;
    latestUnvaccinated: number = 0;


  pieOptions: any =  {
    title: {
        text: 'Vaccinated vs Unvaccinated Patients',
        left: 'center'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: 'patie',
            type: 'pie',
            radius: '50%',
            data: [
                {value: this.latestVaccinated, name: 'Latest Vaccinated'},
                {value: this.latestUnvaccinated - this.latestVaccinated, name: 'Latest Unvaccinated'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

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
               
                console.log("Entries Total: " + sumofUnvaccCases)
                for(var _j = 0; _j < 7; _j++) {
                    this.newCasesRollingAvg.push(null);
                }
                getRollingAvg(this.cases, this.newCasesRollingAvg);
                console.log(this.newCasesRollingAvg);
                const last7days = this.cases.slice(-7);
                let sum: number = 0;
                for(let day of last7days) {
                    sum = sum + day.entries;
                }
                console.log("Cases Last 7 Days: " + sum);
                console.log("Rolling Avg Array: " + this.newCasesRollingAvg);
                //this.pieChartData[0] =  this.cases[this.cases.length-1].sumTotal;
                this.latestUnvaccinated = sum;


                this.updatePieChartOptions();
                this.updateOptionsCases();

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
                this.updateOptionsHosp();
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
                this.updateOptionsHosp();
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
                console.log("Entries Vaccinated: " + this.vaccinatedCases.length)

                const last7days = this.vaccinatedCases.slice(-7);
                let sum: number = 0;
                for(let day of last7days) {
                    sum = sum + day.entries;
                }
                for(var _j = 0; _j < 7; _j++) {
                    this.newCasesVaccRollAvg.push(null);
                }
                getRollingAvg(this.vaccinatedCases, this.newCasesVaccRollAvg);
                console.log("Vaccinated Cases Last 7 Days: " + sum);



                this.latestVaccinated = sum;
                this.updatePieChartOptions();
                console.log(this.vaccinatedCases);
                this.updateOptionsCases();
            });
        });


        this.options = {
            legend: {
                data: ['New Cases', 'New Cases Rolling Avg', 'New vaccinated Cases', 'New vaccinated Cases Rolling Avg'],
                align: 'left',
            },
            tooltip: {},
            xAxis: {
                data: this.xAxisData,
                silent: false,
                splitLine: {
                    show: true,
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
                    name: 'New Cases Rolling Avg',
                    type: 'line',
                    data: this.newCasesRollingAvg,
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
                {
                    name: 'New vaccinated Cases Rolling Avg',
                    type: 'line',
                    data: this.newCasesVaccRollAvg,
                    animationDelay: (idx: number) => idx * 10,
                }
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

    public toggleGraph() {
        //this.doDisplay = !this.doDisplay;
        this.updateAllOptions();
    }

    private updateOptionsCases() {
        this.updateOptions = {
            xAxis: {
                data: this.xAxisData,
                silent: false,
                splitLine: {
                    show: false,
                },
            },
            series: [
                {
                    name: 'New Cases',
                    type: 'bar',
                    data: this.newCases,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'New Cases Rolling Avg',
                    type: 'line',
                    data: this.newCasesRollingAvg,
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
                {
                    name: 'New vaccinated Cases Rolling Avg',
                    type: 'line',
                    data: this.newCasesVaccRollAvg,
                    animationDelay: (idx: number) => idx * 10,
                }
            ],
        };
    }

    private updateOptionsHosp() {
        this.updateOptions2 = {
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

    private updatePieChartOptions() {
        this.updatePieOptions = {
            series: [
                {
                    name: 'patie',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        {value: this.latestVaccinated, name: 'Latest Vaccinated'},
                        {value: this.latestUnvaccinated - this.latestVaccinated, name: 'Latest Unvaccinated'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }

    private updateAllOptions() {
        this.updateOptionsCases();
        this.updateOptionsHosp();
        this.updatePieChartOptions();
    }




    constructor(private http: HttpClient) {
    }



}

function getRollingAvg(cases: any[], avgRolling: number[]) {
    console.log("Cases to Analyzs: "  + cases);
    let rolling:number[] = [];
    let startIndex = 0;
    while(startIndex + 8  < cases.length) {
        //console.log("Index Begin: " +startIndex);
        let avgDatapoint = 0;
        for (var _i = startIndex; _i <startIndex + 7; _i++) {
            //console.log("Inde<: " + startIndex +", Case " + _i + " to Analyzs: "  + cases[_i]);
              avgDatapoint += cases[_i].entries;
        }
        rolling[startIndex] = Math.floor(avgDatapoint / 7);
        avgRolling.push( Math.floor(avgDatapoint / 7));
        startIndex += 1;
        //console.log("Next Index: " +startIndex);
    }
    return rolling;
}



function calculateAvg(cases: number[]) {
    length = cases.length;
    let sum = 0;
    for(let entry of cases) {
        sum = sum + entry
    }
    return sum / length;
}

