import { Injectable } from "@angular/core";
import { flatMap } from "rxjs";
import { CellStatus, ICell } from "../app.component";
import { generateCellKey } from "../helpers";

@Injectable()
export class CellContainerService {

    public init(fieldSize: number): Record<string, ICell> {
        const cellContainer: Record<string, ICell> = {};
        for (let x = 0; x < fieldSize; x++) {
            for (let y = 0; y < fieldSize; y++) {
                const key = generateCellKey(x, y)
                const cell: ICell = {
                    x, y, key, available: false, status: CellStatus.EMPTY, colonyActive: false,
                }
                cellContainer[key] = cell;
            }
        }

        return cellContainer;
    }

    public getCurrentVirusCells(cellsArray: ICell[], playerTurn: 'red' | 'blue') {


    }
}
