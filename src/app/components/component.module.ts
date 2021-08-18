import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "../material.module";
import { ApplicationsComponent } from './applications/applications.component';
import { ActiveComponent } from './applications/active/active.component';
import { ToolbarComponent } from './applications/toolbar/toolbar.component';
import { NewApplicationComponent } from './applications/toolbar/new-application/new-application.component';
import { ResumesComponent } from './applications/toolbar/resumes/resumes.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { StopPropogationDirective } from '../directives/stop-propogation.directive';

@NgModule({
    declarations: [
        ApplicationsComponent,
        ActiveComponent,
        ToolbarComponent,
        NewApplicationComponent,
        ResumesComponent,
        StopPropogationDirective
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: []
})
export class ComponentsModule { }