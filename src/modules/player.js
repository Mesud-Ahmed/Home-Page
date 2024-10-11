import { Gameboard } from "./Gameboard"
export class player{
    constructor(name,isComputer = false){
        this.name = name
        this.gameboard = new Gameboard()
        this.isComputer = isComputer
    }
    attack(targetPlayer,coordinates){
        return targetPlayer.gameboard.receiveAttack(coordinates)
    }
}