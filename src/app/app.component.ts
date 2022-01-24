import { Component, OnInit } from '@angular/core';
import { CellContainerService } from './cell-container/cell-container.service';
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
export class AppComponent {
    title = 'virus-game';

    cells: ICell[] = [];

    fieldSize = 15;

    playerTurn: 'red' | 'blue' = 'red';
    movesLeft: number = 3;
}
