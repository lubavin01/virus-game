import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ColonyService } from './services/colony.service';

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
    key: string,
    status: CellStatus,
    colonyActive: boolean,
    available: boolean,
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    providers: [ColonyService],
})
export class AppComponent implements OnInit {
    title = 'virus-game';

    cells: ICell[] = [];

    fieldSize = 15;

    playerTurn: 'red' | 'blue' = 'red';
    movesLeft: number = 3;

    constructor(
        private readonly colonyService: ColonyService,
    ) { }

    ngOnInit(): void {
        this.generateCells();

        this.markAvailableCells();
    }

    cellClick(cellObject: ICell) {
        const enemyVirusStatus = this.playerTurn === 'red' ? CellStatus.BLUE_VIRUS : CellStatus.RED_VIRUS;

        if (cellObject.status === CellStatus.EMPTY) {
            this.newVirusTurn(cellObject);



        } else if (cellObject.status === enemyVirusStatus) {
            this.newColonyTurn(cellObject);


        } else return

        this.movesLeft--;
        if (this.movesLeft === 0) {
            this.movesLeft = 3;
            this.changeTurn();
        }
        this.markAvailableCells();

        this.colonyService.updateColonyStatuses(this.cells, this.fieldSize);
    }

    private newVirusTurn(cell: ICell): void {
        cell.status = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;
        this.updateCells([cell]);

        const nearestCells = this.getNearestFields(cell);
        nearestCells.forEach(cell => {
            const colony = this.colonyService.extractWholeColonyFromCell(cell, this.cells);
            if (colony) {
                this.colonyService.markColonyActiveness(colony, true);
            }
        })
    }

    private newColonyTurn(cell: ICell) {
        const currentActiveColonyStatus = this.playerTurn === 'red' ? CellStatus.RED_COLONY : CellStatus.BLUE_COLONY;
        cell.status = currentActiveColonyStatus;
        // this.updateCells([cell]);

        // console.log('newColonyTurn', { cell });


        const colony = this.colonyService.extractWholeColonyFromCell(cell, this.cells);
        console.log('newColonyTurn', { colony });
        // if (colony.length) {
            this.colonyService.markColonyActiveness(colony, true);
            this.updateCells(colony);
        // }

    }

    private getNearestFields(cell: ICell): ICell[] {
        // TODO
        return [];
    }

    private generateCells(): void {
        for (let x = 0; x < this.fieldSize; x++) {
            for (let y = 0; y < this.fieldSize; y++) {
                this.cells.push({ x, y, key: this.generateCellKey(x, y), available: false, status: CellStatus.EMPTY, colonyActive: false });
            }
        }
    }

    private generateCellKey(x: number, y: number) {
        return `x_${x}_y_${y}`;
    }

    private markAvailableCells() {
        // Clearing current available status
        this.cells.forEach(cell => cell.available = false);

        // Marking new available cells
        const currentVirusStatus = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;
        const currentColonyStatus = this.playerTurn === 'red' ? CellStatus.RED_COLONY : CellStatus.BLUE_COLONY;
        const currentVirusCells = this.cells.filter(cell => cell.status === currentVirusStatus || (cell.status === currentColonyStatus && cell.colonyActive === true));

        if (currentVirusCells.length) {

            const nearestCells = this.getNearestCells(currentVirusCells);
            nearestCells.forEach(cell => {
                if (cell.status === CellStatus.EMPTY) cell.available = true;

                const enemyVirusStatus = this.playerTurn === 'red' ? CellStatus.BLUE_VIRUS : CellStatus.RED_VIRUS;
                if (cell.status === enemyVirusStatus) cell.available = true;
            })

        } else {
            const startingCellCoords = this.playerTurn === 'red' ? { x: 0, y: 0 } : { x: this.fieldSize - 1, y: this.fieldSize - 1 }
            const startingCell = this.cells.filter(cell => cell.x === startingCellCoords.x && cell.y === startingCellCoords.y);

            startingCell[0].available = true;
        }


    }

    private updateCells(cells: ICell[]): void {
        cells.forEach(cell => {
            const index = this.cells.findIndex(item => item === cell);
            if (index < 0) throw new Error(`updateCells ${JSON.stringify(cells)}`)

            const before = this.cells.slice(0, index);
            const after = this.cells.slice(index + 1);

            this.cells = [...before, { ...cell }, ...after];
        })

    }

    private getCellByCoords(x: number, y: number): ICell | null {
        if (x < 0 || x > this.fieldSize - 1) return null;
        if (y < 0 || y > this.fieldSize - 1) return null;

        const result = this.cells.find(cell => cell.x === x && cell.y === y);
        if (!result) return null;

        return result;
    }

    private changeTurn(): void {
        this.playerTurn = this.playerTurn === 'red' ? 'blue' : 'red';
    }

    private getNearestCells(currentVirusCells: ICell[]): ICell[] {
        const cells = currentVirusCells.map(({ x, y }) => {
            const nearestCells = [
                this.getCellByCoords(x - 1, y - 1),
                this.getCellByCoords(x - 1, y),
                this.getCellByCoords(x - 1, y + 1),
                this.getCellByCoords(x, y + 1),
                this.getCellByCoords(x + 1, y + 1),
                this.getCellByCoords(x + 1, y),
                this.getCellByCoords(x + 1, y - 1),
                this.getCellByCoords(x, y - 1),
            ]
                .filter(cell => Boolean(cell));

            return nearestCells as ICell[]
        })

        return cells.flat();
    }
}
