class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('ball', 'shinyball.png');
    }

    create ()
    {
        this.matter.world.setBounds();

        //  Our two bodies which will be connected by a constraint (aka a Joint or a Spring)

        this.lizardHead = this.matter.add.image(420, 100, 'ball', null, { shape: 'circle', friction: 0.01, restitution: 0.6 });
        this.lizardTail = this.matter.add.image(400, 200, 'ball', null, { shape: 'circle', friction: 0.01, restitution: 0.6 });

        //  You can create a constraint between the two bodies using a Factory function.
        //  The value 100 is the resting length and 0.2 is the stiffness of the constraint.

        this.matter.add.constraint(this.lizardHead, this.lizardTail, 100, 0.2);
        this.matter.add.mouseSpring();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.moveLizard = (x,y) => {
            const force = 0.005;
            const tailForce = 0.001;
            
            this.lizardHead.applyForce(new Phaser.Math.Vector2(x*force,y*force));
            this.lizardTail.applyForce(new Phaser.Math.Vector2(x*tailForce,y*tailForce));
            

            console.log(this.lizardHead.rotation)
        }

    }
    update()
    {
       if(this.cursors.left.isDown){
            this.moveLizard(-1,0);
       } else if (this.cursors.right.isDown){
            this.moveLizard(1,0);
       } else if (this.cursors.down.isDown){
        this.moveLizard(0,1);
       } else if (this.cursors.up.isDown){
        this.moveLizard(0,-1);
       }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'game',
    physics: {
        default: 'matter' ,
        matter:{
            gravity:{
                y: 1
            }
        }  
    },
    scene: Example
};

const game = new Phaser.Game(config);
