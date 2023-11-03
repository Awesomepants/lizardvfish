class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.image('lizardHead', '/assets/lizardHead.png');
        this.load.image('lizardTail', '/assets/lizardTail.png');
        this.load.aseprite('bodySegment','/assets/sprites/bodysegment.png','/assets/sprites/bodysegment.json');
    }

    create ()
    {
        this.matter.world.setBounds();

        //  Our two bodies which will be connected by a constraint (aka a Joint or a Spring)
        createLizard(this);
       
        this.cursors = this.input.keyboard.createCursorKeys();
        

    }
    update()
    {   
        updateLizard(this);
        
        this.lizardHead.isMoving = false; //If the lizard actually is moving, this will be overridden, then the value will be used to evaluate whether or not to play the idling animation in the next frame
        //keyboard controls
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
       //gamepad controls
       if (this.input.gamepad.total === 0)
        {
            return;
        }

        const pad = this.input.gamepad.getPad(0);

        if (pad.axes.length)
        {
            const axisH = pad.axes[0].getValue();
            const axisV = pad.axes[1].getValue();
            if(axisH || axisV){
                this.moveLizard(axisH,axisV);
            }
            
        }
        
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#EEEEEE',
    parent: 'game',
    pixelArt:true,
    physics: {
        default: 'matter' ,
        matter:{
            gravity:{
                y: 0.1
            },
            debug: false
        }  
    },
    input: {
        gamepad: true
    },
    scene: Example
};

const game = new Phaser.Game(config);
