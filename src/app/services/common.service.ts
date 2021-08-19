import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public applicationUpdated: Subject<boolean> = new Subject();
  public applicationUpdatedObsrv: Observable<boolean> = this.applicationUpdated.asObservable();

  public resumeUpdated: Subject<boolean> = new Subject();
  public resumeUpdatedObsrv: Observable<boolean> = this.resumeUpdated.asObservable();

  constructor() { }

  public generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
