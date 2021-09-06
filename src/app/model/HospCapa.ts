    export interface HospCapa {
        date: string;
        geoRegion: string;
        ICU_AllPatients: number;
        ICU_Covid19Patients: number;
        ICU_Capacity: number;
        Total_AllPatients: number;
        Total_Covid19Patients: number;
        Total_Capacity: number;
        ICU_NonCovid19Patients: number;
        ICU_FreeCapacity: number;
        Total_NonCovid19Patients: number;
        Total_FreeCapacity: number;
        timeframe_14d: boolean;
        timeframe_28d: boolean;
        timeframe_phase2: boolean;
        timeframe_phase2b: boolean;
        timeframe_phase3: boolean;
        timeframe_all: boolean;
        type_variant: string;
        ICUPercent_AllPatients: number;
        ICUPercent_NonCovid19Patients: number;
        ICUPercent_Covid19Patients: number;
        ICUPercent_FreeCapacity: number;
        ICUPercent_Capacity: number;
        TotalPercent_AllPatients: number;
        TotalPercent_NonCovid19Patients: number;
        TotalPercent_Covid19Patients: number;
        TotalPercent_FreeCapacity: number;
        TotalPercent_Capacity: number;
        type: string;
        version: string;
    }

