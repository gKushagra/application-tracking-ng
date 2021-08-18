import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewApplicationComponent } from './new-application/new-application.component';
import { DataService } from '../../../services/data.service'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Application, Resume } from 'src/app/interfaces/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit, AfterContentInit {

  public isOptionsOpen: boolean;
  public isNavOpen: boolean;
  public currentPage: string;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private commonService: CommonService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.isOptionsOpen = false;
    this.isNavOpen = false;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngAfterContentInit(): void {
    this.activeRoute.url.subscribe(url => {
      let path = url.map(u => u.path)[0];
      if (path && path === "resumes") { this.currentPage = "Resume" }
      if (path && path === "applications") { this.currentPage = "Applications" }
      if (path && path === "dashboard") { this.currentPage = "Dashboard" }
    });
  }

  createNewApplication() {
    this.isOptionsOpen = !this.isOptionsOpen;

    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(NewApplicationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: Application) => {
      // console.log(`Dialog result: ${result}`);
      if (!result.company || !result.status) return;
      let applications = this.dataService.get("applications") || [];
      applications.push(result);
      this.dataService.save("applications", applications);
      location.reload();
    });
  }

  navigateToHome() {
    this.isNavOpen = !this.isNavOpen;
    this.router.navigate(["applications"]);
  }

  manageResumes() {
    this.isNavOpen = !this.isNavOpen;
    this.router.navigate(["resumes"]);
  }

  exportData() {
    this.isOptionsOpen = !this.isOptionsOpen;
    let applications = this.dataService.get("applications") || [];
    if (applications.length === 0) return;
    let blob = new Blob(
      [JSON.stringify(applications)],
      { type: 'application/json' }
    );
    let fileUrl = URL.createObjectURL(blob);
    let tempLink = document.createElement('a');
    tempLink.href = fileUrl;
    tempLink.download = `applications-${new Date().toLocaleDateString()}`;
    tempLink.target = '_blank';
    tempLink.click();
    setTimeout(() => {
      tempLink = null;
      fileUrl = null;
      blob = null;
    }, 2000);
  }

  uploadFile(): void {
    this.isOptionsOpen = !this.isOptionsOpen;

    let fileInput = document.createElement('input');
    fileInput.type = "file";

    fileInput.addEventListener('change', (e: any) => {
      let file: File = e.target.files[0];

      let fr = new FileReader();

      let resumes = this.dataService.get("resumes") || [];

      fr.onload = (ev: any) => {
        let resumeObj: Resume = { id: null, filename: null, dataUrl: null, uploadDate: null };
        resumeObj.id = this.commonService.generateUUID();
        resumeObj.filename = file.name;
        resumeObj.dataUrl = ev.target.result;
        resumeObj.uploadDate = new Date();

        resumes.push(resumeObj);

        this.dataService.save('resumes', resumes);

        fileInput = null;
        location.reload();
      }

      fr.readAsDataURL(file);
    });

    fileInput.click();
  }

  importData() {
    this.isOptionsOpen = !this.isOptionsOpen;

    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.multiple = false;

    fileInput.click();

    fileInput.addEventListener('change', (e: any) => {
      var files = e.target.files;
      var file = files[0];
      var reader = new FileReader();

      let dataService = this.dataService;

      reader.onload = function (event) {
        dataService.save('applications', event.target.result);
        location.reload();
      }

      reader.readAsText(file);
    });
  }

}
