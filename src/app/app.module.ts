import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FieldComponent } from './grid-container/field/field.component';
import { GridContainerComponent } from './grid-container/grid-container.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    GridContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
