import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Resume } from 'src/app/interfaces/common';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-resumes',
  templateUrl: './resumes.component.html',
  styleUrls: ['./resumes.component.scss']
})
export class ResumesComponent implements OnInit, AfterViewInit, AfterContentInit {

  resumes: Resume[];
  active: Resume;
  pdfDisplay: HTMLElement;

  constructor(
    private dataService: DataService,
  ) {
    this.resumes = this.dataService.get("resumes") || [];
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }

  ngAfterContentInit() {
    this.pdfDisplay = document.querySelector('#pdfdisplay');

    if (this.resumes.length > 0) {
      this.active = this.resumes[0];
      this.loadResume(this.active);
    }
  }

  loadResume(resume: Resume): void {
    if (!this.pdfDisplay) return;

    this.active = resume;

    for (let i = 0; i < this.pdfDisplay.childNodes.length; i++) {
      this.pdfDisplay.removeChild(this.pdfDisplay.childNodes[i]);
    }

    let pdfObject = document.createElement('object');
    pdfObject.id = resume.id;
    pdfObject.data = resume.dataUrl;
    pdfObject.type = "application/pdf";
    pdfObject.width = "100%";
    pdfObject.height = (window.innerHeight - 40).toString() + 'px';

    this.pdfDisplay.appendChild(pdfObject);
  }

  deleteResume(resume: Resume): void {
    if (this.active.id === resume.id) {
      this.active = this.resumes.length > 0 ? this.resumes[0] : null;
      this.loadResume(this.active);
    }

    this.resumes = this.resumes.filter(r => {
      return r.id !== resume.id
    });

    this.dataService.save("resumes", this.resumes);

    location.reload();
  }

  checkActive(resume: Resume): boolean {
    return this.active ? this.active.id === resume.id : false;
  }
}
