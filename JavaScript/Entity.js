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
    constructor(x,y,w,h){
        this.x=x
        this.y=y
        this.width=w
        this.height=h
    }

    initHitbox(w,h){
        this.hitbox = new Hitbox(this.x,this.y,w,h);
    }
    drawHitbox(c){
        c.strokeStyle = "red";
        c.strokeRect(this.hitbox.x,this.hitbox.y,this.hitbox.width,this.hitbox.height)
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
let index=0
let tick=0
export class Player extends Entity{
    constructor(canvas,x,y,w,h){
        super(x,y,w,h)
        this.vel=0
        this.walkSpeed=20
        this.jumpSpeed=-30

        this.inAir=true
        this.moving=false

        this.canvas=canvas

        this.initHitbox(this.width,this.height)
        this.caricaAssets()
        this.activeImg=this.idleImg
    }

    caricaAssets() {
        this.runImg= new Image()
        this.idleImg= new Image()
        this.jumpImg= new Image()
        //this.fallImg= new Image()
        this.runImg.src="/src/img/Run.png"
        this.idleImg.src="/src/img/Idle.png"
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
    
    draw(c){
        c.clearRect(0,0,this.canvas.width,this.canvas.height)
        if (keys.left.pressed) {
            // Rifletti l'immagine orizzontalmente
            c.save();
            c.scale(-1, 1);
            c.drawImage(this.activeImg , index , 0 , 160 , this.activeImg.height , -this.hitbox.x - this.hitbox.width, this.hitbox.y, this.width, this.height);
            c.restore();
        } else {
           c.drawImage(this.activeImg , index , 0 , 160 , this.activeImg.height , this.hitbox.x, this.hitbox.y-180 , this.width*2.2, this.height*2.2)    //cord X(crop) , cordY(crop) , width(crop) , height(crop)  
        }
        this.drawHitbox(c)        
    }

    update(){
        this.updatePos()
        this.updateIndex() 
        this.setAni()    
    }

    updatePos(){
        this.hitbox.y += this.vel
        this.vel += gravity
        if (this.hitbox.y + this.hitbox.height >= this.canvas.height-this.hitbox.height*1.4){
            this.inAir=false
            this.vel=0
        } 

        if(keys.jump.pressed){
            this.jump()
            keys.jump.pressed=false
        }   
        if(keys.right.pressed)  this.hitbox.x+=this.walkSpeed
        if(keys.left.pressed)   this.hitbox.x-=this.walkSpeed
        
        keys.jump.pressed=false
    }
    updateIndex(){
        tick++
        if(tick>=5){
            tick=0
            index+=160
            if(index>=this.activeImg.width)index=0
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
            tick=0
            index=0 
        }
            
    }


    jump(){ 
        if(this.inAir) return
        
        this.inAir=true
        this.vel=this.jumpSpeed
    }
}

export class EnemyManager{
    constructor(tileSize){
        this.TILE_SIZE=tileSize
    }
}

class Enemy extends Entity {
    constructor(){

        
    }
}