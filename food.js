class Food{

    constructor(x,y,type){
        this.pos = createVector(x,y);
        this.r = 3;
        this.type = type;

    }

    show(){
        if(this.type == "good"){
            stroke(0,150,0)
            fill(0,128,0);
        }
        else if(this.type == "bad"){
            stroke(150,0,0);
            fill(128,0,0);
        }
        ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
    }
}