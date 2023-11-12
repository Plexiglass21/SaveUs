class Enemy extends Sprite{
    constructor({position,width,height, collisionBlocks,platformCollisionBlocks,objectBlocks,src,type}){
        super({src})
        this.position=position
        this.velocity = {
            x:0,
            y:1
        }
        this.height=height
        this.width=width
        this.collisionBlocks=collisionBlocks
        this.platformCollisionBlocks=platformCollisionBlocks
        this.objectBlocks=objectBlocks
        this.type=type      //identifica il tipo di enemy
        this.active=true    //true: esiste
        this.state='idle'   //stati: idle,run,attack....
        this.hitbox={
            position: {
                x:this.position.x,
                y:this.position.y,
            },
            width:50,
            height:50,
        }

        //popola l'array animation(classe Sprite) con le immagini che sono arrivate in input
        for(let key in this.animations){
            const image= new Image()
            image.src=this.animations[key].src
            this.animations[key].image = image
        }
    }

    //gestione cambio sprite
    switchSprite(key){
        if(this.image===this.animations[key].image || !this.loaded) return

        this.currentFrame=0 
        this.image= this.animations[key].image
        this.frameBuffer=this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    //controlli e disegno
    update(xLvlOffset){
        this.updateFrames()

        this.draw(xLvlOffset)
        this.position.x+=this.velocity.x
        this.updateHitbox()
        this.checkForHorizzontalCollision()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollision()
        this.updateBehavior()
        
    }

    draw(xLvlOffset){
        
        if(!this.image || !this.active) return
        
        // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // c.fillRect(this.position.x-xLvlOffset, this.position.y, this.width, this.height)
        
        c.fillStyle='black'
        c.strokeRect(this.hitbox.position.x-xLvlOffset,this.hitbox.position.y,this.hitbox.width,this.hitbox.height)
        
        const cropBox = {
            position: {
                x:this.currentFrame * (this.image.width/this.frameRate),
                y:0,
            },
            width:this.image.width/this.frameRate,
            height:this.image.height,
        }
        c.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x-xLvlOffset-25,
            this.position.y,
            this.width,
            this.height)
        
    }

    //controllo collisioni orizzontali
    checkForHorizzontalCollision(){

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i];
            if (collision({
                object1:this.hitbox,
                object2:block,
                })
            ){
                if(this.velocity.x>0){
                    this.velocity.x=0
                    let offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x= block.position.x-offset - 0.01
                    break
                } 

                if(this.velocity.x<0){
                    this.velocity.x=0
                    let offset = this.hitbox.position.x - this.position.x 
                    
                    this.position.x= block.position.x+block.width-offset + 0.01
                    break
                } 
            }
        }

        //object
        for (let i = 0; i < this.objectBlocks.length; i++) {
            const block = this.objectBlocks[i];
            let objOffset=block.image.height-block.height+12
            if (objCollisions({
                object1:this.hitbox,
                object2:block,
                offset:objOffset,
                })
            ){
                if(this.velocity.x>0){
                    this.velocity.x=0
                    let offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x= block.position.x-offset - 0.01
                    break
                } 

                if(this.velocity.x<0){
                    this.velocity.x=0
                    let offset = this.hitbox.position.x - this.position.x 
                    
                    this.position.x= block.position.x+block.width-offset + 0.01
                    break
                } 
            }
        }
    }

    //modifica la cordinata y con la gravità
    applyGravity(){
        this.velocity.y+=gravity
        this.position.y+=this.velocity.y
    }

    //controllo collisioni verticali
    checkForVerticalCollision(){
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i];
            if (collision({
                object1:this.hitbox,
                object2:block,
                })
            ){
                if(this.velocity.y>0){
                    this.velocity.y=0
                    let offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y= block.position.y-offset - 0.01
                    break
                } 

                if(this.velocity.y<0){
                    this.velocity.y=0
                    let offset = this.hitbox.position.y - this.position.y

                    this.position.y= block.position.y+block.height -offset + 0.01
                    break
                } 
            }
        }

        //platform
        
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const block = this.platformCollisionBlocks[i];
            if (platformCollisions({
                object1:this.hitbox,
                object2:block,
                })
            ){
                if(this.velocity.y>0){
                    this.velocity.y=0
                    let offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y= block.position.y-offset - 0.01
                    break
                } 
            }
        }

        //object
        
        for (let i = 0; i < this.objectBlocks.length; i++) {
            const block = this.objectBlocks[i];
            let objOffset=block.image.height-block.height+12
            if(block.active){
                if (objCollisions({
                    object1:this.hitbox,
                    object2:block,
                    offset:objOffset,
                    })
                ){
                    if(this.velocity.y>0){
                        block.active=false
                        this.velocity.y=-100
                    } 
    
                    if(this.velocity.y<0){
                        this.velocity.y=0
                        let offset = this.hitbox.position.y - this.position.y
    
                        this.position.y= block.position.y+block.height -offset + 0.01
                        break
                    } 
                }
            }
        }
        
    }

}

