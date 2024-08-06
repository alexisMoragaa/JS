/**Controls */
let state = 0;
let interval = null;
let gen = 0;

//Canvas
const canvas = document.getElementById('gameOfLifeCanvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth -1; //set width
ctx.canvas.height = window.innerHeight-1; // set height

const cellSize = 5;
const cellColor = 'black';
ctx.fillStyle = cellColor;

var mapp = [];

//Establece el contenido del array map con los valores que iniciaran el juego
function initialState() {
    mapp = Array.from({length: canvas.height}, () => {
        return Array.from({length: canvas.width}, () => Math.random() < 0.6 ? 0 : 1)
    })
    console.log(mapp)
}

//Funcion encargada de pintar las celuldas en cada iteracion
function renderGame(map){
    map.forEach((row, y) =>{
        row.forEach((cell, x) => {
            cell && ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        })
    })
}

//Funcion ecargada de revisar, validar y crear el nuevo arreglo con los valores de las celulas
function validate(){
    const newMap = structuredClone(mapp);

    mapp.forEach((row, y) =>{
        row.forEach((cell, x) => {

            let neighbors = getNeightbors(x, y); 

            if (cell && (neighbors == 2 || neighbors == 3)){
                newMap[y][x] = 1;
            }else if(!cell && neighbors == 3){
                newMap[y][x] = 1;
            }else{
                newMap[y][x] = 0;
            }

        })
    })
    mapp = newMap;
}

//Funcion encargada de contar los vecinos vivos de una celula
function getNeightbors(x, y){
    let neighbors = 0;

    if(y > 0){
        if(mapp[y-1][x]) neighbors++;
        if(mapp[y-1][x-1]) neighbors++;
        if(mapp[y-1][x+1]) neighbors++;
    }

    if(x > 0){
        if(mapp[y][x-1]) neighbors++;
    }
    
    if(y < mapp.length -1){
        if(mapp[y+1][x-1]) neighbors++;
        if(mapp[y+1][x]) neighbors++;
        if(mapp[y+1][x+1]) neighbors++;
    }

    if(x < mapp.length -1){
        if(mapp[y][x+1]) neighbors++;
    }

    return neighbors;
}

//Limpia el canvas
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Reinicia el juego
function clearBoard(){
    initialState()
    clearInterval(interval);
    state && changeState();
    clearCanvas();
    gen = 0;
    document.getElementById('gen').innerHTML = `Gen: 0`;
    renderGame(mapp);
}

//Realiza el cambio de estado del juego
const changeState = () => {
    state = state ? 0 : 1;
    document.getElementById('playPause').innerHTML = state ? 'Pause' : 'Play';
}

//Actualiza el juego en cada frame
function update(){
    clearCanvas();
    validate();
    renderGame(mapp);
    document.getElementById('gen').innerHTML = `Gen: ${gen++}`;
}

//inicia o pausa el juego
function playPause(){
    changeState();
    if(state){
        interval = setInterval(update, 150);
    }else{
        clearInterval(interval);
    }
}


initialState();//establece las celulas iniciales
renderGame(mapp);//renderiza las celulas iniciales