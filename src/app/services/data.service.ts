import { Injectable } from '@angular/core';
import { Application } from '../interfaces/common';

const STATUSES = ["To Apply", "Applied", "Rejected", "Telephonic Interview",
  "Coding Test", "Technical Round 1", "Technical Round 2", "Technical Round 3",
  "Behaviour Round", "Offer", "Accepted Offer"];

@Injectable({
  providedIn: 'root'
})
export class DataService {

  protected _store;

  constructor() {
    this._store = localStorage;
  }

  save(key: string, value: any) {
    this._store.setItem(key, typeof value != 'string' ? JSON.stringify(value) : value);
  }

  get(key: string) {
    return JSON.parse(this._store.getItem(key));
  }

  getCompanies(): string[] {
    let companies = this.get("applications").map((a: Application) => a.company);
    let noDuplicateCompanies = [];
    for (let i = 0; i < companies.length; i++) {
      if (noDuplicateCompanies.indexOf(companies[i]) < 0) {
        noDuplicateCompanies.push(companies[i]);
      }
    }
    return noDuplicateCompanies;
  }

  getPositions(): string[] {
    let positions = this.get("applications").map((a: Application) => a.position);
    let noDuplicatePositions = [];
    for (let i = 0; i < positions.length; i++) {
      if (noDuplicatePositions.indexOf(positions[i]) < 0) {
        noDuplicatePositions.push(positions[i]);
      }
    }
    return noDuplicatePositions;
  }

  getStatuses(): string[] {
    let statuses = this.get("applications").map((a: Application) => a.status);
    let noDuplicateStatuses = [];
    for (let i = 0; i < statuses.length; i++) {
      if (noDuplicateStatuses.indexOf(statuses[i]) < 0) {
        noDuplicateStatuses.push(statuses[i]);
      }
    }

    return STATUSES.concat(noDuplicateStatuses);
  }
}
