class Example extends Phaser.Scene
{
    preload ()
    {
        this.load.aseprite('bodySegment','assets/sprites/bodysegment.png','assets/sprites/bodysegment.json');
        this.load.tilemapTiledJSON("sampleMap","assets/maps/prototype.tmj");
        this.load.image("AquaTile","assets/sampleTile.png");
        this.load.aseprite('head','assets/sprites/head.png','assets/sprites/head.json');
        this.load.aseprite('legs','assets/sprites/legs.png','assets/sprites/legs.json');
        this.load.aseprite('pirahna','assets/sprites/Pirahna.png','assets/sprites/Pirahna.json')
    }

    create ()
    {
        
        const map = this.make.tilemap({ key: "sampleMap"});
        const tileset = map.addTilesetImage("AquaTile");
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true }).setPipeline('Light2D');
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
        //this.lights.setAmbientColor(0x090f33);
        this.matter.world.convertTilemapLayer(groundLayer);


        //We tried making the lizard a custom class that extended Matter.Sprite, but we got all kinds of errors for some reason so instead we made a function that creates the lizard and returns it (no issue with this)
        this.lizardHead = createLizard(this, 300, 50);
        this.lizardLight = this.lights.addLight(0,0,400).setIntensity(5);
        createPirahna(this, 400,20);
       
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.lizardHead, true, 0.07, 0.07);
        this.input.gamepad.on("down",(pad,button,value)=>{
            this.lizardHead.attack();
        })
        document.getElementById('fullScreenButton').addEventListener('click',()=>{
            this.scale.startFullScreen();
        })
    }
    update()
    { 
        this.lizardLight.x = this.lizardHead.x;
        this.lizardLight.y = this.lizardHead.y;
        document.getElementById("fpsmeter").innerHTML = `FPS: ${this.sys.game.loop.actualFps} LizardSticking: ${this.lizardHead.sticking.isSticking}`;
       
        //keyboard controls
       if(this.cursors.space.isDown){
        this.lizardHead.attack();
       }
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
    scale: {
        mode:Phaser.Scale.FIT,
        parent:'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    
    backgroundColor: '#090f33',
    parent: 'game',
    pixelArt:true,
    physics: {
        default: 'matter' ,
        matter:{
            gravity:{
                y: 0.5
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
