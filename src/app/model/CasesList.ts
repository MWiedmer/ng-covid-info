
import { IvyParser } from "@angular/compiler";
import { Cases } from "./Cases";

export class CasesList {
    unvacCases: Cases[] = [];
    vacCases: Cases[] = [];
    private unvacCasesArray:number[] = [];
    private vacCasesArray:number[] = [];
    private xAxisData:any[] = [];


    setUnvacCases(someCases: Cases[]) {
      this.unvacCases = someCases;
    }

    setVacCases(someCases: Cases[]) {
      this.vacCases = someCases;
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
            this.xAxisData.push(someCase.datum);
              this.vacCasesArray.push(someCase.entries);
          }
        } else {
          for (let someCase of this.unvacCases) {
            this.xAxisData.push(someCase.datum);
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

}
