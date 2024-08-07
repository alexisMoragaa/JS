/**Controls */
let state = 0
let interval = null
let gen = 0
const cellSize = 15
const cellColor = 'white'
const backgroundColor = 'black'
var board = []

//Canvas
const canvas = document.getElementById('gameOfLifeCanvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth -1 //set width
ctx.canvas.height = window.innerHeight-1 // set height
ctx.strokeStyle = 'blue'
ctx.lineWidth = 0.4

const lengthY = Math.round(canvas.height / cellSize)
const lengthX = Math.round(canvas.width / cellSize)

//Establece el contenido del array map con los valores que iniciaran el juego
function initialState(initialBoard) {
    board = Array.from({length: lengthY}, () => {
        return Array.from({length: lengthX}, () => {
            if(initialBoard){
                return Math.random() < 0.85 ? 0 : 1
            }else{
                return 0   
            }
            }
        )
    })
    console.log(board)
}

//Funcion encargada de pintar las celuldas en cada iteracion
function renderGame(map){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar
    
    ctx.fillStyle = cellColor
    map.forEach((row, y) =>{
        row.forEach((cell, x) => {
            cell && ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
        })
    })

    // Dibujar las líneas horizontales
    for (let y = 0; y <= map.length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvas.width, y * cellSize);
        ctx.stroke();
    }

    // // Dibujar las líneas verticales
    for (let x = 0; x <= map[0].length; x++) {
        ctx.beginPath()
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvas.height)
        ctx.stroke()
    }
    ctx.stroke()

    getPoblation()
    getGen()
}

//Funcion ecargada de revisar, validar y crear el nuevo arreglo con los valores de las celulas
function validate(){
    const newMap = structuredClone(board);

    board.forEach((row, y) =>{
        row.forEach((cell, x) => {
            let neighbors = getNeightbors(y, x); 
            if (cell && (neighbors == 2 || neighbors == 3)){
                newMap[y][x] = 1;
            }else if(!cell && neighbors == 3){
                newMap[y][x] = 1;
            }else{
                newMap[y][x] = 0;
            }
        })
    })
    board = newMap;
}

//Funcion encargada de contar los vecinos vivos de una celula
function getNeightbors(y, x){
    let neighbors = 0

    //01 => arriba a la izquierda
    if(y > 0 && x > 0 && board[y-1][x-1]) neighbors++

    //02 => arriba
    if(y > 0 && board[y-1][x]) neighbors++

    //03 => arriba a la derecha
    if(y > 0 && x < lengthX -1 && board[y-1][x+1]) neighbors++

    //04 => izquierda
    if(x > 0 && board[y][x-1]) neighbors++

    //05 => derecha
    if(x < lengthX -1 && board[y][x+1]) neighbors++

    //06 => abajo a la izquierda
    if(y < lengthY -1 && x > 0 && board[y+1][x-1]) neighbors++

    //07 => abajo
    if(y < lengthY -1 && board[y+1][x]) neighbors++

    //08 => abajo a la derecha
    if(y < lengthY -1 && x < lengthX -1 && board[y+1][x+1]) neighbors++

    return neighbors
}

//Reinicia el juego
function clearBoard(initialBoard){
    initialState(initialBoard)
    clearInterval(interval)
    state && changeState()
    gen = 0
    renderGame(board)
}

//Realiza el cambio de estado del juego
const changeState = () => {
    state = state ? 0 : 1
    document.getElementById('playPause').innerHTML = state ? 'Pause' : 'Play'
}

const getPoblation = () => {
    let poblation = board.reduce((sum, row) =>{
        return sum + row.reduce((ac, num) => ac + num, 0);
    },0)
    document.getElementById('poblation').innerHTML = `Cells: ${poblation}`
}

//renderiza el numero de generaciones
const getGen = () =>{
    document.getElementById('gen').innerHTML = `Gen: ${gen++}`
}
    
//Actualiza el juego en cada frame
function update(){
    validate()
    renderGame(board)
}

//inicia o pausa el juego
function playPause(){
    changeState()
    if(state){
        interval = setInterval(update, 50)
    }else{
        clearInterval(interval)
    }
}

//añade celulas de forma manual en cada pixel
canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / cellSize)
    const y = Math.floor(e.offsetY / cellSize)
    board[y][x] = board[y][x] ? 0 : 1
    renderGame(board)
})


initialState(1)//establece las celulas iniciales
renderGame(board)//renderiza las celulas iniciales

