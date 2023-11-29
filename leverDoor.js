const createLever = (scene, x, y, TiledId, rotation) => {
    const lever = scene.matter.add.sprite(x,y,"lever",0,{label: "lever", isSensor: true, onCollideCallback: leverCollision
    });
    lever.setAngle(rotation);
    lever.setStatic(true);
    lever.anims.createFromAseprite("lever");
    lever.flipped = false;
    lever.anims.play("UnFlipped");
    function leverCollision(e){
        if(isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)){
            lever.flipped = true;
            lever.anims.play("Flipped")
            scene.emitter.emit("leverFlipped",TiledId)
        }
}}
const createDoor = (scene, x, y, lever, type="lever") => {
    const door = scene.matter.add.sprite(x,y,"door",0,{isSensor: false, isStatic: true});
    scene.heroRaycaster.mapGameObjects(door, false);
    switch(type){
        case "lever":
            door.anims.createFromAseprite("door");  
            break;
        case "enemy":
            door.anims.createFromAseprite("enemyDoor");
            break;
    }
    door.anims.play("Shut");

    
    door.lever = lever;
    const openDoor = () => {
        //the if block is just to make sure we don't play this animation again if the door is already open
        if(!door.body.isSensor){
            scene.heroRaycaster.removeMappedObjects(door);
            scene.sound.play("switch");
           door.anims.play("Open");
            door.body.isSensor = true; 
        }
        
    }
    if(type==="lever"){
        scene.emitter.on("leverFlipped", (leverId) => {
             console.log(door.lever);
        if(leverId === door.lever){
            console.log("uwudoor");
            openDoor();
        }
    })
    } else if(type==="enemy"){
        scene.emitter.on("pirahnaDeath", (pirahnaId)=>{
            console.log(`uwu ${pirahnaId} ${door.lever}`)
            if(pirahnaId === door.lever){
                openDoor();
            }
        })
    }
    
}
const createBubble = (scene,x,y) => {
    const bubble = scene.matter.add.sprite(x,y,"bubble",0,{isSensor: true, isStatic: true, onCollideCallback:gibvoxygen});
    function gibvoxygen(e){
        if(isLizardBodyPart(e.bodyA) || isLizardBodyPart(e.bodyB)){
            scene.sound.play("pickupbubble");
            scene.lizardHead.oxygen = 100;
            scene.lizardHead.health++;
            scene.lizardHead.oxygenDepletion.restart();
            bubble.destroy();
        }
    }
}