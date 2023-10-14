import { Constants } from "./game.js";

const IDLE=1
const RUN=2
const HIT=3
const DEAD=4
const ATTACK=5
class Hitbox {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    intersects(otherRect) {
      return (
        this.x < otherRect.x + otherRect.width &&
        this.x + this.width > otherRect.x &&
        this.y < otherRect.y + otherRect.height &&
        this.y + this.height > otherRect.y
      );
    }
}
class Entity{
    constructor(x,y,w,h,lvlManager){
        this.state=0
        this.x=x
        this.y=y
        this.width=w
        this.height=h
        this.lvlManager=lvlManager
        this.airSpeed=0
        this.constants= new Constants()
    }

    initHitbox(w,h){
        this.hitbox = new Hitbox(this.x,this.y,w,h);
    }

    drawHitbox(c,xLvlOffset){
        c.strokeStyle = "red";
        c.strokeRect(this.hitbox.x-xLvlOffset,this.hitbox.y,this.hitbox.width,this.hitbox.height)
    }
    
    canMove(x,y,w,h){
        if (!this.isSolid(x, y)){//angolo basso SX
            //console.log("1")
            if (!this.isSolid(x + w, y + h)){//angolo basso DX
                //console.log("2")
                if (!this.isSolid(x + w, y)){//angolo alto DX
                    //console.log("3")
                    if (!this.isSolid(x, y + h)) {//angolo alto SX
                        //console.log("4")
                        return true;
                    }    
                }         
            }       
        }
        return false;
        
    }

    isSolid(x,y){
        let maxWidth= this.lvlManager.lvlCodes[0].length*this.constants.TILE_SIZE_WIDTH;
        if (x < 0 || x >= maxWidth) return true;
        if (y < 0 || y >= innerHeight ) return true; 

        let xTile=parseInt(x/this.constants.TILE_SIZE_WIDTH)
        let yTile=parseInt(y/this.constants.TILE_SIZE_HEIGHT)

        let value = this.lvlManager.currentLvl.lvlCodes[yTile][xTile]
        return value!=0 && value<5 && value!=2  && value!=5 && value!=9
    }

    getPosUnderRoofOrAboveFloor(hitbox,airSpeed) {
        let currentTile = parseInt(hitbox.y / this.constants.TILE_SIZE_HEIGHT);
        if (airSpeed > 0) { 
            // Falling - touching floor
            let tileYPos = currentTile * this.constants.TILE_SIZE_HEIGHT;
            let yOffset = parseInt (this.constants.TILE_SIZE_HEIGHT - hitbox.height);
            return tileYPos - yOffset-10;
        } else {
            // Jumping
            return currentTile * this.constants.TILE_SIZE_HEIGHT-100;
        }
            
    }

    getPosNextToWall(hitbox,walkSpeed) {
        let currentTile = parseInt (hitbox.x / this.constants.TILE_SIZE_WIDTH);
        if (walkSpeed > 0) {
            // Right
            let tileXPos = currentTile * this.constants.TILE_SIZE_WIDTH;
            let xOffset = parseInt (this.constants.TILE_SIZE_WIDTH - hitbox.width);
            return tileXPos + xOffset+this.constants.TILE_SIZE_WIDTH;
        } else
            // Left
            return currentTile * this.constants.TILE_SIZE_WIDTH+this.constants.TILE_SIZE_WIDTH;
    }

    isOnFloor(hitbox){
        if (!this.isSolid(hitbox.x, hitbox.y + hitbox.height+1))
			if (!this.isSolid(hitbox.x + hitbox.width, hitbox.y + hitbox.height+1))
				return false;
		return true;
    }
}

const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    },
    jump:{
        pressed: false
    },
}

const gravity=1.5;
export class Player extends Entity{
    constructor(canvas,x,y,w,h,lvlManager,game){
        super(x,y,w,h,lvlManager)
        this.game=game
        this.walkSpeed=10
        this.jumpSpeed=-30
        this.fallspeed=10
        this.index=0
        this.tick=0
        this.xOffset = 50;
        this.yOffset = -35;

        this.inAir=true
        this.moving=false
        this.lastDir=true

        this.canvas=canvas

        this.initHitbox(128,this.height)
        this.caricaAssets()
        this.activeImg=this.idleImg
    }

    caricaAssets() {
        this.runImg= new Image()
        this.idleImg= new Image()
        this.jumpImg= new Image()
        //this.fallImg= new Image()
        this.runImg.src="/src/img/run-guz.png"
        this.idleImg.src="/src/img/idle-guz.png"
        this.jumpImg.src="/src/img/jump-guz.png"
        //this.fallImg.src="./src/img/Fall.png"
    }
    
