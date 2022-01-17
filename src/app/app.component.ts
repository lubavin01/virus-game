import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';

export enum CellStatus {
    EMPTY = 0,
    RED_VIRUS = 1,
    BLUE_VIRUS = 2,
    RED_COLONY = 3,
    BLUE_COLONY = 4,
}

export interface ICell {
    x: number,
    y: number,
    status: CellStatus,
    available: boolean,
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    title = 'virus-game';

    cells: ICell[] = [];

    fieldSize = 15;

    playerTurn: 'red' | 'blue' = 'red';
    movesLeft: number = 3;

    constructor() { }

    ngOnInit(): void {
        this.generateCells();

        this.markAvailableCells();
    }

    cellClick(cellObject: ICell) {
        console.log('cellclick in app', cellObject);

        if (cellObject.status === CellStatus.EMPTY) {
            cellObject.status = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;
            this.updateCell(cellObject);
            this.movesLeft--;
        }
    }

    private generateCells(): void {
        for (let x = 0; x < this.fieldSize; x++) {
            for (let y = 0; y < this.fieldSize; y++) {
                this.cells.push({ x, y, available: false, status: CellStatus.EMPTY });
            }
        }
    }

    private markAvailableCells() {
        const virusStatus = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;


        const currentViruses = this.cells.filter(cell => cell.status === virusStatus);

        if (currentViruses.length) {

        } else {
            const startingCellCoords = this.playerTurn === 'red' ? { x: 0, y: 0 } : { x: this.fieldSize - 1, y: this.fieldSize - 1 }
            const startingCell = this.cells.filter(cell => cell.x === startingCellCoords.x && cell.y === startingCellCoords.y);

            startingCell[0].available = true;
        }


    }

    private updateCell(cellObject: ICell) {
        const index = this.cells.findIndex(cell => cell === cellObject);
        console.log({ index });

        const before = index > 0 ? this.cells.slice(0, index) : [];
        const after = this.cells.slice(index + 1);

        this.cells = [...before, { ...cellObject }, ...after];
    }
}
