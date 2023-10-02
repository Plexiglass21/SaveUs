
import { Enemy } from "./Entity.js"
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
    constructor(tileSize){
        this.TILE_SIZE=tileSize
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
                this.app.src="/src/img/groundPiastrelle.png"
                let app1= new Image()
                let app2= new Image()
                let app3= new Image()
                let app4= new Image()
                app1.src="/src/img/window.png"
                app2.src="/src/img/radiator.png"
                app3.src="/src/img/ground_concrete.png"
                app4.src="/src/img/muro_empty.png"

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
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,9,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
        ]
        return codes
    }

    draw(c){
        
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 15; j++) {

                let index= this.currentLvl.getSpriteIndex(i,j)-1
                if(index>=0&& index<6) c.drawImage(this.arrayAssets[index],this.TILE_SIZE*j,this.TILE_SIZE*i,this.TILE_SIZE,this.TILE_SIZE)
            }
        }
        
    }
    
    getEnemy1(){
        let list=new Array()
        for (let i = 0; i < this.lvlCodes.length; i++)
                for (let j = 0; j < this.lvlCodes[i].length; j++) {
                    if (this.lvlCodes[i][j] == 9){
                        list.push(new Enemy(j * this.TILE_SIZE, i * this.TILE_SIZE,100,100,this,"Covid"))
                    }
                }
        return list
    }
}