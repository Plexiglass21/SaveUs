import { Constants } from "./game.js"
import { Enemy,Covid } from "./Entity.js"
import { Coins,Box } from "./Objects.js"
class Level{
    constructor(lvlCodes, index ){
        this.lvlCodes=lvlCodes  //how to build the level
        this.index=index        //number of level
    }
    getSpriteIndex(x,y){
        return this.lvlCodes[x][y]
    }
}
export class LevelsManager{
    constructor(){
        this.constants= new Constants()
        this.loadAssets()
    }

    loadAssets(){
        this.app= new Image()
        this.app.src=""
        this.arrayAssets=new Array()
    }

    setLevel(index){
        switch (index) {
            case 1:
                this.app.src="/src/img/LV_1/groundPiastrelle.png"
                let app1= new Image()
                let app2= new Image()
                let app3= new Image()
                let app4= new Image()
                app1.src="/src/img/LV_1/window_right.png"
                app2.src="/src/img/LV_1/radiator.png"
                app3.src="/src/img/LV_1/ground_concrete.png"
                app4.src="/src/img/LV_1/muro_empty.png"

                this.arrayAssets.push(this.app)
                this.arrayAssets.push(app1)
                this.arrayAssets.push(app2)
                this.arrayAssets.push(app3)
                this.arrayAssets.push(app4)
                break;
            case 2:
                
                break;
            case 3:
                
                break;
            case 4:
                
                break;
            case 5:
                
                break;
        }
        this.currentLvl= new Level(this.generateCodes(),index)
        this.lvlCodes=this.currentLvl.lvlCodes

    }

    generateCodes(){
        let codes=[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,7,0,1,0,0,8,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
        ]
        return codes
    }

    draw(c,xLvlOffset){
        for (let i = 0; i < this.constants.TILES_GAME_HEIGHT; i++) {
            for (let j = 0; j < this.constants.TILES_GAME_WIDTH; j++) {
                let index= this.currentLvl.getSpriteIndex(i,j)-1
                if(index>=0&& index<6) c.drawImage(this.arrayAssets[index],
                                                    this.constants.TILE_SIZE_WIDTH*j-xLvlOffset,
                                                    this.constants.TILE_SIZE_HEIGHT*i,
                                                    this.constants.TILE_SIZE_WIDTH,
                                                    this.constants.TILE_SIZE_HEIGHT)
            }
        }
        
    }
    
    getEnemy1(){
        let list=new Array()
        for (let i = 0; i < this.lvlCodes.length; i++)
                for (let j = 0; j < this.lvlCodes[i].length; j++) {
                    if (this.lvlCodes[i][j] == 9){
                        list.push(new Covid (j * this.constants.TILE_SIZE_WIDTH, i * this.constants.TILE_SIZE_HEIGHT,this))
                    }
                }
        return list
    }

    getCoins(){
        let list=new Array()
        for (let i = 0; i < this.lvlCodes.length; i++)
                for (let j = 0; j < this.lvlCodes[i].length; j++) {
                    if (this.lvlCodes[i][j] == this.constants.COIN){
                        list.push(new Coins(j * this.constants.TILE_SIZE_WIDTH, i * this.constants.TILE_SIZE_HEIGHT,1))
                    }
                }
        return list
    }
    getBoxes(){
        let list=new Array()
        for (let i = 0; i < this.lvlCodes.length; i++)
                for (let j = 0; j < this.lvlCodes[i].length; j++) {
                    if (this.lvlCodes[i][j] == this.constants.BOX){
                        list.push(new Box(j * this.constants.TILE_SIZE_WIDTH, i * this.constants.TILE_SIZE_HEIGHT,2))
                    }
                }
        return list
    }
}