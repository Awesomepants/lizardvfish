class Example extends Phaser.Scene
{   constructor(){
    super('levelGenerator')
}
    init (data){
        this.map = data.map;
        if(!this.map){
            this.map = "Level1";
        }
    }
    preload ()
    {
        this.load.aseprite('bodySegment','assets/sprites/bodysegment.png','assets/sprites/bodysegment.json');
        this.load.tilemapTiledJSON("Level1","assets/maps/Level1.tmj");
        this.load.tilemapTiledJSON("Level2","assets/maps/Level2.tmj");
        this.load.image("AquaTile","assets/StaticImages/tilesheet.png");
        this.load.aseprite('head','assets/sprites/head.png','assets/sprites/head.json');
        this.load.aseprite('legs','assets/sprites/legs.png','assets/sprites/legs.json');
        this.load.aseprite('pirahna','assets/sprites/Pirahna.png','assets/sprites/Pirahna.json');
        this.load.aseprite('spikePirahna','assets/sprites/spikePirahna.png','assets/sprites/spikePirahna.json');
        this.load.aseprite('multiPirahna','assets/sprites/multiPirahna.png','assets/sprites/multiPirahna.json');
        this.load.image('Background','assets/waterBG.png');
        this.load.image("spike","assets/sprites/spike.png");
        this.load.aseprite('urchin',"assets/sprites/urchin.png","assets/sprites/urchin.json");
        this.load.aseprite('lever',"assets/sprites/lever.png","assets/sprites/lever.json");
        this.load.aseprite('door',"assets/sprites/door.png","assets/sprites/door.json");
        this.load.image("bubble","assets/StaticImages/o2bubble.png");
    }

    create ()
    {
        this.add.image(620,400,"Background").setScrollFactor(0.01,0.01).setPipeline('Light2D').setScale(1.4);
        //this.lights.enable();
        this.emitter = new Phaser.Events.EventEmitter();
        this.emitter.on("lizardDeath", ()=>{
            setTimeout(()=>{
                this.scene.start("levelGenerator",{map:this.map});
            }, 3000)
            
        })
        this.raycaster = this.raycasterPlugin.createRaycaster({debug:false});
        this.heroRaycaster = this.raycasterPlugin.createRaycaster({debug:false})
        const map = this.make.tilemap({ key: this.map});
        const tileset = map.addTilesetImage("AquaTile");
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true }).setPipeline('Light2D');
        this.lights.setAmbientColor(0x070918);
        this.raycaster.mapGameObjects(groundLayer,false,{
            collisionTiles: [...Array(64).keys()]
        })
        this.matter.world.convertTilemapLayer(groundLayer);

        const lizardCoords = {x:0, y:0}
        map.objects[0].objects.forEach((object)=> {
            //extrapolate the weird array of properties on this object and convert it to more accessible properties on the object itself
            if(object.properties){
                object.properties.forEach((property) => {
                object[property.name] = property.value;
            })
            }
            console.log(object);
            switch(object.name){
                case "Lizard":
                lizardCoords.x = object.x,
                lizardCoords.y = object.y;
                break;
                case "Pirahna":
                    createPirahna(this, object.x,object.y,object.properties[0].value);
                    break;
                case "spikePirahna":
                    createPirahna(this, object.x, object.y, object.rotation, {type: "spikePirahna"});
                    break;
                case "multiPirahna":
                    createPirahna(this, object.x, object.y, object.rotation, {type: "multiPirahna"});
                    break;
                case "Urchin":
                    const urchin = this.matter.add.sprite(object.x,object.y,"urchin",0,{isStatic: true, shape: "circle",circleRadius: 10,restitution:"40",onCollideCallback: provideDamage});
                    urchin.anims.createFromAseprite("urchin");
                    urchin.anims.play({key: "Idle", repeat: -1});
                    this.lights.addLight(object.x,object.y,128,0xbf0b0b,6);
                    break;
                case "Lever":
                    createLever(this, object.x,object.y,object.id,object.rotation);
                    break;
                case "Door":
                    createDoor(this, object.x + 16,object.y + 16,object.Lever,object.rotation);
                    break;
                case "Lizard":
                    lizardCoords.x = object.x;
                    lizardCoords.y = object.y;
                    break;
                case "SceneSwitch":
                    this.matter.add.rectangle(object.x,object.y, 40,40,{isStatic:true,isSensor:true,onCollideCallback: (e)=>{
                        if(isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)){
                            console.log(`Switching to scene ${object.Level}`);
                            this.scene.start("levelGenerator",{map:object.Level});
                        }
                    }});
                    break;
                case "Light":
                    this.lights.addLight(object.x,object.y,object.radius,0xffffff,object.intensity);
                    break;
                case "Bubble":
                    createBubble(this,object.x,object.y);
                    
            }   
        })
               //We tried making the lizard a custom class that extended Matter.Sprite, but we got all kinds of errors for some reason so instead we made a function that creates the lizard and returns it (no issue with this)
        this.lizardHead = createLizard(this, lizardCoords.x, lizardCoords.y);
        createHUD(this, this.lizardHead);
        this.raycaster.mapGameObjects(this.lizardHead.bodyParts.head, true);
        this.lizardLight = this.lights.addLight(0,0,500).setIntensity(3);
        this.lizardLight.setColor(0xffffff);
        this.emitter.on("lizardHurt",()=>{
            this.lizardLight.setColor(0xbf0b0b).setIntensity(30);
            setTimeout(()=>{
                this.lizardLight.setColor(0xfffff).setIntensity(3);
            }, 750);
        })
        console.log(this.lizardLight);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.lizardHead, false, 0.2, 0.2);
        this.cameras.main.setBounds(0,0,map.width * 32, map.height * 32)
        this.cameras.main.useBounds = true;
        this.lights.enable();
        console.log(this.lights);
        this.input.gamepad.on("down",(pad,button,value)=>{
            this.lizardHead.attack();
        })
        document.getElementById('fullScreenButton').addEventListener('click',()=>{
            this.scale.startFullscreen();
        })
        //this allows dynamic graphics without the need for each entity to have it's own graphics object
        this.matter.world.on("beforeupdate",()=>{
            this.graphics.clear();
        })
        //this.lights.debug();
    }
    update()
    { 
        
        this.lizardLight.x = this.lizardHead.x;
        this.lizardLight.y = this.lizardHead.y;
        //console.log(this.lizardLight.x, this.lizardLight.y);
        document.getElementById("fpsmeter").innerHTML = `FPS: ${this.sys.game.loop.actualFps} LizardSticking: ${this.lizardHead.sticking.isSticking} ${this.lizardHead.breakingInformation}`;
       
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
        width: 960,
        height: 640,
    },
    
    backgroundColor: '#090f33',
    parent: 'game',
    pixelArt:true,
    maxLights:10,
    physics: {
        default: 'matter' ,
        matter:{
            gravity:{
                y: 0.5
            },
            fps:{
                target: 60,
                forceSetTimeout: true
            },
            debug: false
        }  
    },
    
    plugins: {
        scene: [
            {
                key: "PhaserRaycaster",
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    },
    input: {
        gamepad: true
    },
    scene: Example
};

const game = new Phaser.Game(config);
