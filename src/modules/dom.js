import { GameController } from "./GameController";

const player1Grid = document.getElementById('player1-grid');
const player2Grid = document.getElementById('player2-grid');
const ships = document.querySelectorAll('.ship')
const resetButton = document.getElementById('reset-button');
const playerShipContainer = document.querySelector("#ships")
const intro = document.querySelector("#intro")
const message = document.querySelector("#message")
const intrude = document.querySelector("#intrude")
let oneShipPlaced = false

createGrid();
const gamecontroller = new GameController()

resetButton.addEventListener('click', resetGame);


ships.forEach(ship => {
    ship.setAttribute('draggable', true);
    ship.addEventListener('dragstart', (e) => {

        e.dataTransfer.setData('length', ship.dataset.length)
        e.dataTransfer.setData('direction', ship.dataset.direction)
        ship.classList.add('ship-being-dragged');
    })
    ship.addEventListener('click', () => {
        toggleDirection(ship)
    })
    ship.addEventListener('dragend', () => {
        ship.classList.remove('ship-being-dragged');
    });
})

player1Grid.addEventListener('dragover', (e) => {
    e.preventDefault()
})


player1Grid.addEventListener('drop', (e) => {
    e.preventDefault()
    const x = parseInt(e.target.getAttribute('data-x'))
    const y = parseInt(e.target.getAttribute('data-y'))

    const length = e.dataTransfer.getData('length')

    const direction = e.dataTransfer.getData('direction')

    const validPlacemnet = gamecontroller.validatePlayerShip({ x, y }, length, direction)

    if (validPlacemnet) {
        const draggedShip = document.querySelector('.ship-being-dragged');

        gamecontroller.startGame({ x, y }, length, direction)
        playerShipUi({ x, y }, length, direction)
        draggedShip.classList.remove('ship-being-dragged');
        oneShipPlaced = true

        if (draggedShip) {
            draggedShip.remove();
        }

        if (playerShipContainer.childElementCount === 2) {
            intro.style.display = 'none'
            setTimeout(() => {
                message.style.display = 'block'

            }, 1000)
        }
    }

})



player2Grid.addEventListener('click', (e) => {
    if (oneShipPlaced) {
        const x = parseInt(e.target.getAttribute('data-x'))
        const y = parseInt(e.target.getAttribute('data-y'))

        gamecontroller.playRound({ x, y })
    }else{
        alert('Error: Place at least one of your ship!')
    }

})
intrude.addEventListener("click", () => {
    gamecontroller.addClassToComputerShips();
})

function resetGame() {
    clearGrid(player1Grid);
    clearGrid(player2Grid);
    
    oneShipPlaced = false
    intro.style.display = 'block'
    message.style.display = 'none'

    const computerShips = document.querySelectorAll('#player2-grid .cell.cptr-ship');


    computerShips.forEach(cell => {
        cell.classList.remove('cptr-ship');
    });

    ships.forEach(ship => {
        ship.classList.remove('ship-being-dragged');
        playerShipContainer.appendChild(ship);
        ship.setAttribute('draggable', true);

    });
    gamecontroller.init();
}

function clearGrid(grid) {
    const cells = grid.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('ship', 'hit', 'mis');
    });
}
function toggleDirection(ship) {
    if (ship.dataset.direction == 'horizontal') {
        ship.dataset.direction = 'vertical'
    } else {
        ship.dataset.direction = 'horizontal'
    }

}
function createGrid() {
    for (let i = 0; i < 100; i++) {
        const x = i % 10
        const y = Math.floor(i / 10)

        const gridCell1 = document.createElement('div')
        gridCell1.classList.add('cell')
        gridCell1.setAttribute('data-x', x)
        gridCell1.setAttribute('data-y', y)

        const gridCell2 = document.createElement('div')
        gridCell2.classList.add('cell')
        gridCell2.setAttribute('data-x', x)
        gridCell2.setAttribute('data-y', y)

        player1Grid.appendChild(gridCell1);
        player2Grid.appendChild(gridCell2);
    }
}

function playerShipUi(cords, length, direction) {
    let { x, y } = cords
    for (let i = 0; i < length; i++) {
        let gridCell
        if (direction === 'horizontal') {
            gridCell = document.querySelector(`.cell[data-x="${x + i}"][data-y="${y}"]`)

        } else {
            gridCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y + i}"]`)

        }

        if (gridCell) {

            gridCell.classList.add('ship');
        }
    }
}


export { createGrid, playerShipUi };
