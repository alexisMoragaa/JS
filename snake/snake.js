//Canvas
const canvas = document.getElementById('snakeCanvas')
const ctx = canvas.getContext('2d')
// ctx.canvas.width = window.innerWidth - 25
// ctx.canvas.height = window.innerHeight - 25

ctx.canvas.width = 300
ctx.canvas.height = 300
ctx.strokeStyle = 'black'
ctx.lineWidth = 1



const cellSize = 20
const cellColor = 'black'
const lengthY = Math.round(canvas.height / cellSize)
const lengthX = Math.round(canvas.width / cellSize)
const GameOver = false

//creamos un arreglo en donde mostraremos el tablero de juego
let board = Array.from({length: canvas.height / cellSize}, () => Array.from({length: canvas.width / cellSize}, () => 0))
console.log(board)

const drawCellsBoard = () => {
    for (let y = 0; y <= board.length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvas.width, y * cellSize);
        ctx.stroke();
    }

    // // Dibujar las líneas verticales
    for (let x = 0; x <= board[0].length; x++) {
        ctx.beginPath()
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvas.height)
        ctx.stroke()
    }
    ctx.stroke()

}



//controls
var direction = ''

var snake = ({x=0, y=0, size, color}) => ({
    x,
    y,
    with:cellSize,
    height:size,
    color:color,
    draw(){
        if(direction === 'up') this.y -= cellSize
        if(direction === 'down') this.y += cellSize
        if(direction === 'left') this.x -= cellSize
        if(direction === 'right') this.x += cellSize
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.with, this.height)
    }
})



window.addEventListener('keydown', (e) => {
    let newDirection = ''
    console.log(e.key)
    switch(e.key){
        case 'ArrowUp':
            newDirection = 'up'
            break
        case 'ArrowDown':
            newDirection = 'down'
            break
        case 'ArrowLeft':
            newDirection = 'left'
            break;
        case 'ArrowRight':
            newDirection = 'right'
            break;
        case ' ':
            newDirection = 'Space'
            console.log(direction)
            break
        default:
            break
    }

    if(direction === 'up'  || direction === 'down' && newDirection === 'left' || newDirection === 'right')
        direction = newDirection

    if(direction === 'left'  || direction === 'right' && newDirection === 'up' || newDirection === 'down')
        direction = newDirection

    if(direction === '')
        direction = newDirection


})
var snk = snake({x:100, y:100, size:cellSize, color:cellColor})

function endGame(){
    if(snk.x < 0 || snk.x > canvas.width || snk.y < 0 || snk.y > canvas.height){
        alert('Game Over')
        restartGame()
    }
}

const restartGame = () => {
    snk.x = 100
    snk.y = 100
    direction = ''
}


const update = () => {
    console.log(1)
    endGame()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    snk.draw()
    drawCellsBoard()
    // requestAnimationFrame(update)
}


setInterval(update, 150)
// requestAnimationFrame(update)