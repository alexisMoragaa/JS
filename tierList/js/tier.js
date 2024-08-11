const  $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

const imageInput = $('#image-input');
const itemSection = $('#selector-items');
const resetButton = $('#reset-tier-button');
const getCapture = $('#get-capture');

let draggedElement = null;
let sourceContainer = null;

function useFileToCreateItems(files){
    if(files && files.length > 0){
        
        Array.from(files).forEach(file => {

            const reader = new FileReader();
            
            reader.onload = (eventReader) => {
                createItem(eventReader.target.result)
            }
            reader.readAsDataURL(file);
        })
    }
}

//Maneja el evento para cargar una imagen
imageInput.addEventListener('change', (e) => {
    const {files} = e.target
    useFileToCreateItems(files) 
})


//crea un elemento html img y le añade los eventos de drag
const createItem = (src) => {
    const imgElement = document.createElement('img');
    imgElement.src = src
    imgElement.className = 'item-image';
    imgElement.draggable = true;

    imgElement.addEventListener('dragstart', handleDragStart)
    imgElement.addEventListener('dragend', handleDragEnd)

    itemSection.appendChild(imgElement);

    return imgElement;
}



//Maneja el evento al soltar un elemento
const handleDrop = (e) => {
    e.preventDefault()
    const {currentTarget, dataTransfer} = e;

    if(sourceContainer && draggedElement){
        sourceContainer.removeChild(draggedElement)
    }

    if(draggedElement){
        const src = dataTransfer.getData('text/plain')
        const imgElement = createItem(src)
        currentTarget.appendChild(imgElement)
    }

    currentTarget.classList.remove('drag-over')
    currentTarget.querySelector('.drag-preview')?.remove()
}

//Maneja el evento de arrastrar sobre un elemento
const hanldeDragOver = (e) => {
    e.preventDefault()
    const {currentTarget} = e;
    if(currentTarget === sourceContainer)  return

    currentTarget.classList.add('drag-over')
    console.log('drag over')

    const dragPreview = $('.drag-preview')
    if(draggedElement && !dragPreview){
        const previewElement = draggedElement.cloneNode(true)
        previewElement.classList.add('drag-preview')
        currentTarget.appendChild(previewElement)
    }
}

const handleDragLeave = (e) => {
    e.preventDefault()

    const {currentTarget} = e;
    currentTarget.classList.remove('drag-over')

    currentTarget.querySelector('.drag-preview')?.remove()
}


const handleDragStart = (e) => {
    draggedElement = e.target;
    sourceContainer = e.target.parentNode;
    e.dataTransfer.setData('text/plain', draggedElement.src);
}

const handleDragEnd = (e) => {
    console.log('Finalizado')
    draggedElement = null;
    sourceContainer = null;
}

const handleDropFromDesktop = (e) => {
    e.preventDefault()

    const {currentTarget, dataTransfer} = e;

    if(dataTransfer.types.includes('Files')){
        currentTarget.classList.remove('drag-over')
        useFileToCreateItems(dataTransfer.files)
    }
}

const handleDraOvergFromDesktop = (e) => {
    e.preventDefault()
    
    const {currentTarget, dataTransfer} = e;

    if(dataTransfer.types.includes('Files')){
        currentTarget.classList.add('drag-over')
    }
}

const rows =  $$('.tier .row');

rows.forEach( row => {
    row.addEventListener('drop', handleDrop)
    row.addEventListener('dragover', hanldeDragOver)
    row.addEventListener('dragleave', handleDragLeave)
})


itemSection.addEventListener('drop', handleDrop)
itemSection.addEventListener('dragover', hanldeDragOver)
itemSection.addEventListener('dragleave', handleDragLeave)

itemSection.addEventListener('drop', handleDropFromDesktop)
itemSection.addEventListener('dragover', handleDraOvergFromDesktop)


resetButton.addEventListener('click', () => {
    const items = $$('.tier .item-image');
    items.forEach(item => {
        item.remove()
        itemSection.appendChild(item)
    })
})

getCapture.addEventListener('click', () => {
    const tierContainer = $('.tier')
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') 

    import('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/+esm')
    .then(({default: html2canvas}) => {
        html2canvas(tierContainer).then( canvas => {

            ctx.drawImage(canvas, 0, 0)
            const imgURL = canvas.toDataURL('image/png')
            
            const downloadLink = document.createElement('a')
            downloadLink.download = 'tier-list.png'
            downloadLink.href = imgURL
            downloadLink.click()
        })
    })

})