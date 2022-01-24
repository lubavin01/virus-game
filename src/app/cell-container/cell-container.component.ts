import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CellStatus, ICell } from '../app.component';
import { generateCellKey } from '../helpers';
import { ColonyService } from '../services/colony.service';
import { CellContainerService } from './cell-container.service';

@Component({
    selector: 'app-cell-container',
    templateUrl: './cell-container.component.html',
    styleUrls: ['./cell-container.component.less'],
    providers: [CellContainerService, ColonyService]
})
export class CellContainerComponent implements OnInit {
    @Input() fieldSize: number = 0;
    @Input() playerTurn!: 'red' | 'blue';

    private cellsIndex: Record<string, ICell> = {};
    cellsArray: ICell[] = [];

    movesLeft: number = 3;

    @Output() cellClick: EventEmitter<ICell> = new EventEmitter<ICell>();

    constructor(
        private readonly cellContainerService: CellContainerService,
        private readonly colonyService: ColonyService,
    ) { }

    ngOnInit(): void {
        this.cellsIndex = this.cellContainerService.init(this.fieldSize);
        this.cellsArray = Object.values(this.cellsIndex);

        this.markAvailableCells()
    }

    onClick(cellObject: ICell) {
        // this.cellClick.emit(cellObject);
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


        this.colonyService.updateColonyStatuses(this.cellsArray, this.fieldSize);
    }

    private newVirusTurn(cell: ICell): void {
        cell.status = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;
        this.updateCells([cell]);

        const currentColonyStatus = this.playerTurn === 'red' ? CellStatus.RED_COLONY : CellStatus.BLUE_COLONY;
        const nearestCells = this.getNearestCells([cell]);
        nearestCells.forEach(cell => {
            if (cell.status === currentColonyStatus) {
                const colony = this.colonyService.extractWholeColonyFromCell(cell, this.cellsArray);
                if (colony) {
                    this.colonyService.markColonyActiveness(colony, true);
                }
            }

        })
    }

    private newColonyTurn(cell: ICell) {
        const currentActiveColonyStatus = this.playerTurn === 'red' ? CellStatus.RED_COLONY : CellStatus.BLUE_COLONY;
        cell.status = currentActiveColonyStatus;
        // не апдейтим колонию, т.к. заапдейтим позже



        const colony = this.colonyService.extractWholeColonyFromCell(cell, this.cellsArray);
        // if (colony.length) {
        this.colonyService.markColonyActiveness(colony, true);
        this.updateCells(colony);
        // }

    }

    private changeTurn(): void {
        this.playerTurn = this.playerTurn === 'red' ? 'blue' : 'red';
    }

    private markAvailableCells() {
        this.cellsArray.forEach(cell => cell.available = false);

        const currentVirusStatus = this.playerTurn === 'red' ? CellStatus.RED_VIRUS : CellStatus.BLUE_VIRUS;
        const currentColonyStatus = this.playerTurn === 'red' ? CellStatus.RED_COLONY : CellStatus.BLUE_COLONY;

        const currentActiveCells = this.cellsArray.filter(cell => cell.status === currentVirusStatus || (cell.status === currentColonyStatus && cell.colonyActive === true))

        if (currentActiveCells.length) {
            const nearestCells = this.getNearestCells(currentActiveCells);
            nearestCells.forEach(cell => {
                if (cell.status === CellStatus.EMPTY) cell.available = true;

                const enemyVirusStatus = this.playerTurn === 'red' ? CellStatus.BLUE_VIRUS : CellStatus.RED_VIRUS;
                if (cell.status === enemyVirusStatus) cell.available = true;
            })
            console.log({ nearestCells });

        } else {
            const { x, y } = this.playerTurn === 'red' ? { x: 0, y: 0 } : { x: this.fieldSize - 1, y: this.fieldSize - 1 };
            const startingCell = this.getCellByCoords(x, y) as ICell;
            startingCell.available = true;

        }
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

    private getCellByCoords(x: number, y: number): ICell | undefined {
        if (x < 0 || y < 0) return undefined;

        return this.cellsArray.find(item => item.x === x && item.y === y);

        // const key = generateCellKey(x, y);
        // return this.cellsIndex[key];
    }

    private updateCells(cells: ICell[]): void {
        cells.forEach(cell => {
            const index = this.cellsArray.findIndex(item => item === cell);
            if (index < 0) throw new Error(`updateCells ${JSON.stringify(cells)}`)

            const before = this.cellsArray.slice(0, index);
            const after = this.cellsArray.slice(index + 1);

            this.cellsArray = [...before, { ...cell }, ...after];
        })

    }
}
