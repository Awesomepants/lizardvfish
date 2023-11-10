provideDamage = (e) => {
    if(isLizardBodyPart(e.bodyA)){
        //console.log(e.bodyA);
        e.bodyA.parent.gameObject.damage(1);
    } else if(isLizardBodyPart(e.bodyB)){
        e.bodyB.parent.gameObject.damage(1);
    }
}


const createPirahna = (scene, x, y, rotation) => {
    let raycastCooldown = 0;
    let notDrowningForce = new Phaser.Math.Vector2(0,-0.0016);
    const pirahna = scene.matter.add.sprite(x,y,"pirahna",0,{shape: "circle", circleRadius: 25, ignoreGravity: true, frictionAir: 0, restitution: 0.5, onCollideCallback: pirahnaCollision});
    pirahna.anims.createFromAseprite('pirahna');
    pirahna.anims.play({key:"Swim", repeat: -1});
    pirahna.rotation = rotation;
    scene.heroRaycaster.mapGameObjects(pirahna,true);
    const light = scene.lights.addLight(0,0,140).setColor(0x36b5f5).setIntensity(1);
    const raycaster = scene.raycaster;
    let ray = raycaster.createRay();
    let damageCooldown = 20;
    let health = 3;
    let dead = false;
    pirahna.damage = () => {
        if(damageCooldown >= 20){
            damageCooldown = 0;
            pirahna.anims.play("Stagger");
            pirahna.anims.nextAnim = "Swim";
            console.log("pirahna go ouchie wawa");
            health --;
            if(health <= 0){
                pirahna.die();
            }
        }
        
    }
    pirahna.die = () => {
        scene.heroRaycaster.removeMappedObjects(pirahna);
        pirahna.anims.play("Dead");
        pirahna.dead = true;
        notDrowningForce = new Phaser.Math.Vector2(0,-0.004);
    }
    function pirahnaCollision(e){
            pirahna.rotation += 180;
            switch ("lizardSkull") {
                case e.bodyA.label:
                    if(e.bodyA.parent.gameObject.anims.currentAnim.key === "Attack"){
                        pirahna.damage();
                    }
                    break;
                case e.bodyB.label:
                    if(e.bodyB.parent.anims.currentAnim.key === "Attack"){
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
                pirahna.thrust(0.0001);
                if(damageCooldown < 20){
                    damageCooldown++;
                }
                raycastCooldown = 0;
                ray.setOrigin(pirahna.x,pirahna.y);
                ray.setAngle(pirahna.rotation);
                let intersection = ray.cast();
                //ugh edge cases where the object comes back as null or undefined make these if blocks so messy
                if(intersection.object && intersection.object.body && intersection.object.body.label === "lizardHead"){
                    pirahna.thrust(0.05);
                    pirahna.anims.play({key:"Attack"});
                    pirahna.anims.nextAnim = "Swim";
    
            }
            }
            if(pirahna.angle > -90 && pirahna.angle < 90){
                pirahna.flipY = false;
            } else {
                pirahna.flipY = true;
            }
            
        
        
        pirahna.applyForce(notDrowningForce);
        light.x = pirahna.x;
        light.y = pirahna.y;
    })
    return pirahna;
}