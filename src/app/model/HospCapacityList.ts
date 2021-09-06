import { HospCapa } from "./HospCapa";

export class HospCapacityList {
    hospCapacityEntries: HospCapa[] = [];
    public relativeChangesTotal:number[] = [];
    public relativeChangesCovid:number[] = [];
    public relativeChangesICUTotal:number[] = [];
    public relativeChangesICUCovid:number[] = [];

    setHospCapaEntries(entries: HospCapa[]) {
        this.hospCapacityEntries = entries;
    } 


    public setRelativeChangeTotal() {
        let previous:number = this.hospCapacityEntries[0].Total_AllPatients;
        for(let dailyEntry of this.hospCapacityEntries) {
            let relativeChange = dailyEntry.Total_AllPatients - previous;
            this.relativeChangesTotal.push(relativeChange);
            previous = dailyEntry.Total_AllPatients;
            
        }
    }

    public setRelativeChangeCovid() {
        let previous:number = this.hospCapacityEntries[0].Total_Covid19Patients;
        for(let dailyEntry of this.hospCapacityEntries) {
            let relativeChange = dailyEntry.Total_Covid19Patients - previous;
            this.relativeChangesCovid.push(relativeChange);
            previous = dailyEntry.Total_Covid19Patients;
        }
    }

    public setRelativeChangeICUTotal() {
        let previous:number = this.hospCapacityEntries[0].ICU_AllPatients;
        for(let dailyEntry of this.hospCapacityEntries) {
            let relativeChange = dailyEntry.ICU_AllPatients - previous;
            this.relativeChangesICUTotal.push(relativeChange);
            previous = dailyEntry.ICU_AllPatients;
            
        }
    }

    public setRelativeChangeICUCovid() {
        let previous:number = this.hospCapacityEntries[0].ICU_Covid19Patients;
        for(let dailyEntry of this.hospCapacityEntries) {
            let relativeChange = dailyEntry.ICU_Covid19Patients - previous;
            this.relativeChangesICUCovid.push(relativeChange);
            previous = dailyEntry.ICU_Covid19Patients;
        }
    }
}