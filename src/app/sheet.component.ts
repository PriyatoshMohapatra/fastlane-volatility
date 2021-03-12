import { Component } from "@angular/core";

import * as XLSX from "xlsx";
import { sqrt, std } from "mathjs";

type AOA = any[][];

@Component({
  selector: "app-sheet",
  templateUrl: "./sheet.component.html"
})
export class SheetJSComponent {
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  fileName: string = "SheetJS.xlsx";
  closingPrice = [];
  logValues = [];
  hv: any;
  standardDev: any;
  showCMP = false;
  cmp: any;
  iv: any;
  newHV: any;
  newIV: any;

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      const closeIndex = this.data[0].findIndex(
        (x: string) => x.trim().toLowerCase() == "close"
      );
      if (closeIndex > -1) {
        this.data = this.data.slice(1, this.data.length);
        this.data.forEach((val, index) => {
          this.closingPrice.push(val[closeIndex]);
        });
      } else {
        alert(
          "Something wrong.. please check the column name CLOSE should be there"
        );
      }
      // console.log(this.data);
      // console.log("length", this.data.length);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  calculateLog(): void {
    if (this.closingPrice.length == 0) {
      alert("Please select any file");
      return;
    }
    if (this.closingPrice.length > 0) {
      this.closingPrice.forEach((val, index) => {
        if (index + 1 !== this.closingPrice.length) {
          let ln = Math.log(val / this.closingPrice[index + 1]);
          this.logValues.push(ln);
        }
      });
    }
    //let value = Number(this.logValues.join(","));
    this.standardDev = std(this.logValues);
    let val = this.standardDev * 100 * sqrt(365);
    this.hv = Math.trunc(val * 100) / 100;
    this.showCMP = true;
    // console.log("Log", this.logValues);
    // console.log("standardDev", this.hv);
  }
  calculateMovement(): void {
    let tempHV = this.hv / 100;
    let tempIV = this.iv / 100;
    tempHV = Math.trunc(tempHV * 100) / 100;
    tempIV = Math.trunc(tempIV * 100) / 100;
    // console.log(tempHV);
    // console.log(tempIV);
    this.newHV = ((tempHV * this.cmp) / sqrt(256)).toFixed(2);
    this.newIV = ((tempIV * this.cmp) / sqrt(256)).toFixed(2);
  }
}
