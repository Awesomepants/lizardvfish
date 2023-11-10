const createPirahna = (scene, x, y) => {
    let raycastCooldown = 0;
    const notDrowningForce = new Phaser.Math.Vector2(0,-0.0016)
    const pirahna = scene.matter.add.sprite(x,y,"pirahna",0,{shape: "circle", circleRadius: 25, ignoreGravity: true, frictionAir: 0, restitution: 0.5});
    pirahna.anims.createFromAseprite('pirahna');
    pirahna.anims.play({key:"Swim", repeat: -1});
    const light = scene.lights.addLight(0,0,80).setColor(0x36b5f5).setIntensity(1);
    const raycaster = scene.raycaster;
    let ray = raycaster.createRay();
    scene.matter.world.on("afterupdate",()=>{
            raycastCooldown = 0;
            ray.setOrigin(pirahna.x,pirahna.y);
            ray.setAngle(pirahna.rotation);
            let intersection = ray.cast();
            //ugh edge cases where the object comes back as null or undefined make these if blocks so messy
            if(intersection.object && intersection.object.body && intersection.object.body.label === "lizardHead"){
                pirahna.thrust(0.05);
        }
        
        
        pirahna.applyForce(notDrowningForce);
        light.x = pirahna.x;
        light.y = pirahna.y;
    })
    return pirahna;
}