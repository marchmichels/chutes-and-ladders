let playButton = document.getElementById("play-button");    //get play button element to disable when the game is over
let resetButton = document.getElementById("reset-button");  //get reset button element to enable when the game is over
let playerSelect = document.getElementById("player-select");    //get player-select screen div to hide after player selection
let gameBoard = document.getElementById("game-board");      //get game-goard div to display when the game starts
let messageText = document.getElementById("message");   //get message div to display game info
let svg = document.getElementById("svg");               //get gameboard svg to animate player movement
let arrow = document.getElementById("Arrow");           //get arrow from spinner SVG to animate

let game;   //object of the Game class

//the game starts when the number of players is selected
function startGame(players) {

    game = new Game(players);
    playerSelect.classList.add("d-none");   //hide player select div
    gameBoard.classList.remove("d-none");   //show gameboard div
    playButton.classList.remove("d-none");  //show play button
    playButton.disabled = false;            //enable play button

}

//reset the game after player confirms
function resetGame() {

    if (confirm("Play Again?")) {

        game.reset();
        gameBoard.classList.add("d-none");          //hide gameboard
        playerSelect.classList.remove("d-none");    //show player-select screen
        resetButton.classList.add("d-none");        //hide reset button

    }

}

//The Game Class
class Game {

    gameBoard; // an array of gameBoardSpace objects
    spinner; // object of Spinner class
    players; //an array of player objects
    turn; // int, what players turn 1, 2, 3 or 4
    message;

    constructor(players) {
        this.gameBoard = new GameBoard;
        this.players = [];
        for (let i = 1; i <= players; i++) {
            this.players[i] = new Player(i);
        }
        this.spinner = new Spinner;
        this.turn = 1;
        this.message = Array;
        this.message[0] = "Player " + this.turn;        //set message to display what the current player's turn is
        this.message[1] = this.message[2] = this.message[3] = this.message[4] = "";       //no message exists 1st turn
        this.setMessage();

    }

    // this function runs each time the play button is clicked
    play() {

        // turn number shouldn't be greater than the number of players
        if (this.turn > this.players.length - 1) {
            this.turn = 1;
        }
        this.message[0] = "Player " + this.turn;


        this.players[this.turn].move(this.spinner.spin());

        this.message[1] = "Spins: " + this.spinner.getLastSpin();

        this.message[2] = "Lands on space: " + this.players[this.turn].getPos();

        if (this.players[this.turn].getPos() == 100 | this.players[this.turn].getPos() == 80) {

            //player lands on 80 or 100, they win the game

            let pos = this.gameBoard.checkBoard(this.players[this.turn].getPos());

            this.players[this.turn].setPos(pos);
            //messageText.innerText = "Player " + this.turn + " wins!";
            this.message[4] = "Player " + this.turn + " wins!";
            this.message[3] = "Ends turn on space: " + this.players[this.turn].getPos();
            //this.setMessage("Player " + this.turn + " wins!");
            //console.log("ends on: " + this.players[this.turn].getPos());
            //console.log("Player " + this.turn + " wins!");
            //playerSelect.style.display = "block";
            playButton.disabled = true;
            //playButton.style.display = "none";
            playButton.classList.add("d-none");
            resetButton.classList.remove("d-none");

            this.setMessage();

        }
        else if (this.players[this.turn].getPos() > 100) {

            //if the player position passes the end of the gameboard, subtract the last spin from thier position

            let pos = this.gameBoard.checkBoard(this.players[this.turn].getPos() - this.spinner.getLastSpin())
            this.players[this.turn].setPos(pos);



            this.message[3] = "Ends turn on space: " + this.players[this.turn].getPos();

            this.message[4] = "";

            this.setMessage();

            this.turn++;
        }
        else {

            //normal turn

            let pos = this.gameBoard.checkBoard(this.players[this.turn].getPos());
            this.players[this.turn].setPos(pos);

            this.message[3] = "Ends turn on space: " + this.players[this.turn].getPos();

            this.message[4] = "";

            this.setMessage();

            this.turn++;
        }

    }


    setMessage() {
        messageText.innerHTML = `
        <ul>
            <li>${this.message[0]}</li>
            <li>${this.message[1]}</li>
            <li>${this.message[2]}</li>
            <li>${this.message[3]}</li>
            <li>${this.message[4]}</li>
        </ul>
        `
    }

    reset() {
        for (let i = 1; i < this.players.length; i++) {
            this.players[i].removePlayer();
        }
    }

}


