

export class Gameboard {
    constructor() {
        
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(ship, startCoordinates, direction) {
        const { x, y } = startCoordinates;
        let shipCoordinates = [];

        if (direction === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                const newCoord = { x: x + i, y }
                shipCoordinates.push(newCoord);

            }
        } else if (direction === 'vertical') {
            for (let i = 0; i < ship.length; i++) {
                const newCoord = { x, y: y + i }
                shipCoordinates.push(newCoord);

            }
        }

        this.ships.push({ ship, coordinates: shipCoordinates });
    }

isCellOccupied(x, y) {
        return this.ships.some(shipObj =>
            shipObj.coordinates.some(coord => coord.x === x && coord.y === y)
        );
    }
    receiveAttack(coordinates) {
        const { x, y } = coordinates;


        let hitShip = this.ships.find(shipObj =>
            shipObj.coordinates.some(coord => coord.x === x && coord.y === y)
        );

        if (hitShip) {
            hitShip.ship.hit();
            return "hit";
        } else {
            this.missedAttacks.push({ x, y });
            return "miss";
        }
    }


    areAllShipsSunk() {
        return this.ships.every(shipObj => shipObj.ship.isSunk());
    }
}

