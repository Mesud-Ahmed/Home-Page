import Ship from '../modules/Ship'

test("creates a new ship with a given length", () => {
    const ship = new Ship(3)
    expect(ship.length).toBe(3)
})
test('hit() increases the number of hits on the ship', () => {
    const ship = new Ship(3)
    ship.hit()
    expect(ship.hits).toBe(1)
})
test('isSunk() returns true when the ship is sunk', () => {
    const ship = new Ship(3)
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})