class Spinner {
    thisSpin;
    rotation;

    constructor() {
        this.rotation = 0;
    }

    spin() {
        //return a random number 1-6
        let min = Math.ceil(1);
        let max = Math.floor(6);
        this.thisSpin = Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
        this.spinSpinner();

        switch (this.thisSpin) {
            case 1:
                this.rotation = 233;
                break;
            case 2:
                this.rotation = 0;
                break;
            case 3:
                this.rotation = 293;
                break;
            case 4:
                this.rotation = 122;
                break;
            case 5:
                this.rotation = 67;
                break;
            case 6:
                this.rotation = 180;
        }

        //console.log(this.rotation);


        //animate spinner
        this.spinSpinner();

        return this.thisSpin;

    }
    spinSpinner() {


        gsap.to(arrow, { transformOrigin: "50% 50%" });
        gsap.to(arrow, { rotation: 0, duration: .1, ease: "none" });
        gsap.to(arrow, { rotation: 180, duration: .1, delay: .1 });
        gsap.to(arrow, { rotation: 300, duration: .1, delay: .1 });
        gsap.to(arrow, { rotation: 40, duration: .1, delay: .1 });
        gsap.to(arrow, { rotation: 0, duration: .1, delay: .1 });
        gsap.to(arrow, { rotation: this.rotation, duration: 1, delay: .5, ease: "none" });

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

        this.playerMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.playerMarker.classList.add("player" + this.number);
        this.playerMarker.setAttribute("cx", 50 + (number * 3));
        this.playerMarker.setAttribute("cy", 950 + (number * 3));
        svg.appendChild(this.playerMarker);

    }

    move(spaces) {
        //move the player spaces
        this.boardPos += spaces;

    }

    getPos() {
        return this.boardPos;
    }

    setPos(pos) {
        //update the player object position
        this.boardPos = pos.boardNumber;

        //animate player marker movement
        gsap.to(this.playerMarker, { duration: 1, attr: { cx: pos.element.x, cy: pos.element.y }, ease: "none" });


        //if land on chute or ladder, animate movement up the ladder or down the chute
        if (pos.element.endX) {
            if (pos.element.chute === true) {
                //console.log("chute");
                gsap.to(this.playerMarker, { duration: 1, delay: 1, attr: { cx: pos.element.endX, cy: pos.element.endY }, ease: "none" });
            } else {
                //console.log("ladder");
                gsap.to(this.playerMarker, { duration: 1, delay: 1, attr: { cx: pos.element.endX, cy: pos.element.endY }, ease: "none" });
            }

        }

    }
    removePlayer() {
        svg.removeChild(this.playerMarker);
    }
}



class GameBoardSpace {
    endPosition;
    element;

    constructor(endPosition) {
        this.endPosition = endPosition;
    }

    land() {

        let pos = {
            boardNumber: this.endPosition,
            element: this.element
        }

        return pos;
    }

