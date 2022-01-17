import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ICell } from '../app.component';

@Component({
    selector: 'app-grid-container',
    templateUrl: './grid-container.component.html',
    styleUrls: ['./grid-container.component.less']
})
export class GridContainerComponent implements OnInit, OnChanges {
    @Input() cells: ICell[] = [];
    @Output() cellClick: EventEmitter<ICell> = new EventEmitter<ICell>();

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('GridContainerComponent ngOnChanges', {changes} );
        
    }

    onClick(cellObject: ICell) {
        this.cellClick.emit(cellObject);
    }
}