    setLeft(s){
        keys.left.pressed=s
        this.moving=s
    }
    setRight(s){
        keys.right.pressed=s
        this.moving=s
    }
    setJump(s){
        keys.jump.pressed=s
    }
    
    draw(c,xLvlOffset){
        if (keys.left.pressed) {
            this.lastDir=false
            // Rifletti l'immagine orizzontalmente
            c.save();
            c.scale(-1, 1);
            c.drawImage(this.activeImg,
                this.index,0,
                this.constants.SIZE_ASSETS,this.activeImg.height,
                parseInt(-this.hitbox.x-this.constants.TILE_SIZE_WIDTH-20)+xLvlOffset,
                parseInt(this.hitbox.y-this.yOffset),
                this.width,this.height)
            c.restore();
        } else if(keys.right.pressed) {
            this.lastDir=true
           c.drawImage(this.activeImg,
                        this.index,0,               //cord X(crop) , cordY(crop) , width(crop) , height(crop) 
                        this.constants.SIZE_ASSETS,this.activeImg.height,
                        parseInt(this.hitbox.x-this.xOffset)-xLvlOffset,
                        parseInt(this.hitbox.y-this.yOffset),
                        this.width,this.height)    
        }
        else{
            if(this.lastDir){
                c.drawImage(this.activeImg,
                    this.index,0,
                    this.constants.SIZE_ASSETS,this.activeImg.height,
                    parseInt(this.hitbox.x-this.xOffset)-xLvlOffset,
                    parseInt(this.hitbox.y-this.yOffset),
                    this.width,this.height)
            }
            else{
                c.save();
                c.scale(-1, 1);
                c.drawImage(this.activeImg,
                    this.index,0,
                    this.constants.SIZE_ASSETS,this.activeImg.height,
                    parseInt(-this.hitbox.x-this.constants.TILE_SIZE_WIDTH-20)+xLvlOffset,
                    parseInt(this.hitbox.y-this.yOffset),
                    this.width,this.height)
                c.restore();
            }
        }
        this.drawHitbox(c,xLvlOffset) 
        
    }

    update(){
        this.updatePos()
        
        if(this.moving){
            
        } 
        this.updateIndex() 
        this.setAni() 
        this.checkAttack()     
    }

    updatePos(){

        if(keys.jump.pressed){
            this.jump()
        } 

        if(!this.inAir)
            if((!keys.left.pressed && !keys.right.pressed) || (keys.left.pressed && keys.right.pressed) )
                return;

        if(keys.right.pressed){
            if(this.canMove(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height))this.hitbox.x+=this.walkSpeed
            else{
                this.hitbox.x=this.getPosNextToWall(this.hitbox,this.walkSpeed)
            }    
        }
             
        if(keys.left.pressed){
            if(this.canMove(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height))this.hitbox.x-=this.walkSpeed
            else this.hitbox.x=this.getPosNextToWall(this.hitbox,-this.walkSpeed)
            
        }  
        
        if (!this.inAir){
            if (!this.isOnFloor(this.hitbox))
                this.inAir = true;
        }
            
        if(this.inAir){
            if(this.canMove(this.hitbox.x,this.hitbox.y+this.airSpeed,this.hitbox.width,this.hitbox.height)){
                this.hitbox.y += this.airSpeed
                this.airSpeed += gravity
            }else{
                this.hitbox.y = this.getPosUnderRoofOrAboveFloor(this.hitbox, this.airSpeed);
                this.hitbox.y+=93
                if (this.airSpeed > 0) this.resetInAir();
                else this.airSpeed = this.fallspeed;
            }
            
        }    
        
        keys.jump.pressed=false
    }

    resetInAir(){
        this.inAir=false;
        this.airSpeed=0;
    }

    updateXPos(xSpeed) { 
        if (this.canMove(this.hitbox.x + xSpeed, this.hitbox.y, this.hitbox.width, this.hitbox.height)){
            this.hitbox.x += xSpeed;
        } 
            else this.hitbox.x = this.getPosNextToWall(this.hitbox, xSpeed);
    }

    updateIndex(){
        this.tick++
        if(this.tick>=7){
            this.tick=0
            this.index+=this.constants.SIZE_ASSETS
            if(this.activeImg===this.jumpImg){
                this.index-=this.constants.SIZE_ASSETS
            }
            else if(this.index>=this.activeImg.width)this.index=0
        }   
    }

    jump(){ 
        if(this.inAir) return
        this.inAir=true
        this.airSpeed=this.jumpSpeed
    }

