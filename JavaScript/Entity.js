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
    constructor(x,y,w,h,lvlManager,TILE_SIZE){
        this.x=x
        this.y=y
        this.width=w
        this.height=h
        this.lvlManager=lvlManager
        this.TILE_SIZE=TILE_SIZE
    }

    initHitbox(w,h){
        this.hitbox = new Hitbox(this.x,this.y,w,h);
    }
    drawHitbox(c,xLvlOffset){
        c.strokeStyle = "red";
        c.strokeRect(this.hitbox.x-xLvlOffset,this.hitbox.y,this.hitbox.width,this.hitbox.height)
    }
    
    canMove(x,y,w,h){
        if (!this.isSolid(x, y))                        //angolo alto SX
            if (!this.isSolid(x + w, y + h))   //angolo basso DX
                if (!this.isSolid(x + w, y))        //angolo alto DX
                    if (!this.isSolid(x, y + h))   //angolo basso SX
                        return true;
            
            return false;
        
    }

    isSolid(x,y){
        let xTile=parseInt(x/this.TILE_SIZE)
        let yTile=parseInt(y/this.TILE_SIZE)


        let value = this.lvlManager.currentLvl.lvlCodes[yTile][xTile]
        
        return value!=0 && value!=2 && value!=4 && value!=5 && value!=9
    }

    getPosUnderRoofOrAboveFloor(hitbox,airSpeed) {
        let currentTile = parseInt(hitbox.y / this.TILE_SIZE);
        if (airSpeed > 0) { 
            // Falling - touching floor
            let tileYPos = currentTile * this.TILE_SIZE;
            let yOffset = parseInt (this.TILE_SIZE - hitbox.height);
            return tileYPos - yOffset -1;
        } else {
            // Jumping
            return currentTile * this.TILE_SIZE+160;
        }
            
    }

    getPosNextToWall(hitbox,walkSpeed) {
        let currentTile = parseInt (hitbox.x / this.TILE_SIZE);
        if (walkSpeed > 0) {
            // Right
            let tileXPos = currentTile * this.TILE_SIZE;
            let xOffset = parseInt (this.TILE_SIZE - hitbox.width);
            return tileXPos + xOffset+5;
        } else
            // Left
            return currentTile * this.TILE_SIZE;
    }

    isOnFloor(hitbox){
        if (!this.isSolid(hitbox.x, hitbox.y + hitbox.height + 2))
			if (!this.isSolid(hitbox.x + hitbox.width, hitbox.y + hitbox.height + 73))
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
let indexPl=0
let tickPl=0
let indexE=0
let tickE=0
export class Player extends Entity{
    constructor(canvas,x,y,w,h,lvlManager,TILE_SIZE){
        super(x,y,w,h,TILE_SIZE,lvlManager)
        this.vel=0
        this.walkSpeed=10
        this.jumpSpeed=-30

        this.inAir=true
        this.moving=false

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
        this.runImg.src="/src/img/Run.png"
        this.idleImg.src="/src/img/idle-guz.png"
        this.jumpImg.src="/src/img/Jump.png"
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
            // Rifletti l'immagine orizzontalmente
            c.save();
            c.scale(-1, 1);
            c.drawImage(this.activeImg,
                indexPl,
                0,128,
                this.activeImg.height,
                -this.hitbox.x - this.hitbox.width+xLvlOffset,
                this.hitbox.y,
                this.width,
                this.height);
            c.restore();
        } else {
           c.drawImage(this.activeImg,
                        indexPl,
                        0,128, 
                        this.activeImg.height,
                        this.hitbox.x-xLvlOffset,
                        this.hitbox.y,
                        this.width,
                        this.height)    //cord X(crop) , cordY(crop) , width(crop) , height(crop)  
        }
        this.drawHitbox(c,xLvlOffset)        
    }

    update(){
        this.updatePos()
        this.updateIndex() 
        this.setAni()    
    }

    updatePos(){

        if (!this.inAir)
            if (!this.isOnFloor(this.hitbox))
                this.inAir = true;

        if(this.canMove(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height)){
            if(this.inAir){
                this.hitbox.y += this.vel
                this.vel += gravity
            }

        }else{
            this.hitbox.y = this.getPosUnderRoofOrAboveFloor(this.hitbox, this.vel);
            this.inAir=false
        }
        
        if (this.hitbox.y + this.hitbox.height >= this.canvas.height){
            this.inAir=false
            this.vel=0
        } 

        if(keys.jump.pressed){
            this.jump()
            keys.jump.pressed=false
        }   

        if(keys.right.pressed){
            if(this.canMove(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height))this.hitbox.x+=this.walkSpeed
            else this.hitbox.x=this.getPosNextToWall(this.hitbox,this.walkSpeed)
                
        }
             
        if(keys.left.pressed){
            if(this.canMove(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height))this.hitbox.x-=this.walkSpeed
            else this.hitbox.x=this.getPosNextToWall(this.hitbox,-this.walkSpeed)
            
        }   
        
        keys.jump.pressed=false
        
    }

    updateIndex(){
        tickPl++
        if(tickPl>=7){
            tickPl=0
            indexPl+=128
            if(indexPl>=this.activeImg.width)indexPl=0
        }   
    }

    setAni(){
        let app=this.activeImg
        if(this.inAir){
            if (this.vel<0) 
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
            tickPl=0
            indexPl=0 
        }
            
    }

    jump(){ 
        if(this.inAir) return
        this.inAir=true
        this.vel=this.jumpSpeed
    }
}

export class EnemyManager{
    constructor(tileSize,lvlManager){
        this.TILE_SIZE=tileSize
        this.lvlManager=lvlManager
        this.enemy1 = this.lvlManager.getEnemy1()

    }

    draw(c,xLvlOffset){
        this.enemy1.forEach(element => {
            c.drawImage(element.activeImg,
                indexE,0,128,element.activeImg.height,element.hitbox.x, element.hitbox.y, element.width, element.height)
        });
        
    }

    update(){
        this.enemy1.forEach(element => {
            element.update()
        });
    }
}

export class Enemy extends Entity {
    constructor(x,y,w,h,lvlManager,enemyType){
        super(x,y,w,h,lvlManager)
        this.enemyType=enemyType;
        this.walkSpeed=12
        this.maxHealth=this.getMaxHealth();
        this.currentHealth=this.maxHealth;
        this.initHitbox()
        this.caricaAssets()
    }

    getMaxHealth(){
        switch (this.enemyType) {
            case "Covid":
                return 50
            default:
                break;
        }
    }

    caricaAssets(){
        this.idleImg= new Image()
        this.idleImg.src="/src/img/idle-19.png"
    }

    update(){
        this.updateIndex()
        this.setAni()
    }

    updateIndex(){
        tickE++
        if(tickE>=10){
            tickE=0
            indexE+=128
            if(indexE>=this.activeImg.width)indexE=0
        }   
    }

    setAni(){
        let app=this.activeImg
        if(this.inAir){
            if (this.vel<0) 
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
            tickE=0
            indexE=0 
        }
            
    }
}