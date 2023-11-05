class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.aseprite('bodySegment','assets/sprites/bodysegment.png','assets/sprites/bodysegment.json');
        this.load.tilemapTiledJSON("sampleMap","assets/maps/prototype.tmj");
        this.load.image("AquaTile","assets/sampleTile.png");
    }

    create ()
    {
        //this.matter.world.setBounds();
        const map = this.make.tilemap({ key: "sampleMap"});
        const tileset = map.addTilesetImage("AquaTile");
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(groundLayer);
        //We tried making the lizard a custom class that extended Matter.Sprite, but we got all kinds of errors for some reason so instead we made a function that creates the lizard and returns it (no issue with this)
        this.lizardHead = createLizard(this, 300, 50);
       
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.lizardHead);
        

    }
    update()
    { 
        document.getElementById("fpsmeter").innerHTML = `FPS: ${this.sys.game.loop.actualFps}`;
        //overriding the preUpdate function was a bad idea, so instead the Lizard has a custom function that we call every time the scene updates
        this.lizardHead.update();
        
        this.lizardHead.isMoving = false; //If the lizard actually is moving, this will be overridden, then the value will be used to evaluate whether or not to play the idling animation in the next frame
        //keyboard controls
       if(this.cursors.left.isDown){
            this.lizardHead.moveLizard(-1,0);
       } else if (this.cursors.right.isDown){
            this.lizardHead.moveLizard(1,0);
       } 
       if (this.cursors.down.isDown){
        this.lizardHead.moveLizard(0,1);
       } else if (this.cursors.up.isDown){
        this.lizardHead.moveLizard(0,-1);
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
                this.lizardHead.moveLizard(axisH,axisV);
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
