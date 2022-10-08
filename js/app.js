let playButton = document.getElementById("play-button");    //get play button element to disable when the game is over
let playerSelect = document.getElementById("player-select");
let gameBoard = document.getElementById("game-board");
let messageText = document.getElementById("message");
let svg = document.getElementById("svg");

let game;   //object of the Game class


function startGame(players) {

    game = new Game(players);
    playerSelect.style.display = "none";
    gameBoard.style.display = "block";
    playButton.disabled = false;
    playButton.style.display = "block";
    messageText.innerText = "";

}



class Game {

    gameBoard; // an array of gameBoardSpace objects
    spinner; // object of Spinner class
    players; //an array of player objects
    turn; // int, what players turn 1, 2, 3 or 4
    message;

    constructor(players) {
        this.players = [];
        for (let i = 1; i <= players; i++) {
            this.players[i] = new Player(i);
        }
        this.gameBoard = new GameBoard;
        this.spinner = new Spinner;
        this.turn = 1;

    }

    // this function runs each time the play button is clicked
    play() {

        // turn number shouldn't be greater than the number of players
        if (this.turn > this.players.length - 1) {
            this.turn = 1;
        }

        this.players[this.turn].move(this.spinner.spin());

        console.log("Player " + this.turn + " lands on: " + this.players[this.turn].getPos());

        if (this.players[this.turn].getPos() == 100 | this.players[this.turn].getPos() == 80) {

            this.players[this.turn].setPos(this.gameBoard.checkBoard(this.players[this.turn].getPos()));
            messageText.innerText = "Player " + this.turn + " wins!";
            //this.setMessage("Player " + this.turn + " wins!");
            console.log("ends on: " + this.players[this.turn].getPos());
            console.log("Player " + this.turn + " wins!");
            playerSelect.style.display = "block";
            playButton.disabled = true;
            playButton.style.display = "none";
        }
        else if (this.players[this.turn].getPos() > 100) {
            this.players[this.turn].setPos(this.players[this.turn].getPos() - this.spinner.getLastSpin());
            console.log("ends on: " + this.players[this.turn].getPos());
            this.turn ++;
        }
        else {
            let pos = this.gameBoard.checkBoard(this.players[this.turn].getPos());
            this.players[this.turn].setPos(pos.boardNumber, pos.x, pos.y);
            console.log("ends on: " + this.players[this.turn].getPos());
            console.log("");
            this.turn ++;
        }

    }


    setMessage(message) {
        this.message = message;
    }

}




class Spinner {
    thisSpin;
    spin() {
        //return a random number 1-6
        let min = Math.ceil(1);
        let max = Math.floor(6);
        this.thisSpin = Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
        console.log("spinner lands on: " + this.thisSpin);
        return this.thisSpin;

    }
    getLastSpin() {
        return this.thisSpin;
    }
}



class Player {
    number;
    boardPos;
    playerMarker;

    constructor(number) {
        this.number = number;
        this.boardPos = 1;

        console.log(this.number);

        this.playerMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        //this.playerMarker.setAttribute('id', this.number);
        this.playerMarker.classList.add("player" + this.number);
        this.playerMarker.setAttribute("cx", 50 + (number * 3));
        this.playerMarker.setAttribute("cy", 950 + (number * 3));

        svg.appendChild(this.playerMarker);

    }

    move(spaces) {
        //move the player spaces
        console.log("player " + this.number + " moves " + spaces + " spaces");

        this.boardPos += spaces;

    }

    getPos() {
        return this.boardPos;
    }

    setPos(position, x, y) {
        this.boardPos = position;

        gsap.to(this.playerMarker, {duration: 1, attr: {cx: x, cy: y}, ease: "none"});

    }
}



class GameBoardSpace {
    endPosition;
    x;
    y;

    constructor(endPosition) {
        this.endPosition = endPosition;
    }

    land() {

        let pos = {
            boardNumber : this.endPosition,
            x: this.x,
            y: this.y
        }

        return pos;
    }

    gameLogic(space) {

        // update ending positon for spaces that are chutes or ladders
        switch (space) {
            case 16:
                this.endPosition = 6;
                break;
            case 47:
                this.endPosition = 26;
                break;
            case 49:
                this.endPosition = 11;
                break;
            case 56:
                this.endPosition = 53;
                break;
            case 62:
                this.endPosition = 19;
                break;
            case 64:
                this.endPosition = 60;
                break;
            case 87:
                this.endPosition = 24;
                break;
            case 93:
                this.endPosition = 73;
                break;
            case 95:
                this.endPosition = 75;
                break;
            case 98:
                this.endPosition = 78;
                break;
            case 1:
                this.endPosition = 38;
                break;
            case 4:
                this.endPosition = 14;
                break;
            case 9:
                this.endPosition = 31;
                break;
            case 21:
                this.endPosition = 42;
                break;
            case 28:
                this.endPosition = 84;
                break;
            case 36:
                this.endPosition = 44;
                break;
            case 51:
                this.endPosition = 67;
                break;
            case 71:
                this.endPosition = 91;
                break;
            case 80:
                this.endPosition = 100;
                break;
            default:
                this.endPosition = space;

        }

        //index is the board space - 1
        let index = space - 1;

        // if in the bottom row (1)
        if (index < 10) {

            console.log("index" + index);

            this.y = 950; //y position for entire row
            this.x = index * 100 + 50; //column 1 is at 50px, then 150, 250 and so on

            console.log(index * 100 + 50);
        } //if in row 2
        else if (index >= 10 && index < 20) {
            this.y = 850; //y position for entire row


            let rowIndex = Math.abs((index - 10) - 9); //column 1 is 

            console.log(rowIndex * 100 + 50);

            
            this.x = rowIndex * 100 + 50;
        } //if in row 3
        else if (index >= 20 && index < 30) {
            this.y = 750;
            this.x = index * 100 + 50;
        } //if in row 4
        else if (index >= 30 && index < 40) {
            this.y = 650;
            this.x = index * 100 + 50;
        } //if in row 5
        else if (index >= 40 && index < 50) {
            this.y = 550;
            this.x = index * 100 + 50;
        } //if in row 6
        else if (index >= 50 && index < 60) {
            this.y = 450;
            this.x = index * 100 + 50;
        } //if in row 7
        else if (index >= 60 && index < 70) {
            this.y = 350;
            this.x = index * 100 + 50;
        } //if in row 8
        else if (index >= 70 && index < 80) {
            this.y = 250;
            this.x = index * 100 + 50;
        } //if in row 9
        else if (index >= 80 && index < 90) {
            this.y = 150;
            this.x = index * 100 + 50;
        } //if in row 10 (the top row)
        else {
            this.y = 50;
            this.x = index * 100 + 50;
        }

    }
}


class GameBoard {
    gameboard; // an array of gameBoardSpace objects

    constructor() {

        this.gameboard = []; // an array to be filled with gameBoardSpace objects

        // loop through i = 1 through i = 100
        for (let i = 1; i < 101; i++) {

            this.gameboard[i] = new GameBoardSpace(i);
            this.gameboard[i].gameLogic(i);

        }

    }

    //return an object
    checkBoard(position) {

        return this.gameboard[position].land();
    }
}

