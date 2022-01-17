import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CellStatus, ICell } from "src/app/app.component";

@Component({
    selector: 'field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.less'],
})
export class FieldComponent implements OnInit {
    @Input() cell!: ICell
    active!: boolean;
    redVirus: boolean = false;

    @Output() submitClick: EventEmitter<ICell> = new EventEmitter<ICell>();

    ngOnInit(): void {
        this.redVirus = this.cell.status === CellStatus.RED_VIRUS;
    }

    mouseEnterElement() {
        this.active = this.cell.available;
    }

    mouseLeaveElement() {
        this.active = false;
    }

    clickHandler() {
        if (!this.cell.available) return;

        this.submitClick.emit(this.cell);
    }
}