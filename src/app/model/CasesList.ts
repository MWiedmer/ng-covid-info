
import { Cases } from "./Cases";

export class CasesList {
    unvacCases: Cases[] = [];
    vacCases: Cases[] = [];
    private unvacCasesArray:number[] = [];
    private vacCasesArray:number[] = [];
    public xAxisData:any[] = [];

    options: any;
    



    setUnvacCases(someCases: Cases[]) {
      this.unvacCases = someCases;
    }

    setVacCases(someCases: Cases[]) {
      this.vacCases = someCases;
    }

    setXAxis() {
      for (let someCase of this.unvacCases) {
        this.xAxisData.push(someCase.datum);
      }
    }


    filterRegion(filterRegion: string) {
      this.unvacCases = this.unvacCases.filter((cases: { geoRegion: string; }) => cases.geoRegion == filterRegion)
    }

    slice(vac: boolean, last: number) {
      if(vac) {
        this.vacCases = this.vacCases.slice(-last);
      } else {
        this.unvacCases = this.unvacCases.slice(-last);
      }
    }

    getCasesArray(vac: boolean, refresh: boolean):number[]  {
      if(refresh) {
        if(vac) {
          for (let someCase of this.vacCases) {
              this.vacCasesArray.push(someCase.entries);
          }

        } else {
          for (let someCase of this.unvacCases) {
              this.unvacCasesArray.push(someCase.entries);
          }
        }
      }
      if(vac) {
        return this.vacCasesArray;
      } else {
        return this.unvacCasesArray;
      }
        
    }

    getTotal(vac:boolean, lastDays:number) {
      let  lastNdays = this.getCasesArray(vac, false).slice(-lastDays);
          let sum: number = 0;
          for(let day of lastNdays) {
              sum = sum + day;
          }
          return sum;
    }

    getRollingAvg(vac: boolean) {
      let newCasesRollingAvg:any[] = [];
      for(var _j = 0; _j < 7; _j++) {
        newCasesRollingAvg.push(null);
      }
      let rolling:number[] = [];
      let startIndex = 0;
      while(startIndex + 8  < this.getCasesArray(vac, false).length) {
          let avgDatapoint = 0;
          for (var _i = startIndex; _i <startIndex + 7; _i++) {
                avgDatapoint +=  this.getCasesArray(vac, false)[_i];
          }
          rolling[startIndex] = Math.floor(avgDatapoint / 7);
          newCasesRollingAvg.push( Math.floor(avgDatapoint / 7));
          startIndex += 1;
      }
      return newCasesRollingAvg;
  }


  setOptions() {
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
              data: this.getCasesArray(false, false),
              animationDelay: (idx: number) => idx * 10,
          },
          {
              name: 'Total Rolling Avg',
              type: 'line',
              data: this.getRollingAvg(false),
              animationDelay: (idx: number) => idx * 10,
          },
          {
              name: 'Vaccinated',
              type: 'bar',
              data: this.getCasesArray(true, false),
              animationDelay(idx: number) {
                  return idx * 10 + 100;
              },
          },                
          {
              name: 'Vaccinated Rolling Avg',
              type: 'line',
              data: this.getRollingAvg(true),
              animationDelay: (idx: number) => idx * 10,
          }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate(idx: number) {
          return idx * 5;
      },
  };

  }

  

}
