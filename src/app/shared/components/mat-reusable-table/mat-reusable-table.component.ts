import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import * as XLSX from 'xlsx';
import {GetWalletTablesColumnContentsPipe} from '@shared/pipes/get-wallet-tables-column-contents.pipe';
import {CapitalizeAddSpacesPipe} from '@shared/pipes/capitalize-add-spaces.pipe';

@Component({
    selector: 'app-mat-reusable-table',
    templateUrl: './mat-reusable-table.component.html',
    styleUrls: ['./mat-reusable-table.component.scss']
})
export class MatReusableTableComponent implements OnInit, AfterViewInit {
    tableData;
    pageSize = 5;
    pageIndex = 0;

    @Input() data = [];
    @Input() columns = [];
    filteredData = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table', {static: true}) table: ElementRef;

    constructor(
        private getColumnContent: GetWalletTablesColumnContentsPipe,
        private capitalizeAddSpaces: CapitalizeAddSpacesPipe
    ) {
    }

    @Input() changing: Subject<boolean>;

    ngOnInit(): void {
        this.filterPayments();
        this.tableData = new MatTableDataSource(this.filteredData);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;

    }

    handle(e) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterPayments();
        this.tableData = new MatTableDataSource(this.filteredData);
    }

    filterPayments() {
        this.filteredData = this.data.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }

    prepareDataForXls() {
        const contents = [];
        this.data.map((el, r) => {
            this.columns.map((col, index) => {
                if (index === 0) {
                    contents[r] = [];
                }
                const colName = this.capitalizeAddSpaces.transform(col);
                contents[r][colName] = this.getColumnContent.transform(col, el);
            });
        });
        return contents;
    }

    ngAfterViewInit() {

        // Exporting to Excel file from here (it exports all the pages of paginated table!!!)
        this.changing.subscribe(() => {
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.prepareDataForXls());
            const wb: XLSX.WorkBook = {Sheets: {data: ws}, SheetNames: ['data']};
            XLSX.writeFile(wb, 'Exported_File.xlsx');
        });

        this.sort.sortChange.subscribe((sort: Sort) => {
            this.data = sortTableData(this.data, 'created', sort.direction);
            this.paginator.pageIndex = 0;
            this.filterPayments();
            this.tableData = new MatTableDataSource(this.filteredData);
        });

    }

}
