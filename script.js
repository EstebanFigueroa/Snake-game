//DOM

const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreboard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameover");

//Game settings

const boardSize = 10;
const gameSpeed = 100;
const squareTypes = { //tipos de cuadrado
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
}
//Mapeo de direcciones

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
}

//Variables del juego

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;


const drawSnake = () => {
    snake.forEach(square => drawSquare(square, "snakeSquare"));
}
//Vamos a dibujar los cuadrados
//@params
//square: posicion del square
//type: tipo de cuadraro (emptySquare, snakeSquare, foodSquare)

const drawSquare = (square, type) => { /*si es un empty, un snake, etc*/
    const [row, column] = square.split("");
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute("class", `square ${type}`);

    if (type === "emptySquare") {
        emptySquares.push(square)
    } else {
        if (emptySquares.indexOf(square) == ! -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, "0");
    const [row, column] = newSquare.split("");
    if (newSquare < 0 || newSquare > boardSize * boardSize || (direction === "ArrowRight" && column == 0) || (direction === "ArrowLeft" && column == 9) || boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, "emptySquare");
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = "block";
    clearInterval(moveInterval);
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case "ArrowUp":
            direction != "ArrowDown" && setDirection(key.code)
            break;
        case "ArrowDown":
            direction != "ArrowUp" && setDirection(key.code)
            break;
        case "ArrowLeft":
            direction != "ArrowRight" && setDirection(key.code)
            break;
        case "ArrowRight":
            direction != "ArrowLeft" && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, "foodSquare")
}



const updateScore = () => {
    scoreBoard.innerText = score;
}


const createBoard = () => { // Aca comenzamos a iterar por los elementos del array con un forEach para crear los lugares
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`; //aca creamos el valor del array en sus dos posiciones, fila y columna
            const squareElement = document.createElement("div") //con el metodo document.createElement generamos un div que es el que vamos a insertar en nuestro tablero
            squareElement.setAttribute("class", "square emptySquare"); // a ese div que creamos le vamos a incorporar una clase para trabajar con el css
            squareElement.setAttribute("id", squareValue); //por otro lado le pondremos un id con su valor
            board.appendChild(squareElement); //agregamos el elemento al board
            emptySquares.push(squareValue);
        })
    });

}

const setGame = () => {
    snake = ["00", "01", "02", "03"]; // Aca creamos la serpiente
    score = snake.length; // El score crece a medida que la serpiente crece
    direction = "ArrowRight";
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare)); //Aca construimos el tablero
    //Creamos un array con .from y ese array va a tener 10 lugares. boardSize esta declarada mas arriba de esta manera. boardsize = 10
    //Luego a ese array le aplicamos una funcion que creara un nuevo array (new Array) que tambien tendra 10 elementos(boardSize) y con .fill lo rellenamos, de que?
    //Del objeto squareTypes que declaramos arriba le vamos a pasar la propiedad empty square que es igual a 0, 0 equivale a cuadrado vacio.
    console.log(boardSquares);
    board.innerHTML = "" // es un string vacio porque cuando el jugador resetee de esta manera vamos a borrar la info del tablero
    emptySquares = [] // esto tambien es para resetear los cuadros del tablero
    createBoard();
}
const startGame = () => {
    setGame()
    gameOverSign.style.display = "none";
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener("keydown", directionEvent)
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}
startButton.addEventListener("click", startGame);