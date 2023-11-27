const dialouge = (scene, x,y,content) => {
    const text = scene.add.text(x,y,content, {fontFamily: 'Arial', fontSize: '20px', backgroundColor: '#5f2f45 ', padding: {x: 10, y: 10}});
    setTimeout(()=>{
        text.destroy();
    }, 2000);
}
class Intro extends Phaser.Scene {
    constructor(){
        super('intro')
    }
    init(){
        console.log("Initializing");
    }
    preload(){
        document.getElementById('fullScreenButton').addEventListener('click',()=>{
            this.scale.startFullscreen();
        })
        this.add.text(100,200,"Loading the game...",{fontSize: 60});
        console.log("preloading");
        this.load.aseprite('bodySegment','assets/sprites/bodysegment.png','assets/sprites/bodysegment.json');
        this.load.aseprite('axolotlBodySegment','assets/sprites/axolotlbodysegment.png','assets/sprites/axolotlbodysegment.json');
        this.load.tilemapTiledJSON("IntroCutscene","assets/maps/IntroCutscene.tmj");
        this.load.tilemapTiledJSON("Tutorial","assets/maps/Tutorial.tmj");
        this.load.tilemapTiledJSON("Level1","assets/maps/Level1.tmj");
        this.load.tilemapTiledJSON("Level2","assets/maps/Level2.tmj");
        this.load.tilemapTiledJSON("Level3","assets/maps/Level3.tmj");
        this.load.tilemapTiledJSON("Level4","assets/maps/Level4.tmj");
        this.load.tilemapTiledJSON("Level5","assets/maps/Level5.tmj");
        this.load.tilemapTiledJSON("Level6","assets/maps/Level6.tmj");
        this.load.image("AquaTile","assets/StaticImages/tilesheet.png");
        this.load.aseprite('head','assets/sprites/head.png','assets/sprites/head.json');
        this.load.aseprite('axolotlHead','assets/sprites/axolotlhead.png','assets/sprites/axolotlhead.json');
        this.load.aseprite('legs','assets/sprites/legs.png','assets/sprites/legs.json');
        this.load.aseprite('axolotlLegs','assets/sprites/axolotllegs.png','assets/sprites/axolotllegs.json');
        this.load.aseprite('pirahna','assets/sprites/Pirahna.png','assets/sprites/Pirahna.json');
        this.load.aseprite('spikePirahna','assets/sprites/spikePirahna.png','assets/sprites/spikePirahna.json');
        this.load.aseprite('multiPirahna','assets/sprites/multiPirahna.png','assets/sprites/multiPirahna.json');
        this.load.image('Background','assets/waterBG.png');
        this.load.image('Sunset','assets/StaticImages/sunset.png');
        this.load.image("spike","assets/sprites/spike.png");
        this.load.aseprite('urchin',"assets/sprites/urchin.png","assets/sprites/urchin.json");
        this.load.aseprite('lever',"assets/sprites/lever.png","assets/sprites/lever.json");
        this.load.aseprite('door',"assets/sprites/door.png","assets/sprites/door.json");
        this.load.image("bubble","assets/StaticImages/o2bubble.png");
        this.load.aseprite("enemyDoor","assets/sprites/enemydoor.png","assets/sprites/enemydoor.json");
        this.load.aseprite("emotes","assets/sprites/emotes.png","assets/sprites/emotes.json");
        this.load.aseprite("jellyHead","assets/sprites/jellyhead.png","assets/sprites/jellyhead.json");
        this.load.audio('Lizard and Juliette',["assets/Music/Lizard and Juliette.ogg","assets/Music/Lizard and Juliette.mp3"]);
        this.load.audio("underwaterdig",["assets/Music/underwaterdig.ogg","assets/Music/underwaterdig.mp3"]);
    }
    create(){
        this.bgm = this.sound.add("Lizard and Juliette");
        this.registry.bgm = this.bgm;
        console.log(this.registry);
        console.log("Here we are");
        this.add.image(480,315,'Sunset').setScale(2.2);
        const map = this.make.tilemap({ key: "IntroCutscene"});
        const tileset = map.addTilesetImage("AquaTile");
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true }).setPipeline('Light2D');
        this.lights.setAmbientColor(0x070918);
        this.lights.addLight(450,200, 1200, 0xc7786f, 9)
        this.lights.enable();
        this.matter.world.convertTilemapLayer(groundLayer);
        //We won't use the raycaster at all in this cutscene but the lizard prefabs are expecting it to be here so it's easier to just add it
        this.heroRaycaster = this.raycasterPlugin.createRaycaster({debug:false});
        this.LizardActor = createLizard(this, 120,270,1,0);
        this.AxolotlActor = createLizard(this, 780,270,-1,0,true);
        
        
        //no suffocating in this cutscene lol
        this.tweens.remove(this.LizardActor.oxygenDepletion);
        this.tweens.remove(this.AxolotlActor.oxygenDepletion);
        this.matter.world.on("beforeupdate",()=>{
            this.graphics.clear();
        });
        const sceneEmote = (x,y,emote) => {
            const emotingSprite = this.add.sprite(x,y,"emotes");
            emotingSprite.anims.createFromAseprite("emotes");
            emotingSprite.anims.play(emote);
        }
        //The Cutscene
        const timeline = this.add.timeline([{
            at: 2000,
            run: () => {
                console.log("uwu");
                this.LizardActor.movingRight = true
            }
        },
        {
            at: 2700,
            run: () => {
                console.log("uwu");
                this.LizardActor.movingRight = false
            }
        },
            {
                at: 4000,
                run: () => {
                    console.log("OwO");
                    //dialouge(650,150,"Hewwo!");
                    sceneEmote(260,230,"Heart");
                },
        },
        {
            at: 5000,
            run: () => {
                this.AxolotlActor.movingLeft = true;
            }
        },
        {
            at: 5450,
            run: () => {
                this.AxolotlActor.movingLeft = false;
            }
        },
        {
            at: 7000,
            run: () => {
                sceneEmote(580,230,"Heart");
            }
        },
        {
            at: 10000,
            run: () => {
                dialouge(this,540,200, "We can't keep meeting like this forever");
            }
        },
        {
            at: 13000,
            run: () => {
                sceneEmote(260,230,"Question");
            }
        },
        {
            at: 16500,
            run: () => {
                dialouge(this, 540,200, "You're a Lizard");
            }
        },
        {
            at: 18500,
            run: () => {
                dialouge(this, 540,200, "I'm an Axolotl");
            }
        },
        {
            at: 22000,
            run: () => {
                dialouge(this, 540,200, "You're scaly, I'm slimy");
            }
        },
        {
            at: 24000,
            run: () => {
                dialouge(this, 540,200, "Most of all...");
            }
        },
        {
            at: 28000,
            run: () => {
                dialouge(this, 540,200, "I breathe water");
            }
        },
        {
            at: 31000,
            run: () => {
                dialouge(this, 540,200, "And you breathe air");
            }
        },
        {
            at: 33000,
            run: () => {
                sceneEmote(260,230,"Heartbreak");
            }
        },
        {
            at: 37000,
            run: () => {
                dialouge(this, 540,200,"I hope to see you again someday");
            }
        },
        {
            at: 40000,
            run: () => {
                sceneEmote(580,230,"Heart");
                this.AxolotlActor.movingLeft = true;
                this.AxolotlActor.movingDown = true;
            }
        },
        {
            at: 42000,
            run: () => {
                sceneEmote(260,230,"Heartbreak");
            }
        },
        {
            at: 47000,
            run: () => {

                for(let i=0;i<100;i++){
                    setTimeout(()=>{
                        sceneEmote(300  + Math.floor(Math.random() * 300),530,`Action${1 + Math.floor(Math.random() * 3)}`);
                    },Math.floor(Math.random() * 3000))
                }
                
            }
        },
        {
            at: 51000,
            run: () => {
                dialouge(this, 340,500,"HELP!");
            }
        },
        {
            at: 54000,
            run: () => {
                sceneEmote(260,200,"Surprised");
            }
        },
        {
            at: 57000,
            run: () => {
                this.LizardActor.movingRight = true;
                this.LizardActor.movingDown = true;
            }
        },
        {
            at: 63000,
            run: () => {
                this.scene.start("levelGenerator",{map:"TitleDrop"});
            }
        }
    ])  
        let playing = false;
        const startingText = this.add.text(300,400,"Click or tap to start!", {fontFamily: 'Arial', fontSize: '20px', backgroundColor: '#5f2f45 ', padding: {x: 10, y: 10}});
        const StartScene = () => {
            this.scale.startFullscreen();
            if(!playing){
                this.bgm.play();
                playing = true;
                startingText.destroy();
                timeline.play();
            }
        }
        this.input.on("pointerdown",()=>{
            StartScene();
        })
    }
    update(){
        if(this.LizardActor.movingRight){
            this.LizardActor.moveLizard(0.5,0)
        }
        if(this.AxolotlActor.movingLeft){
            this.AxolotlActor.moveLizard(-0.5,0);
        }
        if(this.AxolotlActor.movingDown){
            this.AxolotlActor.moveLizard(0,2);
        }
        if(this.LizardActor.movingDown){
            this.LizardActor.moveLizard(0,2);
        }
    }
}