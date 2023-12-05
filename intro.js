let theMatterWorld;
let accumulatedTime = 0;
const worldStep = () => {
  try {
    theMatterWorld.step(16)
  } catch (error) {
    console.log(error);
  }
}
let accumulator = 0;
matterTimeStep = 16.6
const dialouge = (scene, x,y,content) => {
    scene.sound.add("dialouge").play();
    const text = scene.add.text(x,y,content, {fontFamily: 'Arial', fontSize: '20px', backgroundColor: '#5f2f45 ', padding: {x: 10, y: 10}});
    setTimeout(()=>{
        text.destroy();
    }, 2000);
}
const loadAssets = (scene)=>{
    scene.load.image('Sunset','assets/StaticImages/sunset.png');
    scene.load.tilemapTiledJSON("IntroCutscene", "assets/maps/IntroCutscene.tmj");
    scene.load.tilemapTiledJSON("TitleDrop", "assets/maps/TitleDrop.tmj");
    scene.load.tilemapTiledJSON("Tutorial", "assets/maps/Tutorial.tmj");
    scene.load.tilemapTiledJSON("Level1", "assets/maps/Level1.tmj");
    scene.load.tilemapTiledJSON("preLevel2", "assets/maps/preLevel2.tmj");
    scene.load.tilemapTiledJSON("Level2", "assets/maps/Level2.tmj");
    scene.load.tilemapTiledJSON("preLevel3", "assets/maps/preLevel3.tmj");
    scene.load.tilemapTiledJSON("Level3", "assets/maps/Level3.tmj");
    scene.load.tilemapTiledJSON("Level4", "assets/maps/Level4.tmj");
    scene.load.tilemapTiledJSON("Level5", "assets/maps/Level5.tmj");
    scene.load.tilemapTiledJSON("Level6", "assets/maps/Level6.tmj");
    scene.load.tilemapTiledJSON("Level7", "assets/maps/Level7.tmj");
    scene.load.tilemapTiledJSON("Level8", "assets/maps/Level8.tmj");
    scene.load.tilemapTiledJSON("Level9", "assets/maps/Level9.tmj");
    scene.load.tilemapTiledJSON("Chase", "assets/maps/Chase.tmj");
    scene.load.tilemapTiledJSON("Chase2","assets/maps/Chase2.tmj");
    scene.load.tilemapTiledJSON(
      "bossEncounter",
      "assets/maps/bossEncounter.tmj"
    );
    scene.load.plugin(
        "rexvirtualjoystickplugin",
        "rexVirtualJoystick.min.js",
        true
      );
      scene.load.aseprite('emotes', "assets/sprites/emotes.png","assets/sprites/emotes.json");
      scene.load.aseprite(
        "bodySegment",
        "assets/sprites/bodysegment.png",
        "assets/sprites/bodysegment.json"
      );
      scene.load.aseprite(
        "axolotlBodySegment",
        "assets/sprites/axolotlbodysegment.png",
        "assets/sprites/axolotlbodysegment.json"
      );
  
      scene.load.image("gameLogo", "assets/StaticImages/gameLogo.png")
      scene.load.image("AquaTile", "assets/StaticImages/tilesheet.png");
      scene.load.aseprite(
        "head",
        "assets/sprites/head.png",
        "assets/sprites/head.json"
      );
      scene.load.aseprite(
        "axolotlHead",
        "assets/sprites/axolotlhead.png",
        "assets/sprites/axolotlhead.json"
      );
      scene.load.aseprite(
        "legs",
        "assets/sprites/legs.png",
        "assets/sprites/legs.json"
      );
      scene.load.aseprite(
        "axolotlLegs",
        "assets/sprites/axolotllegs.png",
        "assets/sprites/axolotllegs.json"
      );
      scene.load.aseprite(
        "pirahna",
        "assets/sprites/Pirahna.png",
        "assets/sprites/Pirahna.json"
      );
      scene.load.aseprite(
        "spikePirahna",
        "assets/sprites/spikePirahna.png",
        "assets/sprites/spikePirahna.json"
      );
      scene.load.aseprite(
        "multiPirahna",
        "assets/sprites/multiPirahna.png",
        "assets/sprites/multiPirahna.json"
      );
      scene.load.image("Background", "assets/waterBG.png");
      scene.load.image("spike", "assets/sprites/spike.png");
      scene.load.aseprite(
        "urchin",
        "assets/sprites/urchin.png",
        "assets/sprites/urchin.json"
      );
      scene.load.aseprite(
        "lever",
        "assets/sprites/lever.png",
        "assets/sprites/lever.json"
      );
      scene.load.aseprite(
        "door",
        "assets/sprites/door.png",
        "assets/sprites/door.json"
      );
      scene.load.image("bubble", "assets/StaticImages/o2bubble.png");
      scene.load.aseprite(
        "enemyDoor",
        "assets/sprites/enemydoor.png",
        "assets/sprites/enemydoor.json"
      );
      scene.load.aseprite(
        "jellyHead",
        "assets/sprites/jellyhead.png",
        "assets/sprites/jellyhead.json"
      );
      scene.load.aseprite(
        "anglerFish",
        "assets/sprites/anglerfish.png",
        "assets/sprites/anglerfish.json"
      );
      scene.load.aseprite(
        "anglerLure",
        "assets/sprites/anglerLure.png",
        "assets/sprites/anglerLure.json"
      );
      scene.load.audio("underwaterbattle",["assets/Music/underwaterbattle.ogg","assets/Music/underwaterbattle.mp3"]);
      scene.load.audio("underwaterdig",["assets/Music/underwaterdig.ogg","assets/Music/underwaterdig.mp3"])
      scene.load.audio("lizardhurt",["assets/sfx/lizardhurt.ogg","assets/sfx/lizardhurt.mp3"]);
      scene.load.audio("pirahnahurt",["assets/sfx/pirahnahurt.ogg","assets/sfx/pirahnahurt.mp3"]);
      scene.load.audio("pirahnaagro",["assets/sfx/pirahnaagro.ogg","assets/sfx/pirahnaagro.mp3"]);
      scene.load.audio("ambience",["assets/sfx/ambience.ogg","assets/sfx/ambience.mp3"]);
      scene.load.audio("attack",["assets/sfx/attack.ogg","assets/sfx/attack.mp3"]);
      scene.load.audio("dialouge",["assets/sfx/dialouge.ogg","assets/sfx/dialouge.mp3"])
      scene.load.audio("pickupbubble",["assets/sfx/pickupbubble.ogg","assets/sfx/pickupbubble.mp3"]);
      scene.load.audio("spike",["assets/sfx/spike.ogg","assets/sfx/spike.mp3"]);
      scene.load.audio("pirahnadeath",["assets/sfx/pirahnadeath.ogg","assets/sfx/pirahnadeath.mp3"])
      scene.load.audio("switch",["assets/sfx/switch.ogg","assets/sfx/switch.mp3"]);
      scene.load.audio('Lizard and Juliette',["assets/Music/Lizard and Juliette.ogg","assets/Music/Lizard and Juliette.mp3"]);
      scene.load.audio("jumpscare",["assets/sfx/jumpscare.ogg","assets/sfx/jumpscare.mp3"]); 

}
class Intro extends Phaser.Scene {
    constructor(){
        super('intro')
    }
    init(data){
        console.log("Initializing");
        if(!data.outro){
            this.outro = false;
        } else {
            this.outro = true;
        }
    }
    preload(){
        document.getElementById('fullScreenButton').addEventListener('click',()=>{
            this.scale.startFullscreen();
        })
        this.add.text(100,200,"Loading the game...",{fontSize: 60});
        console.log("preloading");
        if(!this.outro){
            loadAssets(this);
        }
       
            
    }
    create(){
        if(!this.outro){
            PokiSDK.gameLoadingFinished();
        }
        
        this.matter.world.autoUpdate = false;
        theMatterWorld = this.matter.world;
        //setInterval(worldStep,16)
        this.matter.world.on("afterupdate", this.glupdate, this);
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
        let lizardsY = 270;
        this.LizardActor = createLizard(this, 120,lizardsY,1,0);
        this.AxolotlActor = createLizard(this, 780,lizardsY,-1,0,true);
        
        
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
        const timeline = this.add.timeline([
            {
            
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
        let startingText;
        if(!this.outro){
           startingText = this.add.text(300,400,"Click or tap to start!", {fontFamily: 'Arial', fontSize: '20px', backgroundColor: '#5f2f45 ', padding: {x: 10, y: 10}});
         
        } else {
            this.add.text(250,300,["CONGRATULATIONS!",`You finished the game in`, `${Math.floor(this.registry.totalTime / 60000)} Minutes`, `${(this.registry.totalTime % 60000) / 1000} Seconds!`],{fontFamily:'Arial', fontSize: '40px', backgroundColor: '#5f2f45 '})
        }
        const StartScene = () => {
            //this.scale.startFullscreen();
            if(!playing){
                this.bgm.play();
                playing = true;
                startingText.setText("Click or tap again to skip");
                setTimeout(()=>{
                  this.input.on("pointerdown",()=>{
                    this.scene.start("levelGenerator",{map:"Tutorial"});
                })  
                },2000)
                
                console.log(startingText)
                this.tweens.add({
                    targets: startingText,
                    alpha: 0,
                    duration: 2000,
                    onComplete:()=>{
                        console.log("text is faded");
                    }
                })
                timeline.play();
            }
        }
        if(!this.outro){
            this.input.on("pointerdown",()=>{
            StartScene();
        })
    }

        }
        
    glupdate(time, delta){
        
        if(!this.LizardActor){
            return;
        }
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
    update(time, delta){
        accumulatedTime += delta
        if(accumulatedTime <= 16){
            
            console.log("not updating physics");
        } else {
            accumulatedTime = 0;
            this.matter.world.step(16);
            console.log("updating physics");
        }
    }
}