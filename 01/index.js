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
    
    var newMap = [];
    for(let i = 0; i < canvas.height; i += cellSize){
        const row = []
        for(let x = 0; x < canvas.width; x += cellSize){
            let isLive = Math.random() < 0.6 ? 0 : 1;
            row.push(isLive);
        }
        newMap.push(row);
    }

    mapp = newMap;
}

//Funcion encargada de pintar las celuldas en cada iteracion
function renderGame(map){
    for(let i = 0; i < map.length; i++){
        for(let x = 0; x < map[i].length; x++){
            if(map[i][x]){
                ctx.fillRect(x*cellSize, i*cellSize, cellSize, cellSize);
            }
        }
    }
}

//Fcuncion ecargada de revisar, validar y crear el nuevo arreglo con los valores de las celulas
function validate(){
    const newMap = structuredClone(mapp);

    for(let i = 0; i < mapp.length; i++){
        for(let x = 0; x < mapp[i].length; x++){
            let neighbors = getNeightbors(x, i); 
            let cell = mapp[i][x];
            
            if (cell && (neighbors == 2 || neighbors == 3)){
                newMap[i][x] = 1;
            }
            
            if(!cell && neighbors == 3){
                newMap[i][x] = 1;
            }

            if(cell && neighbors < 2){
                newMap[i][x] = 0;
            }
            if(cell && neighbors > 3){
                newMap[i][x] = 0;
            }
        }
    }

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
        if( mapp[y+1][x-1]) neighbors++;
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

//Actualiza el juego en cada frame
function update(){
    clearCanvas();
    validate();
    renderGame(mapp);
    gen++;
    document.getElementById('gen').innerHTML = `Gen: ${gen}`;
}

//Realiza el cambio de estado del juego
const changeState = () => {
    state = state ? 0 : 1;
    document.getElementById('playPause').innerHTML = state ? 'Pause' : 'Play';
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