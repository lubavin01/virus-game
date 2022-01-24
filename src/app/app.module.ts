import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellContainerService } from './cell-container/cell-container.service';
import { FieldComponent } from './cell-container/field/field.component';
import { CellContainerComponent } from './cell-container/cell-container.component';
import { ColonyService } from './services/colony.service';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    CellContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ColonyService, CellContainerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
