class Covid extends Enemy{
    constructor({position, collisionBlocks,platformCollisionBlocks,objectBlocks,src,type}){
        super({position, collisionBlocks,platformCollisionBlocks,objectBlocks,src,type})
        this.frameRate=8
        this.frameBuffer=18
        this.width=60
        this.dir=1
        this.animations={
            Idle:{
                src:'/src/img/idle-19.png',
                frameRate:8,
                frameBuffer:12,
            }
        }
        this.walkSpeed=2
    }

    updateBehavior(){

        switch (this.state) {
            case 'idle':
                this.state='run'
                break;
            case 'run':
                if (this.canSeePlayer()) {
                    const distanceToPlayer = player.position.x - this.position.x 
                    this.velocity.x = (distanceToPlayer > 0) ? this.walkSpeed : -this.walkSpeed
                }
                break
            case 'attack':
                break;
        }
    }

    checkForHorizzontalCollision(){
        if (this.hitbox.position.x<0){
            this.velocity.x=0
            this.dir=1
        } 

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i];
            if (collision({
                object1:this.hitbox,
                object2:block,
                })
            ){
                //destra
                if(this.velocity.x>0){
                    let offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x= block.position.x-offset - 0.01
                    this.dir=-1
                    break
                } 

                //sinistra
                if(this.velocity.x<0){
                    let offset = this.hitbox.position.x - this.position.x 
                    
                    this.position.x= block.position.x+block.width-offset + 0.01
                    this.dir=1
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
                    this.dir=-1
                    break
                } 

                if(this.velocity.x<0){
                    this.velocity.x=0
                    let offset = this.hitbox.position.x - this.position.x 
                    
                    this.position.x= block.position.x+block.width-offset + 0.01
                    this.dir=1
                    break
                } 
            }
        }
    }

    canSeePlayer(){
        let absX=Math.abs( (player.position.x/TileWidth) - (this.position.x/TileWidth) )
        let absY=Math.abs( (player.position.y/TileWidth) - (this.position.y/TileWidth) )
        if(absY>=3) return false
        return absX<=5
    }

    updateHitbox(){
        this.hitbox={
            position: {
                x:this.position.x+40,
                y:this.position.y+70,
            },
            width:45,
            height:65,
        }
    }
}