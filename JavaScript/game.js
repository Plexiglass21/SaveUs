import{Constants} from "./Utility.js"
import { LevelsManager } from './Levels.js';
import { Player, EnemyManager } from './Entity.js';
import { ObjManager } from './Objects.js';

const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
//constants
canvas.width=innerWidth
canvas.height=innerHeight

const TILE_SIZE=innerHeight/7
const constants = new Constants()
const lvlManager = new LevelsManager(TILE_SIZE)
lvlManager.setLevel(1)

const enemyManager = new EnemyManager(TILE_SIZE,lvlManager)
const objManager = new ObjManager(TILE_SIZE)
const player= new Player(canvas,0,0,TILE_SIZE*1.5,TILE_SIZE*1.5,TILE_SIZE,lvlManager)


let dialogEnded=true
let dialogStrings= new Array()
let indexDialog=0

//dialogs()
gameLoop()

function dialogs(){ 
    setTimeout(() => {
        document.getElementById('message-box').classList.add('message-box');
    }, 1000);

    switch (lvlManager.currentLvl.index) {
        case 1:
            dialogStrings=["What is your name?","Ezekial","Fuck you Ezekial!","Fuck you!!"]
            break;
        case 2:
            dialogStrings=["ciao","ciao a te","suca","sucuni"]
            break;
        case 3:
            dialogStrings=["ciao","ciao a te","suca","sucuni"]
            break;
        case 4:
            dialogStrings=["ciao","ciao a te","suca","sucuni"]
            break;
        case 5:
            dialogStrings=["ciao","ciao a te","suca","sucuni"]
            break;
    }

    playDialog()
}
function playDialog() {

    document.getElementById('character1').classList.add('character1-entry')
    document.getElementById('character2').classList.add('character2-entry')
    
    document.getElementById("message-text").innerHTML= (indexDialog%2==0) ? "Guzzi: " + dialogStrings[indexDialog] : "Valastro: " + dialogStrings[indexDialog] 

    if (indexDialog> dialogStrings.length-1) {
        document.getElementById('character1').classList.add('invisible')
        document.getElementById('character2').classList.add('invisible')
        document.getElementById('message-box').classList.add('invisible')
        dialogEnded=true
        gameLoop()
    }
}

function gameLoop() {
    update()
    draw()
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 16.67); // 1000 ms / 60 FPS = 16.67 ms
}

function update(){
    player.update()
    enemyManager.update()
    //obj.update()
    checkBorder()
}

function draw() {
    c.clearRect(0,0,canvas.width,canvas.height)
    lvlManager.draw(c)
    player.draw(c)
    enemyManager.draw(c)
    // obj.draw(c)
}

function checkBorder() {
    if (player.hitbox.x<0) {
        player.hitbox.x=0
        player.walkSpeed=0  
    }
    else player.walkSpeed=10
}

addEventListener("keydown", ({ key })=>{
    //console.log(keyCode)
    switch (key) {
        case "d":
            player.setRight(true)
            break;
        case "a":
            player.setLeft(true)
            break;
        case " ":
            if(dialogEnded)player.setJump(true)
            else {
                indexDialog++
                playDialog()
            }

            break;
    }

})

addEventListener("keyup", ({ key })=>{
    switch (key) {
        case "d":
            player.setRight(false)
            break;
        case "a":
            player.setLeft(false)
            break;
    }

})
