class Player extends Sprite{
    constructor({position, collisionBlocks,platformCollisionBlocks,objectBlocks,enemyBlock,src,frameRate,frameBuffer,animations}){  
        super({src,frameRate,frameBuffer})
        this.position=position
        this.velocity = {
            x:0,
            y:1
        }
        this.height=TileHeight*1.5
        this.width=TileInWidth*1.5
        this.collisionBlocks=collisionBlocks
        this.platformCollisionBlocks=platformCollisionBlocks
        this.objectBlocks=objectBlocks
        this.enemyBlock=enemyBlock
        this.die=false
        this.hitbox={
            position: {
                x:this.position.x,
                y:this.position.y,
            },
            width:100,
            height:100,
        }

        this.animations=animations

        for(let key in animations){
            const image= new Image()
            image.src=this.animations[key].src
            this.animations[key].image= image
        }

        this.walkSpeed=5
        this.xOffsetHitBox=45
        this.yOffsetHitBox=13
        this.hitboxWidth=100
        this.hitboxHeight=150
    }

    //gestione cambio sprite
    switchSprite(key){

        if(this.image===this.animations[key].image || !this.loaded) return

        this.currentFrame=0 
        this.image= this.animations[key].image
        this.frameBuffer=this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    update(xLvlOffset){
        
        this.updateFrames()
        c.fillStyle = 'rgba(0, 0, 255, 0.2)'

        // // draws out the image
        // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // c.fillRect(this.position.x-xLvlOffset, this.position.y, this.width, this.height)


        c.fillStyle='black'
        c.strokeRect(this.hitbox.position.x-xLvlOffset,this.hitbox.position.y,this.hitbox.width,this.hitbox.height)

        this.draw(xLvlOffset)
        this.position.x+=this.velocity.x
        this.updateHitbox()
        this.checkForHorizzontalCollision()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollision()
        
    }

    updateHitbox(){
        this.hitbox={
            position: {
                x:this.position.x+this.xOffsetHitBox,
                y:this.position.y+this.yOffsetHitBox,
            },
            width:this.hitboxWidth,
            height:this.hitboxHeight,
        }
    }

    //controllo collisioni orizzonatali
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

                else if(this.velocity.x<0){
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
            
            if (objCollisions({ object1:this.hitbox, object2:block, offset:objOffset,})){
                if(block.code===1){
                    if(this.velocity.x>0){
                        this.velocity.x=0
                        let offset = this.hitbox.position.x - this.position.x + this.hitbox.width
    
                        this.position.x= block.position.x-offset - 0.01
                        break
                    } 
    
                    else if(this.velocity.x<0){
                        this.velocity.x=0
                        let offset = this.hitbox.position.x - this.position.x 
                        
                        this.position.x= block.position.x+block.width-offset + 0.01
                        break
                    } 
                }
            }
        }

        //enemy
        for (let i = 0; i < this.enemyBlock.length; i++) {
            const block = this.enemyBlock[i];
            if (enemyCollisions({player:this.hitbox, enemy:block,}))
                this.playerHitted(block)
            
        }
    }

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
                else if(this.velocity.y<0){

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
                if (objCollisions({
                    object1:this.hitbox,
                    object2:block,
                    offset:objOffset,}
                    )){
                        if (block.code===1) {
                            if(this.velocity.y>0 ){
                                this.bounce()
                                block.active=false
                            }
                            else if(this.velocity.y<0){
                                this.velocity.y=0
                                let offset = this.hitbox.position.y - this.position.y
        
                                this.position.y= block.position.y+block.height -offset + 0.01
                                break
                            }   
                        }
                }
        }

        //enemy
        for (let i = 0; i < this.enemyBlock.length; i++) {
            const block = this.enemyBlock[i];
            let objOffset=block.image.height-block.height+12
                if (enemyCollisions({
                    player:this.hitbox,
                    enemy:block,
                    }
                    )){
                        
                    if(this.velocity.y>0 ){
                        this.bounce()
                        block.active=false
                    }
                }
        }
    }

    //modifica la cordinata y per creare un leggero salto
    bounce(){
        this.velocity.y=-jumpPlayer/1.2
    }

    //gestisce l'evento "colpito" del player
    playerHitted(enemy){
        switch (enemy.type) {
            case 'covid':
                this.hp-=10
                break;
        }

        if(this.hp<=0){
            this.die=true
            this.switchSprite('Death')
        }
    }
}