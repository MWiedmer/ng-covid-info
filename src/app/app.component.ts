import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BagFetcherService} from "./bag-fetcher.service";
import {Cases} from "./model/Cases";
import {Observable} from "rxjs";
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid-info';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  cases: Cases[] = [];


  constructor(private bagFetcherService: BagFetcherService) {
    this.getCases();
  }

  getCases(): void {
    this.bagFetcherService.getCases()
        .subscribe(cases => this.cases = cases);
  }

  getFilteredCases(): Cases[] {
    return this.cases.filter(cases => cases.geoRegion = 'CH');
  }

}
