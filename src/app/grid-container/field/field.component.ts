import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CellStatus, ICell } from "src/app/app.component";

@Component({
    selector: 'field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.less'],
})
export class FieldComponent implements OnInit {
    @Input() cell!: ICell;
    active!: boolean;

    redVirus: boolean = false;
    blueVirus: boolean = false;

    redColony: boolean = false;
    blueColony: boolean = false;
    colonyActive: boolean = false;

    @Output() submitClick: EventEmitter<ICell> = new EventEmitter<ICell>();

    ngOnInit(): void {
        this.redVirus = this.cell.status === CellStatus.RED_VIRUS;
        this.blueVirus = this.cell.status === CellStatus.BLUE_VIRUS;
        this.redColony = this.cell.status === CellStatus.RED_COLONY;
        this.blueColony = this.cell.status === CellStatus.BLUE_COLONY;
        this.colonyActive = this.cell.colonyActive;
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
