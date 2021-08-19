import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    window.addEventListener('beforeunload', () => {
      // console.log("refreshing")
      // this.router.navigate([""]);
      window.location.replace('/');
    });
  }

}
