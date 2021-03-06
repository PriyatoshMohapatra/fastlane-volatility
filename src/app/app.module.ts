import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { SheetJSComponent } from "./sheet.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, SheetJSComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
