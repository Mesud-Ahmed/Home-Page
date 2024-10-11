import { player } from "./player";
import Ship from "./Ship";


export class GameController {
    constructor() {
        this.init()
        
    }
    init(){
        this.player1 = new player('Player')
        this.computer = new player('computer', true)
        this.currentPlayer = this.player1
        this.isGameOver = false
        this.cptrAttackCoords = new Set();
    }

    startGame(cords, length, direction) {
        let player1Ship = new Ship(length);
        let cptrShip = new Ship(length);

        // Place Player 1's ship
        this.player1.gameboard.placeShip(player1Ship, cords, direction);

        // Attempt to place the computer's ship
        let isPlaced = false;
        while (!isPlaced) {
            // Random coordinates for the computer's ship
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            let cptrDirection = Math.random() > 0.5 ? 'horizontal' : 'vertical';

            // Ensure the ship fits within the grid and does not overlap
            if (this.isValidPlacement(this.computer.gameboard, cptrShip, { x, y }, cptrDirection)) {
                this.computer.gameboard.placeShip(cptrShip, { x, y }, cptrDirection);
                isPlaced = true;  // Ship successfully placed
            }
        }
    }

    // Function to check if a ship can be placed at the given coordinates
    isValidPlacement(gameboard, ship, startCoordinates, direction) {
        const { x, y } = startCoordinates;
        const shipLength = ship.length;

        let shipCoordinates = [];

        if (direction === 'horizontal') {
            // Check if the ship exceeds the grid boundary
            if (x + shipLength > 10) return false;

            // Check for overlapping ships
            for (let i = 0; i < shipLength; i++) {
                const newCoord = { x: x + i, y };
                if (this.isOccupied(gameboard, newCoord)) return false;
                shipCoordinates.push(newCoord);
            }
        } else if (direction === 'vertical') {
            // Check if the ship exceeds the grid boundary
            if (y + shipLength > 10) return false;

            // Check for overlapping ships
            for (let i = 0; i < shipLength; i++) {
                const newCoord = { x, y: y + i };
                if (this.isOccupied(gameboard, newCoord)) return false;
                shipCoordinates.push(newCoord);
            }
        }

        // If no issues, return true (valid placement)
        return true;
    }
    validatePlayerShip(cords, length, direction) {

        const x = Number(cords.x);
        const y = Number(cords.y);
        length = Number(length);

        if (direction == 'horizontal' && x + length > 10) {
            
            return false
        }
        if (direction == 'vertical' && y + length > 10) {
            return false
        }

        for (let i = 0; i < length; i++) {
            let currentX = direction == 'horizontal' ? x + i : x
            let currentY = direction == 'horizontal' ? y : y + i
            const newcord = { x: currentX, y: currentY }
            
            if (this.player1.gameboard.isCellOccupied(currentX, currentY)) {
                return false
            }
        }
        return true
    }
    // Check if a specific coordinate is already occupied by a ship
    isOccupied(gameboard, coordinates) {
        return gameboard.ships.some(shipObj =>
            shipObj.coordinates.some(coord => coord.x === coordinates.x && coord.y === coordinates.y)
        );
    }

    playRound(coordinates) {
        if (this.isGameOver) return
        const result = this.currentPlayer.attack(this.computer, coordinates)
        this.attackUI(coordinates, result)

        if (this.computer.gameboard.areAllShipsSunk()) {
            this.isGameOver = true
            alert(`${this.currentPlayer.name} wins!`)
            return;
        }

        this.currentPlayer = this.computer
        setTimeout(() => {
            this.computerAttack()
            if (this.player1.gameboard.areAllShipsSunk()) {
                this.isGameOver = true
                alert('computer wins!')
                return
            }

            this.currentPlayer = this.player1
        }, 1000)


    }

    computerAttack() {
        let x, y
        do {
            x = Math.floor(Math.random() * 10)
            y = Math.floor(Math.random() * 10)
        } while (this.cptrAttackCoords.has(`${x},${y}`))

        this.cptrAttackCoords.add(`${x},${y}`)

        const result = this.computer.attack(this.player1, { x, y })
        this.attackUI({ x, y }, result)
    }
    attackUI(coordinates, result) {
        const { x, y } = coordinates

        const grid = this.currentPlayer === this.player1 ? '#player2-grid' : '#player1-grid'
        const gridCell = document.querySelector(`${grid} .cell[data-x="${x}"][data-y="${y}"]`)

        if (result == 'hit') {
            gridCell.classList.add('hit')

        } else {
            gridCell.classList.add('mis')

        }
    }
    // Inside GameController class
addClassToComputerShips() {
    this.computer.gameboard.ships.forEach(shipObj => {
        const { coordinates } = shipObj; // Get the coordinates of the ship

        // Loop through the coordinates and add the class to the corresponding grid cells
        coordinates.forEach(coord => {
            const gridCell = document.querySelector(`#player2-grid .cell[data-x="${coord.x}"][data-y="${coord.y}"]`);
            gridCell.classList.add('cptr-ship')
        });
    });
}

}