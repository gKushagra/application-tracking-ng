import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonService } from "../../../../services/common.service";
import { startWith, map } from "rxjs/operators";
import { Application } from "../../../../interfaces/common";
import { ApplicationControls } from "../../../../enums/common.enum";
import { DataService } from 'src/app/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss']
})
export class NewApplicationComponent implements OnInit {

  public newApplicationForm: FormGroup;
  private companies: string[];
  private positions: string[];
  private statuses: string[];
  public filteredCompanies: Observable<string[]>;
  public filteredPositions: Observable<string[]>;
  public filteredStatuses: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Application,
    private commonService: CommonService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<NewApplicationComponent>,
  ) {
    this.newApplicationForm = new FormGroup({
      id: new FormControl(this.commonService.generateUUID()),
      company: new FormControl(null, [Validators.required]),
      position: new FormControl(null),
      status: new FormControl(null, [Validators.required]),
      date: new FormControl(new Date()),
      link: new FormControl(null),
      username: new FormControl(null),
      password: new FormControl(null),
      todo: new FormControl([]),
      contacts: new FormControl([])
    });

    if (this.data) {
      this.newApplicationForm.patchValue(this.data);
      this.newApplicationForm.controls.date.patchValue(new Date(data.date));
    }

    this.companies = this.dataService.getCompanies();
    this.positions = this.dataService.getPositions();
    this.statuses = this.dataService.getStatuses();
  }

  ngOnInit(): void {
    this.filteredCompanies = this.newApplicationForm.controls.company
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, ApplicationControls.company))
      );

    this.filteredPositions = this.newApplicationForm.controls.position
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, ApplicationControls.position))
      );

    this.filteredStatuses = this.newApplicationForm.controls.status
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, ApplicationControls.status))
      );
  }

  saveNewApplication(): void {
    this.dialogRef.close(this.newApplicationForm.value);
  }

  editApplication(): void {
    this.dialogRef.close(this.newApplicationForm.value);
  }

  private _filter(value: string, key: ApplicationControls): string[] {
    const filterValue = value.toLowerCase();

    switch (key) {
      case ApplicationControls.company:
        return this.companies.filter(option =>
          option.toLowerCase().includes(filterValue));

      case ApplicationControls.position:
        return this.positions.filter(option =>
          option.toLowerCase().includes(filterValue));

      case ApplicationControls.status:
        return this.statuses.filter(option =>
          option.toLowerCase().includes(filterValue));

      default:
        return [];
    }
  }
}
