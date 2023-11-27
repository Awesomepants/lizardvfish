const createAnglerfish = (scene, x, y, lureX, lureY) => {
    console.log("making scary fish man");
    scene.lights.setAmbientColor(0x030206);
    const angler = scene.matter.add.sprite(x, y,"anglerFish", 0, {ignoreGravity: true}).setPipeline("Light2D").setScale(2);
    const lure = scene.matter.add.sprite(lureX, lureY, "anglerLure",0, {ignoreGravity: true});
    lure.anims.createFromAseprite("anglerLure");
    angler.anims.createFromAseprite("anglerFish");
    const lureLight = scene.lights.addLight(lureX, lureY, 200);
    const anglerLight = scene.lights.addLight(x,y,800).setIntensity(0);
    
    console.log(anglerLight);
    let triggered = false;
    const trigger = () => {
        console.log("triggered!");
        triggered = true;
        lure.anims.play("Transform");
        scene.emitter.emit("AnglerTriggered");
        setTimeout(() => {
            angler.anims.play("Activate");
          scene.tweens.add({
        
            targets: anglerLight,
            intensity: 5,
            duration: 1000,
            onComplete: ()=>{
                console.log("henlo");
            }
        
    })  
        }, 2000)
        

    }
    scene.matter.world.on("afterupdate", ()=>{
        lureLight.x = lure.x;
        lureLight.y = lure.y;
        anglerLight.x = angler.x;
        anglerLight.y = angler.y;
        if(!triggered){
            if(Math.abs(lureX - scene.lizardHead.x) < 200 && Math.abs(lureY - scene.lizardHead.y) < 200){
                trigger();
            }
        }
    })
}
const createEscapeAxolotl = (scene, x, y, id) => {
    const escapeAxolotl = createLizard(scene, x, y, 1, 0, true);
    let axolotlTriggered = false;
    let axolotlMoving = false;
    const light = scene.lights.addLight(x,y,100000).setIntensity(0).setColor(0xffae80);
    scene.emitter.on("AnglerTriggered",()=>{
        scene.tweens.add({
            targets: light,
            intensity: 10,
            duration:3000
        })
    })
    scene.matter.world.on("afterupdate",()=>{
        if(Math.abs(scene.lizardHead.y - escapeAxolotl.y)< 50 && !axolotlTriggered){
            console.log("uwus");
            axolotlTriggered = true;
            dialouge(scene, escapeAxolotl.x, escapeAxolotl.y - 50, "We need to get out of here!");
            setTimeout(()=>{
                dialouge(scene, escapeAxolotl.x, escapeAxolotl.y - 50, "Follow me!");
            }, 1500);
            setTimeout(()=>{
                
                    console.log("run!");
                    axolotlMoving = true;
                
            }, 3000)
        }
        if(axolotlMoving){
            escapeAxolotl.moveLizard(1.5,0);
        }
    })
}