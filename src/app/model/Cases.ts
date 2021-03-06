export interface Cases {
    geoRegion: string;
    datum: string;
    entries: number;
    sumTotal: number;
    timeframe_7d: boolean;
    offset_last7d: number;
    sumTotal_last7d: number;
    timeframe_14d: boolean;
    offset_last14d: number;
    sumTotal_last14d: number;
    timeframe_28d: boolean;
    offset_last28d: number;
    sumTotal_last28d: number;
    timeframe_phase2: boolean;
    offset_Phase2: number;
    sumTotal_Phase2: number;
    timeframe_phase2b: boolean;
    offset_Phase2b: number;
    sumTotal_Phase2b: number;
    timeframe_phase3: boolean;
    offset_Phase3: number;
    sumTotal_Phase3: number;
    timeframe_vacc_info: boolean;
    offset_vacc_info: number;
    sumTotal_vacc_info: number;
    timeframe_all: boolean;
    entries_diff_last_age: number;
    pop: number;
    inz_entries: number;
    inzsumTotal: number;
    type: string;
    type_variant: string;
    version: string;
    datum_unit: string;
    entries_letzter_stand: number;
    entries_neu_gemeldet: number;
    entries_diff_last: number;
  }