    setAni(){
        let app=this.activeImg
        if(this.inAir){
            if (this.airSpeed<0) 
                this.activeImg=this.jumpImg
             /*else 
                this.activeImg=this.fallImg*/
        }else{
            if(this.moving)
                this.activeImg=this.runImg
            else
                this.activeImg=this.idleImg
        }

        if(app != this.activeImg ){
            this.tick=0
            this.index=0 
        }
            
    }

    checkAttack(){
        this.game.checkEnemyHit(this.hitbox)
        this.game.checkObjectHit(this.hitbox)
    }
    
    bottomCornerHurt(playerHitbox, enemyHitbox) {
        const playerBottom = playerHitbox.y + playerHitbox.height; // Calcola la coordinata Y della base inferiore del giocatore
        if (playerBottom >= enemyHitbox.y && playerBottom <= enemyHitbox.y + enemyHitbox.height) {
            if (playerHitbox.x + playerHitbox.width >= enemyHitbox.x && playerHitbox.x <= enemyHitbox.x + enemyHitbox.width) {
                return true;
            }
        }
        return false;
    }
}

export class EnemyManager{
    constructor(lvlManager,player){
        this.lvlManager=lvlManager
        this.player=player
        this.enemy1 = this.lvlManager.getEnemy1()
        this.constants=new Constants()

    }

    draw(c,xLvlOffset){
        this.enemy1.forEach(element => {
            /*switch (element.getEnemyState()) {
                case IDLE:
                    animationChInUse=chameleonIdle;
                    if(element.hitted)element.hitted=false;
                    break;
                case RUN:
                    animationChInUse=chameleonRun;
                    if(element.hitted)element.hitted=false;
                    break;
                case ATTACK:
                    animationChInUse=chameleonAttack;
                    if(element.hitted)element.hitted=false;
                    break;
                case HIT ,DEAD:
                    animationChInUse=chameleonHit;
                break;
            }*/
            if(element.active){
                c.drawImage(element.activeImg,
                    element.index,0,this.constants.SIZE_ASSETS,element.activeImg.height,element.hitbox.x-xLvlOffset, element.hitbox.y, element.width, element.height)
                element.drawHitbox(c,xLvlOffset)    
            }
            
            
        });
        
    }

    update(){
        this.enemy1.forEach(element => {
            element.update()
        });
    }

    checkEnemyHit(attackBox){
        this.enemy1.forEach(element => {
            if(element.active){
                
                if(element.currentHealth>0){
                    if(this.player.bottomCornerHurt(attackBox,element.hitbox) && this.player.inAir ){
                        element.hurt(100);
                        this.player.inAir=false;
                        this.player.jumpSpeed=this.constants.RIMBALZO
                        this.player.jump();
                        this.player.jumpSpeed=this.constants.SALTO
                        return;
                    }
                }else if(!element.hitted) {
                    element.hitted=true;
                }
                    
            }
        });
    }
}

export class Enemy extends Entity {
    constructor(x,y,w,h,lvlManager,enemyType){
        super(x,y,w,h,lvlManager)
        this.enemyType=enemyType;
        this.setSize();
        this.aniSpeed=10

        this.firstUpdate=true
        this.walkSpeed=12
        this.index=0
        this.tick=0
        this.maxHealth=this.getMaxHealth();
        this.currentHealth=this.maxHealth;
        this.hitted=false
        this.atkDist=this.constants.TILES_GAME_WIDTH
        this.active=true
        this.attackChecked=false
        this.PlColpito=false
        this.initHitbox()
        this.caricaAssets()
    }
    setSize(){
        switch (this.enemyType) {
            case 1:
                this.width=this.constants.COVID_WIDTH
                this.height=this.constants.COVID_HEIGHT
                break;
        
            default:
                break;
        }
    }

    firstUpdateChecked(lvlData){
        if(!this.isOnFloor(this.hitbox)) this.inAir=true;
            this.firstUpdate=false;
    }
    updateInAir(lvlData){
        if(this.canMove(this.hitbox.x, this.hitbox.y +this.airSpeed, this.hitbox.width, this.hitbox.height)){
            this.hitbox.y +=this.airSpeed;
            this.airSpeed+=gravity;
        }else{
            this.inAir=false;
            this.hitbox.y=this.getPosUnderRoofOrAboveFloor(this.hitbox,this.airSpeed);
            this.tileY=parseInt (this.hitbox.y/this.constants.TILE_SIZE_WIDTH);
        }
    }

