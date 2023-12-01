
class Example extends Phaser.Scene {
  constructor() {
    super("levelGenerator");
  }
  init(data) {
    this.map = data.map;
    if (!this.map) {
      this.map = "Tutorial";
    }
  }
  preload() {
  
  }

  create() {
    theMatterWorld = this.matter.world;
     this.matter.world.autoUpdate = false;
     this.matter.world.on("afterupdate",this.glupdate, this)
    let bg = this.add
      .image(620, 400, "Background")
      .setScrollFactor(0.01, 0.01)
      .setPipeline("Light2D")
      .setScale(1.4);
    //this.lights.enable();
    this.emitter = new Phaser.Events.EventEmitter();
    this.emitter.on("lizardDeath", () => {
      setTimeout(() => {
        this.scene.start("levelGenerator", { map: this.map });
      }, 3000);
    });
    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 140,
      y: config.scale.height - 90,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888, 0.5).setDepth(2),
      thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.5).setDepth(2),
      dir: "8dir", // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      forceMin: 16,
      enable: true,
    });
    if (this.sys.game.device.os.desktop) {
      this.joystick.setVisible(false);
    } else {
      this.input.addPointer(1);
      this.input.on("pointerdown", (pointer) => {
        if (pointer.downX > window.innerWidth / 2) {
          this.lizardHead.attack();
        }
      });
    }
    this.joystickKeys = this.joystick.createCursorKeys();

    this.raycaster = this.raycasterPlugin.createRaycaster({ debug: false });
    this.heroRaycaster = this.raycasterPlugin.createRaycaster({ debug: false });
    const map = this.make.tilemap({ key: this.map });
    const tileset = map.addTilesetImage("AquaTile");
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    groundLayer
      .setCollisionByProperty({ collides: true })
      .setPipeline("Light2D");
    this.lights.setAmbientColor(0x070918);
    let collisionTiles = [];
    for(let i = 1; i <= 70; i++){
      collisionTiles.push(i);
    }
    console.log(collisionTiles);
    this.raycaster.mapGameObjects(groundLayer, false, {
      collisionTiles: collisionTiles,
    });
    this.heroRaycaster.mapGameObjects(groundLayer, false, {
      collisionTiles: collisionTiles,
    });
    this.matter.world.convertTilemapLayer(groundLayer);

    const lizardCoords = { x: 0, y: 0, xOrient: 1, yOrient: 0 };
    map.objects[0].objects.forEach((object) => {
      //extrapolate the weird array of properties on this object and convert it to more accessible properties on the object itself
      if (object.properties) {
        object.properties.forEach((property) => {
          object[property.name] = property.value;
        });
      }
      console.log(object);
      switch (object.name) {
        case "Lizard":
          (lizardCoords.x = object.x), (lizardCoords.y = object.y);
          if(object.xOrient){
            lizardCoords.xOrient = object.xOrient;
          }
          if(object.yOrient){
            lizardCoords.yOrient = object.yOrient;
          }
          break;
        case "Pirahna":
          const pirahna = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "pirahna", id: object.id }
          );
          if (object.health) {
            pirahna.health = object.health;
          }
          break;
        case "spikePirahna":
          const spikePirahna = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "spikePirahna", id: object.id }
          );
          if (object.health) {
            spikePirahna.health = object.health;
          }
          break;
        case "multiPirahna":
          const multiBoy = createPirahna(
            this,
            object.x,
            object.y,
            object.rotation,
            { type: "multiPirahna", id: object.id }
          );
          multiBoy.health = object.health;
          break;
        case "Urchin":
          const urchin = this.matter.add.sprite(
            object.x,
            object.y,
            "urchin",
            0,
            {
              isStatic: true,
              shape: "circle",
              circleRadius: 10,
              restitution: "40",
              onCollideCallback: provideDamage,
            }
          );
          urchin.anims.createFromAseprite("urchin");
          urchin.anims.play({ key: "Idle", repeat: -1 });
          //this.lights.addLight(object.x,object.y,128,0xbf0b0b,6);
          break;
        case "Lever":
          createLever(this, object.x, object.y, object.id, object.rotation);
          break;
        case "Door":
          createDoor(this, object.x + 16, object.y + 16, object.Lever);
          break;
        case "Lizard":
          lizardCoords.x = object.x;
          lizardCoords.y = object.y;
          break;
        case "SceneSwitch":
          this.matter.add.rectangle(object.x, object.y, 40, 40, {
            isStatic: true,
            isSensor: true,
            onCollideCallback: (e) => {
              if (isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)) {
                console.log(`Switching to scene ${object.Level}`);
                this.scene.start("levelGenerator", { map: object.Level });
              }
            },
          });
          break;
        case "Light":
          this.lights.addLight(
            object.x,
            object.y,
            object.radius,
            0xffffff,
            object.intensity
          );
          break;
        case "Bubble":
          createBubble(this, object.x, object.y);
          break;
        case "EnemyDoor":
          createDoor(this, object.x + 16, object.y + 16, object.enemy, "enemy");
          break;
        case "Text":
          if(object.mobileContent && !this.sys.game.device.os.desktop){
            object.content = object.mobileContent;
          }
          
          this.add.text(object.x, object.y, object.content);
          break;
        case "CollisionSquare":
          console.log("square", object);
          this.matter.add.rectangle(
            object.x + object.width / 2,
            object.y + object.height / 2,
            object.width,
            object.height,
            { isStatic: true }
          );
          break;
        case "Jelly":
          createJelly(this, object.x, object.y, object.ceiling, object.floor);
          break;
        case "bgm":
          if(this.registry.bgm.key != object.key){
            console.log("Background music detected");
            this.sound.stopByKey(this.registry.bgm.key);
            this.bgm = this.sound.add(object.key);
            this.bgm.setLoop(true);
            this.bgm.play();
            this.registry.bgm = this.bgm;
          }
          break;
        case "AnglerFish":
          createAnglerfish(
            this,
            object.x,
            object.y,
            object.lureX,
            object.lureY,
            object.realAxolotl
          );
          break;
        case "escapeAxolotl":
          console.log("henlo")
          createEscapeAxolotl(this,
            object.x,
            object.y,
            object.id)
            break;
          case "chaseAngler":
            createChaseAngler(this, object.x, object.y);
            break;
          case "Image":
            const image = this.add.image(object.x, object.y, object.image);
            if(object.scale){
              image.setScale(object.scale);
            }
            break;
          case "endTrigger":
            this.matter.add.rectangle(object.x, object.y, 40, 40, {
              isStatic: true,
              isSensor: true,
              onCollideCallback: (e) => {
                if (isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)) {
                  //I can't think of a scenario where this will evaluate to false but you can't be too careful
                  if(!this.registry.endTime && this.registry.startTime){
                    this.registry.endTime = new Date().getTime();
                    this.registry.totalTime = this.registry.endTime - this.registry.startTime;
                    console.log(`Game was completed in ${this.registry.totalTime}`);
                  }
                  this.scene.start("intro",{outro: true});
                  
                }
              },
            });
            break;
          case "startTimer":
            if(!this.registry.startTime){
              this.registry.startTime = new Date().getTime();
              console.log(`Timer started at ${this.registry.startTime}`)
            }
            
      }
    });
    //We tried making the lizard a custom class that extended Matter.Sprite, but we got all kinds of errors for some reason so instead we made a function that creates the lizard and returns it (no issue with this)
    this.lizardHead = createLizard(
      this,
      lizardCoords.x,
      lizardCoords.y,
      lizardCoords.xOrient,
      lizardCoords.yOrient,
      false
    );
    createHUD(this, this.lizardHead);
    this.raycaster.mapGameObjects(this.lizardHead.bodyParts.head, true);
    this.lizardLight = this.lights.addLight(0, 0, 500).setIntensity(3);
    this.lizardLight.setColor(0xffffff);
    this.emitter.on("lizardHurt", () => {
      this.lizardLight.setColor(0xbf0b0b).setIntensity(30);
      setTimeout(() => {
        this.lizardLight.setColor(0xfffff).setIntensity(3);
      }, 750);
    });
    console.log(this.lizardLight);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.lizardHead, false, 0.2, 0.2);
    this.cameras.main.setBounds(0, 0, map.width * 32, map.height * 32);
    this.cameras.main.useBounds = true;
    this.lights.enable();
    console.log(this.lights);

    this.input.gamepad.on("down", (pad, button, value) => {
      this.lizardHead.attack();
    });
    console.log(this.graphics);

    //this allows dynamic graphics without the need for each entity to have it's own graphics object
    this.matter.world.on("beforeupdate", () => {
      this.graphics.clear();
    });
    //this.lights.debug();
    
  }
  glupdate(time, delta) {      

      this.lizardLight.x = this.lizardHead.x;
      this.lizardLight.y = this.lizardHead.y;
      //console.log(this.lizardLight.x, this.lizardLight.y);
      document.getElementById(
        "fpsmeter"
      ).innerHTML = `FPS: ${this.sys.game.loop.actualFps} LizardSticking: ${this.lizardHead.sticking.isSticking} ${this.lizardHead.breakingInformation}`;
  
      //keyboard controls
      if (this.cursors.space.isDown) {
        this.lizardHead.attack();
      }
      if (this.cursors.left.isDown || this.joystickKeys.left.isDown) {
        this.lizardHead.moveLizard(-1, 0);
      } else if (this.cursors.right.isDown || this.joystickKeys.right.isDown) {
        this.lizardHead.moveLizard(1, 0);
      }
      if (this.cursors.down.isDown || this.joystickKeys.down.isDown) {
        this.lizardHead.moveLizard(0, 1);
      } else if (this.cursors.up.isDown || this.joystickKeys.up.isDown) {
        this.lizardHead.moveLizard(0, -1);
      }
      //gamepad controls
      if (this.input.gamepad.total === 0) {
        return;
      }
  
      const pad = this.input.gamepad.getPad(0);
  
      if (pad.axes.length) {
        const axisH = pad.axes[0].getValue();
        const axisV = pad.axes[1].getValue();
        if (axisH || axisV) {
          this.lizardHead.moveLizard(axisH, axisV);
        }
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

const config = {
  type: Phaser.WEBGL,
  width: 960,
  height: 540,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 960,
    height: 540,
  },

  backgroundColor: "#090f33",
  parent: "game",
  pixelArt: true,
  maxLights: 12,
  physics: {
    default: "matter",
    matter: {
      getDelta: () => {
        return 16.6;
      },
      gravity: {
        y: 0.5,
      },
      getDelta: function () {
        return this.scene.game.loop.delta;
      },
      runner: {
        // `isFixed` means use `getDelta()`
        isFixed: true
      },
      debug: false,
    },
  },

  plugins: {
    scene: [
      {
        key: "PhaserRaycaster",
        plugin: PhaserRaycaster,
        mapping: "raycasterPlugin",
      },
    ],
  },
  input: {
    gamepad: true,
  },
  scene: [Intro, Example],
  //scene: [Example]
};

const game = new Phaser.Game(config);
