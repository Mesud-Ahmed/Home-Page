import { Gameboard } from "../modules/Gameboard";
import Ship from "../modules/Ship";

test('places a ship on the gameBoard', () => {
    {
        const gameBoard = new Gameboard()
        const myShip = new Ship(3)
        gameBoard.placeShip(myShip, { x: 0, y: 0 }, 'horizontal')

        expect(gameBoard.ships[0]).toEqual(
            {
                ship: myShip,
                coordinates: [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 2, y: 0 }
                ]
            }
        )
    }
})

test('attacks a ship', () => {
    const gameBoard = new Gameboard()
    const myShip = new Ship(3)
    gameBoard.placeShip(myShip, { x: 0, y: 0 }, 'horizontal')
    gameBoard.receiveAttack({x:1,y:0})

    expect(myShip.hits).toBe(1)
})
test('records a missed attack',()=>{
    const gameBoard = new Gameboard()
    gameBoard.receiveAttack({x:5,y:5})

    expect(gameBoard.missedAttacks).toEqual([{x:5,y:5}])
})