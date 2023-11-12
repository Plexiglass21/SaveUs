const canvas = document.querySelector('canvas')
canvas.style.backgroundColor="#c4b195"
const c= canvas.getContext("2d")

//dimensione canvas
canvas.width=innerWidth-30      
canvas.height=innerHeight-30

const TileInWidth=150       //numero tile livello in larghezza
const TileVisibleInWidth=15 //numero tile in larghezza visibli nel canvas
const TileInHeight=7        //numeor tile in altezza
const TileHeight=innerHeight/TileInHeight       //altezza tile
const TileWidth=innerWidth/TileVisibleInWidth   //larghezza tile
const jumpPlayer=TileHeight/8                   //salto player
const gravity=0.5                               //valore gravità

var xLvlOffset=0                                //offset livello(permette lo scorrimento del livello)
var rightBorder = parseInt(0.6*canvas.width)    //valore del bordo destro della camera(60% del canvas)
var leftBorder = parseInt(0.1*canvas.width)     //valore del bordo sinistro della camera(10% del canvas)                  
var maxTilesOffset = TileInWidth-TileVisibleInWidth;    // valore massimo offset livello
var maxLvlOffsetX = maxTilesOffset*TileWidth;           // valore massimo offset livello in larghezza

var battleStarted=false
//memorizza ogni riga della matrice floorCollisiion nel vettore fllorCollision2D
const floorCollision2D = [];
for (let i = 0; i < floorCollision.length; i += TileInWidth) {
    floorCollision2D.push(floorCollision.slice(i, i + TileInWidth));
}
//per ogni elemento con value diverso da 0 crea un oggetto collisionBlock e lo immagazzina in collisionBlocks
const collisionBlocks=[]
floorCollision2D.forEach((row,y) => {
    row.forEach((value,x) => {
        if (value !== 0) {
        collisionBlocks.push(
            new CollisonBlock({
                position:{
                    x:x*TileWidth,
                    y:y*TileHeight,
                },
                height:TileHeight,
                width:TileWidth,
                type:value,
            })
            )
        }
    })
});

//memorizza ogni riga della matrice platformCollision nel vettore platformerCollision2D
const platformerCollision2D = [];
for (let i = 0; i < platformCollision.length; i += TileInWidth) {
    platformerCollision2D.push(platformCollision.slice(i, i + TileInWidth));
}
//per ogni elemento con value diverso da 0 crea un oggetto CollisonBlock e lo immagazzina in platformCollisionBlocks
const platformCollisionBlocks=[]
platformerCollision2D.forEach((row,y) => {
    row.forEach((value,x) => {
        if(value!==0){
            platformCollisionBlocks.push(
                new CollisonBlock({
                    position:{
                        x:x*TileWidth,
                        y:y*TileHeight,
                    },
                    height:30,
                    width:200,
                    type:value,
                })
            )
        }
    })
});

//memorizza ogni riga della matrice objects nel vettore objects2D
const object2D = [];
for (let i = 0; i < objects.length; i += TileInWidth) {
    object2D.push(objects.slice(i, i + TileInWidth));
}
//per ogni elemento con value diverso da 0 crea un oggetto GameObject e lo immagazzina in objectBlocks
const objectBlocks=[]
object2D.forEach((row,y) => {
    row.forEach((value,x) => {
        if (value !== 0) {
            objectBlocks.push(
            new GameObject({
                position:{
                    x:x*TileWidth,
                    y:y*TileHeight,
                },
                src:'img/LV_1/box.png',
                width:100,
                height:100,
                code:value
            })
            )
        }
    })
});

//memorizza ogni riga della matrice enemies nel vettore enemy2D
const enemy2D = [];
for (let i = 0; i < enemies.length; i += TileInWidth) {
    enemy2D.push(enemies.slice(i, i + TileInWidth));
}
//secondo il value crea un oggetto con superclasse Enemy e lo immagazzina in enemyBlocks
const enemyBlocks=[]
enemy2D.forEach((row,y) => {
    row.forEach((value,x) => {
        if (value === 1) {
            enemyBlocks.push(
            new Covid({
                position:{
                    x:x*TileWidth,
                    y:y*TileHeight,
                },
                width:50,
                height:50,
                collisionBlocks,
                platformCollisionBlocks,
                objectBlocks,
                src:"/src/img/idle-19.png",
                type:'covid',
            })
            )
        }
    })
});

