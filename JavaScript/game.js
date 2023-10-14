import { LevelsManager } from './Levels.js';
import { Player, EnemyManager } from './Entity.js';
import { ObjManager } from './Objects.js';

const canvas = document.querySelector("canvas")

//constants
canvas.width=innerWidth
canvas.height=innerHeight

export class Constants{
    constructor(){
        this.GAME_WIDTH= innerWidth     //larghezza canvas
        this.GAME_HEIGHT= innerHeight   //altezza canvas
        this.TILES_IN_WIDTH = 15;      //blocchi visibili in larghezza
        this.TILES_IN_HEIGHT = 7;     //blocchi visibili in altezza   
        this.TILES_GAME_WIDTH = 60;    //blocchi totali livello in larghezza
        this.TILES_GAME_HEIGHT = 7;   //blocchi totali livello in altezza
        this.TILE_SIZE_HEIGHT=innerHeight/this.TILES_IN_HEIGHT     //altezza dei tile
        this.TILE_SIZE_WIDTH= innerWidth/this.TILES_IN_WIDTH       //larghezza dei tile

        this.PLAYER_HEIGHT=this.TILE_SIZE_HEIGHT*1.2
        this.PLAYER_WIDTH=this.TILE_SIZE_WIDTH*1.2

        this.BOX_WIDTH=100
        this.BOX_HEIGHT=100
        this.COIN_WIDTH=70
        this.COIN_HEIGHT=70
        this.COVID_WIDTH=100
        this.COVID_HEIGHT=100

        this.RIMBALZO=-15
        this.SALTO=-30
        this.PLAYER_WALK=10

        this.SIZE_ASSETS=128

        this.COIN=8
        this.BOX=7
    }
}
export class Game{

    constructor(canvas){
        this.canvas=canvas
        this.c = canvas.getContext("2d")
        this.constants = new Constants();
        this.lvlManager = new LevelsManager()
        this.lvlManager.setLevel(1)

        this.player= new Player(this.canvas,0,0,this.constants.PLAYER_WIDTH,this.constants.PLAYER_HEIGHT,this.lvlManager,this)
        this.enemyManager = new EnemyManager(this.lvlManager,this.player)
        
        this.objManager = new ObjManager(this.lvlManager,this.player)

        this.rightBorder=0.8*this.canvas.width
        this.leftBorder=0.2*this.canvas.width
        this.lvlTilesWide=this.constants.TILES_GAME_WIDTH
        this.maxTilesOffset=this.lvlTilesWide-this.constants.TILES_IN_WIDTH;
        this.maxLvlOffsetX=this.maxTilesOffset*this.constants.TILE_SIZE_WIDTH;
        this.xLvlOffset=0

        this.dialogEnded=true
        this.dialogStrings= new Array()
        this.indexDialog=0

        //this.dialogs()
        this.gameLoop()

    }

    dialogs(){ 
        setTimeout(() => {
            document.getElementById('message-box').classList.add('message-box');
        }, 1000);
    
        switch (lvlManager.currentLvl.index) {
            case 1:
                this.dialogStrings=["What is your name?","Ezekial","Fuck you Ezekial!","Fuck you!!"]
                break;
            case 2:
                this.dialogStrings=["ciao","ciao a te","suca","sucuni"]
                break;
            case 3:
                this.dialogStrings=["ciao","ciao a te","suca","sucuni"]
                break;
            case 4:
                this.dialogStrings=["ciao","ciao a te","suca","sucuni"]
                break;
            case 5:
                this.dialogStrings=["ciao","ciao a te","suca","sucuni"]
                break;
        }
    
        this.playDialog()
    }

    playDialog() {
    
        document.getElementById('character1').classList.add('character1-entry')
        document.getElementById('character2').classList.add('character2-entry')
        
        document.getElementById("message-text").innerHTML= (indexDialog%2==0) ? "Guzzi: " + dialogStrings[indexDialog] : "Valastro: " + dialogStrings[indexDialog] 
    
        if (this.indexDialog> this.dialogStrings.length-1) {
            document.getElementById('character1').classList.add('invisible')
            document.getElementById('character2').classList.add('invisible')
            document.getElementById('message-box').classList.add('invisible')
            this.dialogEnded=true
            this.gameLoop()
        }
    }

    gameLoop() {
        this.draw()
        this.update()
        
        setTimeout(() => {
            requestAnimationFrame(this.gameLoop.bind(this));
        }, 16.67); // 1000 ms / 60 FPS = 16.67 ms
    }
    
    update(){
        this.player.update()
        this.enemyManager.update()
        this.objManager.update()
        this.checkBorder()
    }
    
    draw() {
        this.c.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.lvlManager.draw(this.c,this.xLvlOffset)
        this.player.draw(this.c,this.xLvlOffset)
        this.enemyManager.draw(this.c,this.xLvlOffset)
        this.objManager.draw(this.c,this.xLvlOffset)
    }
    
    checkBorder() {
        let playerX= parseInt(this.player.hitbox.x)
        let diff=playerX-this.xLvlOffset

        if (playerX<0) {
            this.player.hitbox.x=0
            this.player.walkSpeed=0  
        }
        else this.player.walkSpeed=this.constants.PLAYER_WALK
        if(diff>this.rightBorder)
            this.xLvlOffset+=diff-this.rightBorder
        
        else if(diff<this.leftBorder)this.xLvlOffset+=diff-this.leftBorder
            
        if(this.xLvlOffset>this.maxLvlOffsetX) this.xLvlOffset=this.maxLvlOffsetX
        else if(this.xLvlOffset<0) this.xLvlOffset=0
    }

    checkEnemyHit(hitbox){
        this.enemyManager.checkEnemyHit(hitbox)
    }
    checkObjectHit(hitbox){
        this.objManager.checkObjectHit(hitbox)
    }
}

const game = new Game(canvas)

addEventListener("keydown", ({ key })=>{
    //console.log(keyCode)
    switch (key) {
        case "d":
            game.player.setRight(true)
            break;
        case "a":
            game.player.setLeft(true)
            break;
        case " ":
            if(game.dialogEnded)game.player.setJump(true)
            else {
                game.indexDialog++
                playDialog()
            }

            break;
    }

})

addEventListener("keyup", ({ key })=>{
    switch (key) {
        case "d":
            game.player.setRight(false)
            break;
        case "a":
            game.player.setLeft(false)
            break;
    }

})