    gameLogic(space) {

        // update ending positon for spaces that are chutes or ladders
        switch (space) {
            case 16:                            // board space 16 is the top of a "chute" on the gameboard
                this.defaultPos(space);
                this.endPosition = 6;           // is a player lands on space 16 they slide down the chute to space 6
                this.element.endX = 550;
                this.element.endY = 950;
                this.element.chute = true;
                break;
            case 47:
                this.defaultPos(space);
                this.endPosition = 26;
                this.element.endX = 550;
                this.element.endY = 750;
                this.element.chute = true;
                break;
            case 49:
                this.defaultPos(space);
                this.endPosition = 11;
                this.element.endX = 950;
                this.element.endY = 850;
                this.element.chute = true;
                break;
            case 56:
                this.defaultPos(space);
                this.endPosition = 53;
                this.element.endX = 750;
                this.element.endY = 450;
                this.element.chute = true;
                break;
            case 62:
                this.defaultPos(space);
                this.endPosition = 19;
                this.element.endX = 150;
                this.element.endY = 850;
                this.element.chute = true;
                break;
            case 64:
                this.defaultPos(space);
                this.endPosition = 60;
                this.element.endX = 50;
                this.element.endY = 450;
                this.element.chute = true;
                break;
            case 87:
                this.defaultPos(space);
                this.endPosition = 24;
                this.element.endX = 350;
                this.element.endY = 750;
                this.element.chute = true;
                break;
            case 93:
                this.defaultPos(space);
                this.endPosition = 73;
                this.element.endX = 750;
                this.element.endY = 250;
                this.element.chute = true;
                break;
            case 95:
                this.defaultPos(space);
                this.endPosition = 75;
                this.element.endX = 550;
                this.element.endY = 250;
                this.element.chute = true;
                break;
            case 98:
                this.defaultPos(space);
                this.endPosition = 78;
                this.element.endX = 250;
                this.element.endY = 250;
                this.element.chute = true;
                break;
            case 1:
                this.defaultPos(space);
                this.endPosition = 38;
                this.element.endX = 250;
                this.element.endY = 650;
                break;
            case 4:
                this.defaultPos(space);
                this.endPosition = 14;
                this.element.endX = 650;
                this.element.endY = 850;
                break;
            case 9:
                this.defaultPos(space);
                this.endPosition = 31;
                this.element.endX = 950;
                this.element.endY = 650;
                break;
            case 21:
                this.defaultPos(space);
                this.endPosition = 42;
                this.element.endX = 150;
                this.element.endY = 550;
                break;
            case 28:
                this.defaultPos(space);
                this.endPosition = 84;
                this.element.endX = 350;
                this.element.endY = 150;
                break;
            case 36:
                this.defaultPos(space);
                this.endPosition = 44;
                this.element.endX = 350;
                this.element.endY = 550;
                break;
            case 51:
                this.defaultPos(space);
                this.endPosition = 67;
                this.element.endX = 650;
                this.element.endY = 350;
                break;
            case 71:
                this.defaultPos(space);
                this.endPosition = 91;
                this.element.endX = 950;
                this.element.endY = 50;
                break;
            case 80:
                this.defaultPos(space);
                this.endPosition = 100;
                this.element.endX = 50;
                this.element.endY = 50;
                break;
            default:
                this.defaultPos(space);
                this.endPosition = space;

        }


    }

    //set svg position for spaces that arent chutes or ladders
    defaultPos(space) {

        //index is the board space - 1
        let index = space - 1;

        // if board space is 1-10 then set position at bottom of SVG
        if (index < 10) {

            let y = 950; //y position for entire row
            let x = index * 100 + 50; //column 1 is at 50px, then 150, 250 and so on
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 11-20 then set positon near the bottom of the SVG
        else if (index >= 10 && index < 20) {

            let y = 850; //y position for entire row
            let rowIndex = Math.abs((index - 10) - 9); //subtract lowest number space in this row to reset index for this row, reverse order for alternating rows
            let x = rowIndex * 100 + 50;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 21-30 then set positon near the bottom of the SVG
        else if (index >= 20 && index < 30) {

            let y = 750;
            let x = (index * 100 + 50) - 2000;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 31-40 then set positon near the middle of the SVG
        else if (index >= 30 && index < 40) {

            let y = 650;
            let rowIndex = Math.abs((index - 30) - 9); //subtract lowest number space in this row to reset index for this row, reverse order for alternating rows
            let x = rowIndex * 100 + 50;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 41-50 then set positon in the middle of the SVG
        else if (index >= 40 && index < 50) {

            let y = 550;
            let x = (index * 100 + 50) - 4000;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 51-60 then set positon near the middle of the SVG
        else if (index >= 50 && index < 60) {

            let y = 450;
            let rowIndex = Math.abs((index - 50) - 9); //subtract lowest number space in this row to reset index for this row, reverse order for alternating rows
            let x = rowIndex * 100 + 50;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 61-70 then set positon near the middle of the SVG
        else if (index >= 60 && index < 70) {

            let y = 350;
            let x = (index * 100 + 50) - 6000;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 71-80 then set positon near the top of the SVG
        else if (index >= 70 && index < 80) {

            let y = 250;
            let rowIndex = Math.abs((index - 70) - 9); //subtract lowest number space in this row to reset index for this row, reverse order for alternating rows 
            let x = rowIndex * 100 + 50;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 81-90 then set positon near the top of the SVG
        else if (index >= 80 && index < 90) {

            let y = 150;
            let x = (index * 100 + 50) - 8000;
            this.element = {
                x: x,
                y: y
            }

        } //if board space is 91-100 then set positon at the top of the SVG
        else {

            let y = 50;
            let rowIndex = Math.abs((index - 90) - 9); //subtract lowest number space in this row to reset index for this row, reverse order for alternating rows 
            let x = rowIndex * 100 + 50;
            this.element = {
                x: x,
                y: y
            }

        }

    }



    getPos() {
        return this.element
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
