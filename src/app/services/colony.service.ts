import { Injectable } from "@angular/core";
import { CellStatus, ICell } from "../app.component";

@Injectable()
export class ColonyService {

    private redColonies: { key: string, content: ICell[] }[];
    private blueColonies: { key: string, content: ICell[] }[];
    private fieldSize: number;

    constructor() {
        this.redColonies = [];
        this.blueColonies = [];
        this.fieldSize = 0;
    }

    public updateColonyStatuses(cells: ICell[], fieldSize: number) {
        // this.redColonies = [];
        // this.blueColonies = [];
        // this.fieldSize = fieldSize;

        // const checkedCellKeys: string[] = [];

        // for (let cell of cells) {
        //     const key = generateCellKey(cell.x, cell.y);
        //     if (cell.status === CellStatus.BLUE_ACTIVE_COLONY) {
        //         if (!checkedCellKeys.includes(key)) {
        //             this.extractWholeColony(cell, 'blue', cells, checkedCellKeys);
        //         }


        //         this.blueColonies.push({ key: cell.key, content })
        //     }
        // }

    }

    public extractWholeColonyFromCell(startingCell: ICell, cellsArray: ICell[]): ICell[] {
        const wholeColony: ICell[] = [];
        const checkedCells: ICell[] = [];
        if (startingCell.status !== CellStatus.BLUE_COLONY && startingCell.status !== CellStatus.RED_COLONY) throw new Error('Error in extractWholeColony,' + JSON.stringify(startingCell),)

        const color = startingCell.status === CellStatus.BLUE_COLONY ? 'blue' : 'red';

        wholeColony.push(startingCell);
        this.attachNearestColonies(startingCell, color, cellsArray, wholeColony, checkedCells);

        checkedCells.push(startingCell);

        return wholeColony;
    }

    public markColonyActiveness(colony: ICell[], activeness: boolean) {
        colony.forEach(colonyItem => colonyItem.colonyActive = activeness);
    }

    // Текущая клетка - уже колония
    private attachNearestColonies(
        startingCell: ICell,
        color: 'red' | 'blue',
        cellsArray: ICell[],
        wholeColony: ICell[],
        checkedCells: ICell[]
    ) {

        const { x, y } = startingCell;

        this.attachToColony(x - 1, y - 1, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x - 1, y, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x - 1, y + 1, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x, y - 1, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x, y + 1, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x + 1, y - 1, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x + 1, y, wholeColony, cellsArray, color, checkedCells);
        this.attachToColony(x + 1, y + 1, wholeColony, cellsArray, color, checkedCells);
    }

    private attachToColony(x: number, y: number, wholeColony: ICell[], cellsArray: ICell[], color: 'red' | 'blue', checkedCells: ICell[]): void {
        if (x < 0 || x >= this.fieldSize || y < 0 || y > this.fieldSize) {
            // incorrect cell
            return;
        }

        const startingCell = this.getCellByCoords(x, y, cellsArray);
        if (checkedCells.includes(startingCell)) {
            // already checked
            return;
        }

        checkedCells.push(startingCell);
        const colonyStatus = color === 'blue' ? CellStatus.BLUE_COLONY : CellStatus.RED_COLONY;
        if (startingCell.status === colonyStatus) {
            wholeColony.push(startingCell);
            this.attachNearestColonies(startingCell, color, cellsArray, wholeColony, checkedCells)
        }
    }

    private getCellByCoords(x: number, y: number, cellsArray: ICell[]): ICell {
        const search = cellsArray.find(item => item.x === x && item.y === y);
        if (!search) throw new Error(`getCellByCoords error, ${x} ${y}`)
        return search;
    }

}
