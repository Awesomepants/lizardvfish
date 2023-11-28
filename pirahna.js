const provideDamage = (e) => {
    if(isLizardBodyPart(e.bodyA)){
        //console.log(e.bodyA);
        e.bodyA.parent.gameObject.damage(1);
    } else if(isLizardBodyPart(e.bodyB)){
        e.bodyB.parent.gameObject.damage(1);
    }
}

const pirahnaAttack = (pirahna, scene) => {
    if(!pirahna.playedAggroSound){
        scene.sound.play("pirahnaagro");
    }    
    
        pirahna.playedAggroSound = true;
        setTimeout(()=>{
            pirahna.playedAggroSound = false
        }, 500)
        pirahna.anims.play({key:"Attack"});
        pirahna.anims.nextAnim = {key: "Swim", repeat :-1};
        setTimeout(()=>{
            //the if condition here basically stops this from confusing phaser if the timeout event fires when the scene has already switched to a scene not containing this pirahna
            if(pirahna.body){
                pirahna.thrust(0.05);
            }
            
        }, 300)
        
        
}
const fireSpike = (scene, x, y, direction, force) => {
    
    let spikeDangerous = true;
    const spike = scene.matter.add.sprite(x, y, "spike", 0, {isSensor: true, onCollideEndCallback: ()=>{
        if(spikeDangerous){
            spike.body.isSensor = false;
        }
        
        
    },
    onCollideCallback: (e)=>{
        if(!spikeDangerous || e.bodyA.isSensor || e.bodyB.isSensor){
            return;
        } else if (spikeDangerous){
            provideDamage(e);
            spikeDangerous = false;
        }
    }});
    spike.setPipeline("Light2D");
    spike.setAngle(direction);
    spike.thrust(force);
    setTimeout(()=>{
        spikeDangerous = false;
        spike.destroy();
    }, 2000)
}
const spikePirahnaAttack = (scene, pirahna) => {
    pirahna.spikeCooldown--;
    if(pirahna.spikeCooldown < 1){
        pirahna.spikeCooldown = 10;
        scene.sound.play("spike");
        fireSpike(scene, pirahna.x, pirahna.y, pirahna.angle, 0.02)
    //The pirahna flips when it collides, I did this so it would bounce off walls and keep moving, but it also does it when it detects the collision with the spike! (Which is a sensor), the quick and dirty solution to this is to simply rotate the pirahna back to how they were before
    //pirahna.setAngle(pirahna.angle + 180);
    }
    
}
const multiPirahnaAttack = (scene, pirahna) => {
    const firingForce = 0.01;
    scene.sound.play("spike");
    for(i=0;i<9;i++){
        fireSpike(scene, pirahna.x, pirahna.y, pirahna.angle + (i*45),firingForce);
    }
    pirahna.setAngle(pirahna.angle + 180);
    
}
const createPirahna = (scene, x, y, rotation, config = {type:"pirahna"}) => {
    let raycastCooldown = 0;
    let movementSpeed;
    
    if(config.type != "spikePirahna"){
        movementSpeed = 0.0001;
    } else {
        movementSpeed = 0;
    }
    let notDrowningForce = new Phaser.Math.Vector2(0,-0.00165);
    const pirahna = scene.matter.add.sprite(x,y,"pirahna",0,{shape: "circle", circleRadius: 25, ignoreGravity: false, frictionAir: 0, restitution: 0.5, onCollideCallback: pirahnaCollision});
    pirahna.setPipeline("Light2D");
    pirahna.spikeCooldown = 0;
    pirahna.tiledId = config.id;
    pirahna.anims.createFromAseprite(config.type);
    pirahna.anims.play({key:"Swim", repeat: -1});
    pirahna.setAngle(rotation);
    if(config.type === "multiPirahna"){
        pirahna.spikeTimer = scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: multiPirahnaAttack,
            args: [scene, pirahna]
        })
    }
    scene.heroRaycaster.mapGameObjects(pirahna,true);
    pirahna.light = scene.lights.addLight(0,0,140).setColor(0x36b5f5).setIntensity(1);
    const raycaster = scene.raycaster;
    let ray = raycaster.createRay();
    let damageCooldown = 20;
    pirahna.health = 2;
    let dead = false;
    pirahna.damage = () => {
        if(damageCooldown >= 20){
            scene.sound.play("pirahnahurt");
            damageCooldown = 0;
            pirahna.anims.play("Stagger");
            pirahna.anims.nextAnim = "Swim";
            console.log("pirahna go ouchie wawa");
            pirahna.health --;
            if(pirahna.health <= 0){
                pirahna.die();
            }
        }
        
    }
    pirahna.die = () => {
        scene.emitter.emit("pirahnaDeath",pirahna.tiledId);
        createBubble(scene,pirahna.x,pirahna.y);
        scene.heroRaycaster.removeMappedObjects(pirahna);
        scene.lights.removeLight(pirahna.light);
        pirahna.anims.play("Dead");
        pirahna.dead = true;
        notDrowningForce = new Phaser.Math.Vector2(0,-0.004);
        if(config.type === "multiPirahna"){
            scene.time.removeEvent(pirahna.spikeTimer);
        }
    }
    function pirahnaCollision(e){
        if(config.type != "spikePirahna"){
            pirahna.setAngle(pirahna.angle + 180);
        }
            
            
            switch ("lizardSkull") {
                case e.bodyA.label:
                    if(e.bodyA.parent.gameObject.anims.currentAnim.key === "Attack"){
                        pirahna.damage();
                    }
                    break;
                case e.bodyB.label:
                    if(e.bodyB.parent.gameObject.anims.currentAnim.key === "Attack"){
                        pirahna.damage();
                    }
                    break;
                default:
                    if(pirahna.anims.currentAnim.key === "Attack"){
                        provideDamage(e);
                    } 
        }
    }
    scene.matter.world.on("afterupdate",()=>{
            if(!pirahna.dead){
                pirahna.thrust(movementSpeed);
                if(damageCooldown < 20){
                    damageCooldown++;
                }
                raycastCooldown = 0;
                ray.setOrigin(pirahna.x,pirahna.y);
                ray.setAngle(pirahna.rotation);
                let intersection = ray.cast();
                //ugh edge cases where the object comes back as null or undefined make these if blocks so messy
                if(intersection.object && intersection.object.body && intersection.object.body.label === "lizardSkull"){
                    pirahna.setAngularSpeed(0);
                    switch (config.type) {
                        case "pirahna":
                            pirahnaAttack(pirahna, scene);
                            console.log("uwu");
                            break;
                        case "spikePirahna":
                            spikePirahnaAttack(scene,pirahna);
                            break;
                    }

    
            }
            }
            if(pirahna.angle > -90 && pirahna.angle < 90){
                pirahna.flipY = false;
            } else {
                pirahna.flipY = true;
            }
            
        
        
        pirahna.applyForce(notDrowningForce);
        if(!pirahna.dead){
            pirahna.light.x = pirahna.x;
            pirahna.light.y = pirahna.y;
        }
        
    })
    return pirahna;
}