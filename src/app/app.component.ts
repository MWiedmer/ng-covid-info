import {Component, OnInit, ViewChild} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Cases} from "./model/Cases";
import {CasesVacc} from "./model/CasesVacc";
import {IcuCap} from "./model/IcuCap";
import {CasesList} from "./model/CasesList";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    daysToShow: number = 50;
    title = 'Corona Info Dashboard Switzerland: Last ' +  this.daysToShow + " days";
    private contextUrl = 'https://www.covid19.admin.ch/api/data/context';  // URL to web api
    private context: any;

    doDisplay: boolean = true;
    


    options: any;
    options2: any;
    icuOptions: any;

    optioinsPie: any;
    updateOptions: any;
    updateOptions2: any;
    updatePieOptions: any;
    updateIcuOptions: any

    //cases: Cases[] = [];
    casesList: CasesList = new CasesList();
    //vacCasesList: CasesList = new CasesList();

    hospCases: Cases[] = [];
    vaccinatedHosp: CasesVacc[] = [];

    icuCap: IcuCap[] = [];
    icuCapacity: any[] = [];
    icuCovidPatients: any[] = [];
    icuNonCovidPatients: any[] = [];

    xAxisData: any[] = [];
    newHospitalized: any[] = [];
    newHospitalizedVacc: any[] = [];

    newCasesHospRollingAvg: any[] = [];
    newCasesHospaccRollAvg: any[] = [];


  pieOptions: any =  {
    title: {
        text: 'Vaccinated vs Unvaccinated Covid Patients',
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
                {value: this.casesList.getTotal(true, 7), name: 'Vaccinated'},
                {value: this.casesList.getTotal(false, 7) - this.casesList.getTotal(true, 7), name: 'Unvaccinated'}
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

        let sumOfVaccCases = 0;
        // Cases total
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.cases).subscribe((cases: any) => {
                this.casesList.setUnvacCases(cases)
                this.casesList.filterRegion("CH");
                this.casesList.slice(false, this.daysToShow);
                this.casesList.getCasesArray(false, true);

                this.updatePieChartOptions();
                this.updateOptionsCases();
                console.log("Cases loaded: " + this.casesList.unvacCases.length)

            });
        });

        // Hospitalisations Total
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.hosp).subscribe((hospCases: any) => {
                this.hospCases = hospCases.filter((hospCases: { geoRegion: string; }) => hospCases.geoRegion == "CH").slice(-this.daysToShow);
                for (let entry of this.hospCases) {
                    this.newHospitalized.push(entry.entries);
                }
                for(var _j = 0; _j < 7; _j++) {
                    this.newCasesHospRollingAvg.push(null);
                }
                getRollingAvg(this.hospCases, this.newCasesHospRollingAvg);
                this.updateOptionsHosp();
                console.log("Hosp Cases loaded: " + this.hospCases.length)
            });
        });

        // Get Vaccinated Hospitalized
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.hospVaccPersons).subscribe((vaccinatedHosp: any) => {   
                this.vaccinatedHosp = vaccinatedHosp.slice(-this.daysToShow);
                for (let entry of this.vaccinatedHosp) {
                    this.newHospitalizedVacc.push(entry.entries);
                }
                for(var _j = 0; _j < 7; _j++) {
                    this.newCasesHospaccRollAvg.push(null);
                }
                getRollingAvg(this.vaccinatedHosp, this.newCasesHospaccRollAvg);
                this.updateOptionsHosp();
                console.log("Hosp Cases Vacc loaded: " + this.vaccinatedHosp.length)
            });
        });


       // Vaccinated Cases
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.casesVaccPersons).subscribe((vaccinatedCases: any) => {
                this.casesList.setVacCases(vaccinatedCases)
                this.casesList.slice(true, this.daysToShow);
                this.casesList.getCasesArray(true, true);
                this.updatePieChartOptions();
                this.updateOptionsCases();
                console.log("Cases Vacc loaded: " + this.casesList.vacCases.length)
            });
        });

        // Get ICU Capacity 
        this.http.get(this.contextUrl).subscribe(context => {
            this.context = context;
            this.http.get(this.context.sources.individual.json.daily.hospCapacity).subscribe((hospCap: any) => {

                this.icuCap = hospCap.filter((hospCap: { geoRegion: string; }) => hospCap.geoRegion == "CH").slice(-this.daysToShow);
                for (let entry of this.icuCap) {
                    this.icuCapacity.push(entry.ICU_Capacity);
                    this.icuCovidPatients.push(entry.ICU_Covid19Patients);
                    this.icuNonCovidPatients.push(entry.ICU_NonCovid19Patients);
                }
                this.updateIcuCapOptions();
            });
            console.log("Hosp Capacity loaded");
        });

        this.icuOptions = {
        title: {
            text: 'ICU Capacity',
            left: 'center',
            top: 30,
            textStyle: {
              color: '#ccc',
            },
          },
        legend: {
            data: ['Total', 'Covid Patients', 'Non-Covid Patients'],
            align: 'left',
            left: '10%',
            top: '15%',
            orient: 'vertical',
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
                name: 'Total',
                type: 'line',
                data: this.icuCapacity,
                animationDelay: (idx: number) => idx * 10,
            },
            {
                name: 'Covid Patients',
                type: 'line',
                data: this.icuCovidPatients,
                animationDelay: (idx: number) => idx * 10,
            },
            {
                name: 'Non-Covid Patients',
                type: 'line',
                data: this.icuNonCovidPatients,
                animationDelay(idx: number) {
                    return idx * 10 + 100;
                },
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate(idx: number) {
            return idx * 5;
        },
    };


        this.options = {
            title: {
                text: 'New Covid Cases',
                left: 'center',
                top: 30,
                textStyle: {
                  color: '#ccc',
                },
              },
            legend: {
                data: ['Total', 'Total Rolling Avg', 'Vaccinated', 'Vaccinated Rolling Avg'],
                align: 'left',
                left: '10%',
                top: '15%',
                orient: 'vertical',
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
                    name: 'Total',
                    type: 'bar',
                    data: this.casesList.getCasesArray(false, false),
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Total Rolling Avg',
                    type: 'line',
                    data: this.casesList.getRollingAvg(false),
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Vaccinated',
                    type: 'bar',
                    data: this.casesList.getCasesArray(true, false),
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },                
                {
                    name: 'Vaccinated Rolling Avg',
                    type: 'line',
                    data: this.casesList.getRollingAvg(true),
                    animationDelay: (idx: number) => idx * 10,
                }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate(idx: number) {
                return idx * 5;
            },
        };

        this.options2 = {
            title: {
                text: 'New Hospitalized Covid Cases',
                left: 'center',
                top: 30,
                textStyle: {
                  color: '#ccc',
                },
              },
            legend: {
                data: ['Total', 'Total Rollling Avg', 'Vaccinated', 'Vaccinated Rolling Avg'],
                align: 'auto',
                left: '10%',
                top: '15%',
                orient: 'vertical',
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
                    name: 'Total',
                    type: 'bar',
                    data: this.newHospitalized,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Total Rollling Avg',
                    type: 'line',
                    data: this.newCasesHospRollingAvg,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Vaccinated',
                    type: 'bar',
                    data: this.newHospitalizedVacc,
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },
                {
                    name: 'Vaccinated Rolling Avg',
                    type: 'line',
                    data: this.newCasesHospaccRollAvg,
                    animationDelay: (idx: number) => idx * 10,
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
                    name: 'Total',
                    type: 'bar',
                    data: this.casesList.getCasesArray(false, false),
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Total Rolling Avg',
                    type: 'line',
                    data: this.casesList.getRollingAvg(false),
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Vaccinated',
                    type: 'bar',
                    data: this.casesList.getCasesArray(true, false),
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },                
                {
                    name: 'Vaccinated Rolling Avg',
                    type: 'line',
                    data: this.casesList.getRollingAvg(true),
                    animationDelay: (idx: number) => idx * 10,
                }
            ],
        };

    }

    private updateOptionsHosp() {
        this.updateOptions2 = {
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
                    name: 'Total',
                    type: 'bar',
                    data: this.newHospitalized,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Total Rollling Avg',
                    type: 'line',
                    data: this.newCasesHospRollingAvg,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Vaccinated',
                    type: 'bar',
                    data: this.newHospitalizedVacc,
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                },
                {
                    name: 'Vaccinated Rolling Avg',
                    type: 'line',
                    data: this.newCasesHospaccRollAvg,
                    animationDelay: (idx: number) => idx * 10,
                },
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate(idx: number) {
                return idx * 5;
            },
        };
    }

    private updateIcuCapOptions() {
        this.updateIcuOptions = {
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
                    name: 'Total',
                    type: 'line',
                    data: this.icuCapacity,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Covid Patients',
                    type: 'line',
                    data: this.icuCovidPatients,
                    animationDelay: (idx: number) => idx * 10,
                },
                {
                    name: 'Non-Covid Patients',
                    type: 'line',
                    data: this.icuNonCovidPatients,
                    animationDelay(idx: number) {
                        return idx * 10 + 100;
                    },
                }
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
                        {value: this.casesList.getTotal(true, 7), name: 'Vaccinated'},
                        {value: this.casesList.getTotal(false, 7) - this.casesList.getTotal(true, 7), name: 'Unvaccinated'}
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
        this.updateIcuCapOptions();
    }




    constructor(private http: HttpClient) {
    }



}

function getRollingAvg(cases: any[], avgRolling: number[]) {
    let rolling:number[] = [];
    let startIndex = 0;
    while(startIndex + 8  < cases.length) {
        let avgDatapoint = 0;
        for (var _i = startIndex; _i <startIndex + 7; _i++) {
              avgDatapoint += cases[_i].entries;
        }
        rolling[startIndex] = Math.floor(avgDatapoint / 7);
        avgRolling.push( Math.floor(avgDatapoint / 7));
        startIndex += 1;
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

