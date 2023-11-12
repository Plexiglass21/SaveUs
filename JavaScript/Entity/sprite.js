class Sprite{
    constructor({position,src,frameRate=1,frameBuffer=10}){
        this.position=position
        this.loaded=false
        this.image=new Image()
        //dopo aver caricato l'img
        this.image.onload=()=>{
            this.width=TileWidth*1.5
            this.height=TileHeight*1.5
            this.loaded=true
        }
        this.image.src=src
        this.frameRate=frameRate    //numero sprite
        this.currentFrame=0
        this.frameBuffer=frameBuffer    //valore per rallentamento animazione
        this.elapsedframe=0             //tile trascorsi
        this.lastDir='right'            
        this.hp=100
    }

    draw(xLvlOffset){
        if(!this.image) return

        //oggeto che ritaglia lo sprite del player per disegnare un'immagine più piccola
        const cropBox = {
            position: {
                x:this.currentFrame * (this.image.width/this.frameRate),
                y:0,
            },
            width:this.image.width/this.frameRate,
            height:this.image.height,
        }

        if(this.lastDir==='right'){
            c.drawImage(
                this.image,
                cropBox.position.x,
                cropBox.position.y,
                cropBox.width,
                cropBox.height,
                this.position.x-xLvlOffset,
                this.position.y-10,
                this.width,
                this.height)
        }else if(this.lastDir==='left'){
            c.save();
            c.scale(-1, 1);
            c.drawImage(
                this.image,
                cropBox.position.x,
                cropBox.position.y,
                cropBox.width,
                cropBox.height,
                -this.position.x-this.width+xLvlOffset,
                this.position.y-10,
                this.width,
                this.height)
            c.restore();
        }

        //scrittura hp
        if(this.hp<0)this.hp=0
        c.font='50px serif'
        c.fillText('HP: ' +this.hp,10,50)
        
    }

    update(){
        this.draw()
        this.updateFrames()
    }

    updateFrames(){
        this.elapsedframe++

        if(this.elapsedframe%this.frameBuffer===0)
        if(this.currentFrame<this.frameRate-1) this.currentFrame++
        else this.currentFrame=0
    }
}