//creazione player
const player= new Player({
    position:{
        x:0,
        y:0,
    },
    collisionBlocks:collisionBlocks,
    platformCollisionBlocks:platformCollisionBlocks,
    objectBlocks:objectBlocks,
    enemyBlock:enemyBlocks,
    src:"/src/img/idle-guz.png",
    frameRate:10,
    frameBuffer:12,
    animations:{
        Idle:{
            src:'/src/img/idle-guz.png',
            frameRate:10,
            frameBuffer:12,
        },
        Run:{
            src:'/src/img/run-guz.png',
            frameRate:8,
            frameBuffer:10,
        },
        Jump:{
            src:'/src/img/jump-guz.png',
            frameRate:3,
            frameBuffer:20,
        },
        Death:{
            src:'/src/img/death-guz.png',
            frameRate:10,
            frameBuffer:12,
        }
    }
})

//booleane per i click dei pulsanti di movimento
const keys={
    right:{
        pressed:false,
    },
    left:{
        pressed:false,
    },
    jump:{
        pressed:false,
    },
}

//gameloop
function animate() {
    if (!battleStarted)
        livello()
    else
        battaglia()
}

//constrolla se il player si avvicina a uno dei due bordi della camera così da aumentare l'offset per muovere il livello
function checkBorder(){   
    let playerX= player.hitbox.position.x
    let diff=playerX-xLvlOffset

    if (playerX<0) {
        player.velocity.x=0
        player.position.x+=0.1
    }
    
    if(diff>rightBorder)
        xLvlOffset+=diff-rightBorder
    else if(diff<leftBorder)
        xLvlOffset+=diff-leftBorder
        
    if(xLvlOffset>maxLvlOffsetX) xLvlOffset=maxLvlOffsetX
    else if(xLvlOffset<0) xLvlOffset=0    
}

animate()


//ascoltatori click tastiera
window.addEventListener('keydown', (event) =>{
    switch (event.key) {
        case 'd':
            keys.right.pressed=true
            break;
        case 'a':
            keys.left.pressed=true
            break;
        case ' ':
            if(!keys.jump.pressed){
                if(player.velocity.y==0){
                    player.velocity.y=-jumpPlayer
                    keys.jump.pressed=true
                }
            }
            break;
    }
})

window.addEventListener('keyup', (event) =>{
    switch (event.key) {
        case 'd':
            keys.right.pressed=false
            break;
        case 'a':
            keys.left.pressed=false
            break;
        case ' ':
            keys.jump.pressed=false
            break;
        case 'b':
            battleStarted=true
            break;
    }
})

function livello() {
    window.requestAnimationFrame(animate)  //crea il loop
    c.clearRect(0,0,canvas.width, canvas.height)// pulisce il canvas
    c.save()    //salva la condizione attuale del canvas
    checkBorder()
        
    //disegna il livello
    collisionBlocks.forEach(collisionBlocks =>{collisionBlocks.draw(xLvlOffset)})
    platformCollisionBlocks.forEach(collisionBlocks =>{collisionBlocks.draw(xLvlOffset)})
    objectBlocks.forEach(object => {object.update(xLvlOffset)})
    enemyBlocks.forEach(enemy =>{enemy.update(xLvlOffset)})
    player.update(xLvlOffset)
        
    player.velocity.x=0
    //gestione direzione e cambio sprite player
    if(keys.right.pressed){
        player.lastDir='right'
        player.switchSprite('Run')
        player.velocity.x=player.walkSpeed
    } 
    else if(keys.left.pressed){
        player.lastDir='left'
        player.switchSprite('Run')
        player.velocity.x=-player.walkSpeed
    } 
    else if(player.velocity.y===0 && !player.die) player.switchSprite('Idle')

    if(player.velocity.y<0) player.switchSprite('Jump')

    c.restore() //ripristina il canvas
}

function battaglia(){
    c.clearRect(0,0,canvas.width, canvas.height)
}