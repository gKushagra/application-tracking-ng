import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Application, Contact, Todo } from 'src/app/interfaces/common';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { NewApplicationComponent } from '../toolbar/new-application/new-application.component';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applications: Application[];
  displayedColumns: string[] = ['company', 'status', 'position', 'link', 'date', 'actions'];
  dataSource: MatTableDataSource<Application>;
  viewApplication: boolean;
  viewingApplication: Application;
  contactForm: FormGroup;
  todoDescription: FormControl;

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
    private dialog: MatDialog,
  ) {
    this.applications = this.dataService.get("applications");
    this.dataSource = new MatTableDataSource(this.applications);
    this.viewApplication = false;
    this.viewingApplication = null;
    this.contactForm = new FormGroup({
      id: new FormControl(this.commonService.generateUUID()),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email]),
      cell: new FormControl(null)
    });
    this.todoDescription = new FormControl(null, [Validators.required]);
  }

  ngOnInit(): void {
    this.commonService.applicationUpdatedObsrv.subscribe(isUpdated => {
      if (isUpdated) {
        this.applications = this.dataService.get("applications");
        this.dataSource = new MatTableDataSource(this.applications);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1000);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editApplication(application: Application): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = application;

    // re-use new application dialog
    const dialogRef = this.dialog.open(NewApplicationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: Application) => {
      // console.log(`Dialog result: ${result}`);
      let modifiedApplication = this.applications.filter((a: Application) => {
        return a.id === result.id
      })[0];

      let noChanges: boolean = true;

      for (const key in modifiedApplication) {
        if (modifiedApplication[key] !== result[key]) {
          noChanges = false;
          modifiedApplication[key] = result[key];
        }
      }

      // console.log(modifiedApplication);
      if (!noChanges) {
        this.saveApplications();
      }
    });
  }

  archiveApplication(application: Application): void {
    this.applications.filter(a => {
      return a.id === application.id
    })[0].status += ";Archived";

    this.saveApplications();
  }

  openSidenav(application: Application): void {
    if (!application) return;
    this.viewingApplication = application;
    this.viewApplication = !this.viewApplication;
  }

  addContact() {
    this.viewingApplication.contacts.push(this.contactForm.value);
    this.saveApplications();
  }
  deleteContact(contact: Contact) {
    this.viewingApplication.contacts = this.viewingApplication.contacts.filter(c => {
      return c.id !== contact.id
    });
    this.saveApplications();
  }

  addTodo() {
    let newTodoObj: Todo = {
      id: this.commonService.generateUUID(),
      description: this.todoDescription.value,
      isChecked: false
    }

    this.viewingApplication.todo.push(newTodoObj);
    this.saveApplications();
  }
  updateTodo(todo: Todo) {
    let toUpdate = this.viewingApplication.todo.filter(t => {
      return t.id === todo.id
    })[0];
    toUpdate.isChecked = !toUpdate.isChecked;
    this.saveApplications();
  }
  deleteTodo(todo: Todo) {
    this.viewingApplication.todo = this.viewingApplication.todo.filter(t => {
      return t.id !== todo.id
    });
    // this.viewApplication = !this.viewApplication;
    this.saveApplications();
  }

  private saveApplications(): void {
    this.dataService.save("applications", this.applications);
    this.commonService.applicationUpdated.next(true);
  }

  closeSidenav(): void {
    this.viewingApplication = null;
    this.viewApplication = !this.viewApplication;
  }

}