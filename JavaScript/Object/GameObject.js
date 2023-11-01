class GameObject{
    constructor({position,width,height,code}){
        this.image=new Image()
        this.position=position
        this.height=height
        this.width=width
        this.code=code
        this.active=true
        this.hitbox={
            position: {
                x:this.position.x,
                y:this.position.y,
            },
            width:width,
            height:height,
        }
        switch (code) {
            case 1:
                this.image.src='/src/img/LV_1/box.png'
                break;
        
            default:
                break;
        }
    }

    update(xLvlOffset){
        this.draw(xLvlOffset)
    }

    draw(xLvlOffset){
        if(!this.image || !this.active) return

        // // draws out the image
        // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // c.fillRect(this.position.x-xLvlOffset, this.position.y, this.width, this.height)

        let yOffset=this.image.height-this.height+12
        c.drawImage(
            this.image,
            this.position.x-xLvlOffset,
            this.position.y+yOffset,
            this.width,
            this.height)
    }
}