    move(lvlData){
        /*let xSpeed=0;
        if(dir==0) xSpeed = -walkSpeed;
        else xSpeed = walkSpeed;

            
        if(CanMoveHere(hitbox.x+xSpeed, hitbox.y, hitbox.width, hitbox.height, lvlData))
            if(isFloor(hitbox,xSpeed,lvlData)){
                hitbox.x+=xSpeed;
                return;
            }
        changeDir();*/
    }

    turnTowardsPlayer(player){
        /*if(player.hitbox.x>this.hitbox.x)
            this.dir=1;
        else
            this.dir=0; */
    }

    canSeePlayer(player){
        let playerTileY=parseInt(player.getHitbox().y/this.constants.TILE_SIZE_HEIGHT);
        if(playerTileY==this.tileY-1)
            if(this.isInRange(player))
                if(this.isClear(lvlData,hitbox,player.hitbox,tileY))
                    return true;
            
        return false;
    }

    isInRange(player){
        const abs = Math.abs(player.hitbox.x - this.hitbox.x);
        return abs <= this.atkDist * 5;
    }

    isPlayerIsCLoserForAttack(player){
        const abs = Math.abs(player.hitbox.x - this.hitbox.x);
        return abs <= this.atkDist;
    }

    checkPlayerHit(attackBox,player){
        /*if(!player.isLvlCompleted() ){
            if(attackBox.intersects(player.hitbox)){
                player.changeHealth(-100);
                PlColpito=true;
            }
            attackChecked=true;
        }*/
    }

    getMaxHealth(){
        switch (this.enemyType) {
            case 1:
                return 50
            default:
                break;
        }
    }

    caricaAssets(){
        this.idleImg= new Image()
        this.idleImg.src="/src/img/idle-19.png"
        this.activeImg=this.idleImg
    }

    update(){
        this.updateIndex()
        this.setAni()
    }

    updateIndex(){
        this.tick++
        if(this.tick>=this.aniSpeed){
            this.tick=0
            this.index+=this.constants.SIZE_ASSETS
            if(this.index>=this.activeImg.width){
                this.index=0 
                switch (this.state) {
                    case ATTACK,HIT:
                        state=IDLE
                        break;
                    case DEAD:
                        this.active=false
                }
            }
        }   
    }

    setAni(){
        let app=this.activeImg
        if(this.inAir){
            if (this.airSpeed<0) 
                this.activeImg=this.jumpImg
             /*else 
                this.activeImg=this.fallImg*/
        }else{
            if(this.moving)
                this.activeImg=this.runImg
            else
                this.activeImg=this.idleImg
        }

        if(app != this.activeImg ){
            this.tick=0
            this.index=0 
        }       
    }

    hurt(value){
        if(!this.hitted){
            this.currentHealth-=value
            if(this.currentHealth<=0)
                this.state=DEAD
            else{
                this.state=HIT
                hitted=true
            }
        }
    }

    reset(){
        this.hitbox.x=x;
        this.hitbox.y=y;
        this.firstUpdate=true;
        this.currentHealth=this.maxHealth;
        this.state=IDLE;
        this.active=true;
        this.airSpeed=0;
    }
}

export class Covid extends Enemy{
    constructor(x, y,lvlManager) {
        super(x, y,0,0,lvlManager, 1);
        this.initHitbox(this.constants.COVID_WIDTH, this.constants.COVID_HEIGHT);
        this.initAttackBox();
    }

    update(lvlData, player) {
        this.updateBehavior(lvlData, player);
        this.updateIndex();
        this.updateAttackBox();
    }

    updateBehavior(lvlData, player) {
        if (this.firstUpdate) this.firstUpdateChecked(lvlData);

        if (this.inAir)
            this.updateInAir(lvlData);
        else {
            switch (this.state) {
                case IDLE:
                    this.newState(RUN);
                    break;
                case RUN:
                    if (this.canSeePlayer(lvlData, player)) {
                        this.turnTowardsPlayer(player);
                        this.newState(ATTACK);
                    }
                    this.move(lvlData);
                    break;
                case ATTACK:
                    this.move(lvlData);

                    if (this.aniIndex === 0) {
                        this.PlColpito = false;
                        this.aniIndex++;
                    }

                    if (!this.PlColpito && !this.hitted)
                        this.checkPlayerHit(this.hitbox, player);
                    break;
            }
        }
    }

    initAttackBox() {
        this.attackBox = new Hitbox(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
        this.attackOffsetX = 30;
    }

    updateAttackBox() {
        this.attackBox.x = this.hitbox.x - this.attackOffsetX;
        this.attackBox.y = this.hitbox.y;
    }
}