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
const createDoor = (scene, x, y, lever) => {
    const door = scene.matter.add.sprite(x,y,"door",0,{isSensor: false, isStatic: true});
    door.anims.createFromAseprite("door");
    door.lever = lever;
    scene.emitter.on("leverFlipped", (leverId) => {
             console.log(door.lever);
        if(leverId === door.lever){
            console.log("uwudoor");
            door.anims.play("Open");
            door.body.isSensor = true;
        }
    })
}