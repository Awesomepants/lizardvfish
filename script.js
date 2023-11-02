class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('lizardHead', 'assets/lizardHead.png');
        this.load.image('lizardTail', 'assets/lizardTail.png');
    }

    create ()
    {
        this.matter.world.setBounds();

        //  Our two bodies which will be connected by a constraint (aka a Joint or a Spring)
        
        this.lizardHead = this.matter.add.image(420, 100, 'lizardHead', null, { shape: 'circle', friction: 0, restitution: 0.6 });
        this.lizardTail = this.matter.add.image(400, 200, 'lizardTail', null, { shape: 'circle', friction: 0, restitution: 0.6 });
        this.lizardHead.setFrictionAir(0.1);
        this.lizardTail.setFrictionAir(0.2);
        this.lizardHead.body.label = "lizardHead";
        //  You can create a constraint between the two bodies using a Factory function.
        //  The value 100 is the resting length and 0.2 is the stiffness of the constraint.

        this.matter.add.constraint(this.lizardHead, this.lizardTail, 40, 0.2);
        this.matter.add.mouseSpring();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.moveLizard = (x,y) => {
            let force = 0.002;
            let tailForce = 0;
            if(this.lizardHead.sticking){
                force = 0.009;
            }
            this.lizardHead.applyForce(new Phaser.Math.Vector2(x*force,y*force));
            this.lizardTail.applyForce(new Phaser.Math.Vector2(x*tailForce,y*tailForce));
            let lizardVelocity = this.lizardHead.getVelocity();
            let lizardAngle = Math.atan2(lizardVelocity.y, lizardVelocity.x);
            this.lizardHead.setAngle(lizardAngle);
            
        }
        
        this.matter.world.on("collisionend",(e,o1,o2) => {
            if(o1.label === "lizardHead" || o2.label === "lizardHead"){
                console.log("lizardHead lifted");
                this.lizardHead.sticking = false;
            }
        })
        this.matter.world.on("collisionactive",(e,o1,o2) => {
            if(o1.label === "lizardHead" || o2.label === "lizardHead"){
                console.log("lizardHead is touching");
                const collisionNormal = e.pairs[0].collision.normal;
                const stickingAmount = 0.5;
                const stickingVector = new Phaser.Math.Vector2(collisionNormal.x * stickingAmount, collisionNormal.y * stickingAmount);
                this.lizardHead.applyForce(stickingVector);
                this.lizardTail.applyForce(stickingVector);
                console.log(stickingVector);
                this.lizardTail
                this.lizardHead.sticking = true;
            }
        })

    }
    update()
    {   
        
       if(this.cursors.left.isDown){
            this.moveLizard(-1,0);
       } else if (this.cursors.right.isDown){
            this.moveLizard(1,0);
       } 
       if (this.cursors.down.isDown){
        this.moveLizard(0,1);
       } else if (this.cursors.up.isDown){
        this.moveLizard(0,-1);
       }
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#EEEEEE',
    parent: 'game',
    physics: {
        default: 'matter' ,
        matter:{
            gravity:{
                y: 0.5
            }
        }  
    },
    scene: Example
};

const game = new Phaser.Game(config);
