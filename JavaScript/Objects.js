import { Constants } from "./game.js";

const COIN=1
const BOX=2

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
export class ObjManager{
    constructor(lvlManager,player){
        this.constants= new Constants()
        this.lvlManager=lvlManager
        this.player=player
        this.loadImgs()

        this.coins=lvlManager.getCoins()
        this.boxes=lvlManager.getBoxes()
    }
    
    checkObjTouched(hitbox){
        this.coins.forEach(element => {
            if(element.isActive()){
                if(hitbox.intersects(element.hitbox)){
                    element.setActive(false)
                    interacts(element.objType)
                }
            }
        });
    }
    
    interacts(objtype){
        console.log(objtype)
        switch (objtype) {
            case 1:
                console.log(objtype)
                break;
        }
    }
    
    checkObjectHit(hitbox){
        this.boxes.forEach(element => {
            if(element.active && !element.doAnimation){
                if(this.player.bottomCornerHurt(hitbox,element.hitbox) && this.player.inAir ){                            
                    this.player.inAir=false;
                    this.player.jumpSpeed=this.constants.RIMBALZO
                    this.player.jump();
                    this.player.jumpSpeed=this.constants.SALTO
                    element.doAnimation=true
                    return;
                }
            }
        });
    }

    loadImgs() {
        this.coinImg= new Image()
        this.boxImg= new Image()
       
        this.boxImg.src="/src/img/LV_1/box.png" 
        this.coinImg.src="/src/img/LV_1/pc_coin.png"
    }
    
    update(){
        this.boxes.forEach(element => {
            if(element.active)
                element.update();
        });
    }
    
    draw(c,xLvlOffeset){
        this.drawCoins(c,xLvlOffeset);
        this.drawBox(c,xLvlOffeset);
    }

    drawCoins(c,xLvlOffset){
        this.coins.forEach(element => {
            if(element.active){
                element.drawHitbox(c, xLvlOffset);
                c.drawImage(this.coinImg,
                    element.aniIndex,0,               //cord X(crop) , cordY(crop) , width(crop) , height(crop) 
                    this.constants.SIZE_ASSETS,this.coinImg.height,
                    parseInt(element.hitbox.x-element.xOffset)-xLvlOffset,
                    parseInt(element.hitbox.y-element.yOffset),
                    this.constants.COIN_WIDTH,this.constants.COIN_HEIGHT)
            }
        });
    }
    drawBox(c,xLvlOffset){
        this.boxes.forEach(element => {
            if(element.active){
                element.drawHitbox(c, xLvlOffset);
                c.drawImage(this.boxImg,
                    element.aniIndex,0,           //cord X(crop) , cordY(crop) , width(crop) , height(crop) 
                    this.constants.SIZE_ASSETS,this.boxImg.height,
                    parseInt(element.hitbox.x+element.xOffset)-xLvlOffset,
                    parseInt(element.hitbox.y),
                    this.constants.BOX_WIDTH,this.constants.BOX_HEIGHT)
            }
        });
    }

    resetAllObj() {
        this.coins.forEach(element => {
            element.reset();
        });

        this.boxes.forEach(element => {
            element.reset();
        });
    }
}

class Object{
    constructor(x,y,objType){
        this.x=x
        this.y=y
        this.objType=objType
        this.aniIndex=0
        this.aniTick=0
        this.xOffset=0
        this.yOffset=0
        this.aniSpeed=15
        this.doAnimation=false
        this.active=true
        this.constants= new Constants()
    }

    updateAnimationTick(){
        this.aniTick++;
        if(this.aniTick>=this.aniSpeed){
            this.aniTick=0;
            this.aniIndex++;
            if(this.aniIndex>=this.getSpriteAmount()){
                this.aniIndex=0;
                if(this.objType==BOX){
                    
                    this.doAnimation=false;
                    this.active=false;
                    this.aniIndex=this.getSpriteAmount()-1;
                }
            }
                
        }
    }

    iniHitbox(w, h) {
        this.hitbox = new Hitbox(this.x,this.y,w,h);
    }
    drawHitbox(c, xlvlOffset) {	
        c.strokeRect(this.hitbox.x-xlvlOffset,this.hitbox.y,this.hitbox.width,this.hitbox.height)
    }

    reset(){
        this.aniIndex=0;
        this.aniTick=0;
        this.active=true;
        
        if(this.objType==BOX)
            this.doAnimation=false;
        else 
            this.doAnimation=true;
       
    }

    getSpriteAmount(){
        switch (this.objType) {
            case BOX:
                return 5;
            case COIN:
                return 5;
        }
        return 1;
    }
}

export class Box extends Object{
    constructor(x,y,objType){
        super(x, y, objType);
        this.iniHitbox(this.constants.BOX_WIDTH,this.constants.BOX_HEIGHT);
        this.xOffset= 1;
        this.yOffset=-40;
        this.hitbox.y-= this.yOffset;
        this.hitbox.x-= this.xOffset;
    }
    update(){
        if(this.doAnimation)
            this.updateAnimationTick();
    }
}

export class Coins extends Object{
    constructor( x,  y,  objType) {
        super(x, y, objType);
        this.doAnimation=true;
        this.iniHitbox(this.constants.COIN_WIDTH, this.constants.COIN_HEIGHT);
        this.xOffset= 0;
        this.yOffset= 0;
    }
    
    update(){
        updateAnimationTick();
    }
}