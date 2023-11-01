const canvas = document.querySelector('canvas')
canvas.style.backgroundColor="#c4b195"
const c= canvas.getContext("2d")

canvas.width=innerWidth-30
canvas.height=innerHeight-30

const TileInWidth=60
const TileVisibleInWidth=15
const TileInHeight=7
const TileHeight=innerHeight/TileInHeight
const TileWidth=innerWidth/TileVisibleInWidth
const jumpPlayer=TileHeight/8
const gravity=0.5

var rightBorder=0.8*canvas.width
var leftBorder=0.1*canvas.width
var lvlTilesWide=TileWidth
var maxTilesOffset=this.lvlTilesWide-TileInWidth;
var maxLvlOffsetX=this.maxTilesOffset*TileWidth;
var xLvlOffset=0

const floorCollision2D = [];
for (let i = 0; i < floorCollision.length; i += TileInWidth) {
    floorCollision2D.push(floorCollision.slice(i, i + TileInWidth));
}
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

const platformerCollision2D = [];
for (let i = 0; i < platformCollision.length; i += TileInWidth) {
    platformerCollision2D.push(platformCollision.slice(i, i + TileInWidth));
}
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

const object2D = [];
for (let i = 0; i < objects.length; i += TileInWidth) {
    object2D.push(objects.slice(i, i + TileInWidth));
}
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

const enemy2D = [];
for (let i = 0; i < enemies.length; i += TileInWidth) {
    enemy2D.push(enemies.slice(i, i + TileInWidth));
}
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
    }
})

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

function animate() {
    window.requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    c.save()
    checkBorder()
    player.update(xLvlOffset)

    collisionBlocks.forEach(collisionBlocks =>{collisionBlocks.draw(xLvlOffset)})
    platformCollisionBlocks.forEach(collisionBlocks =>{collisionBlocks.draw(xLvlOffset)})
    objectBlocks.forEach(object => {object.update(xLvlOffset)})
    enemyBlocks.forEach(enemy =>{enemy.update(xLvlOffset)})

    player.velocity.x=0
    if(keys.right.pressed){
        player.lastDir='right'
        player.switchSprite('Run')
        player.velocity.x=5
    } 
    else if(keys.left.pressed){
        player.lastDir='left'
        player.switchSprite('Run')
        player.velocity.x=-5
    } 
    else if(player.velocity.y===0) player.switchSprite('Idle')

    if(player.velocity.y<0) player.switchSprite('Jump')

    c.restore()
}

function checkBorder(){
        
    let playerX= parseInt(player.hitbox.position.x)
    let diff=playerX-xLvlOffset

    if (playerX<0) {
        player.velocity.x=0
        player.position.x+=0.1
    }
    
    if(diff>rightBorder){
        xLvlOffset+=diff-rightBorder
    }
    else if(diff<leftBorder)xLvlOffset+=diff-leftBorder
        
    if(xLvlOffset>maxLvlOffsetX) xLvlOffset=maxLvlOffsetX
    else if(xLvlOffset<0) xLvlOffset=0

    
}

animate()

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
                player.velocity.y=-jumpPlayer
                keys.jump.pressed=true
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
    }
})