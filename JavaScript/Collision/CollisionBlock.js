class CollisonBlock{
    constructor({position,height,width,type}){
        this.position=position
        this.width=width
        this.height=height
        this.type=type
        this.img=new Image()
        this.setAssets()
    }

    setAssets(){
        switch (this.type) {
            case 1:
                this.img.src='/src/img/LV_1/ground_Concrete.png'
                break;
            case 2:
                this.img.src='/src/img/LV_1/groundPiastrelle.png'
                break;
        }
    }

    draw(xLvlOffset){
        c.drawImage(
            this.img,
            this.position.x-xLvlOffset,
            this.position.y,
            this.width,
            this.height)
    }

}