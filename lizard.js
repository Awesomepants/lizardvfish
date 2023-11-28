function createLizard(scene, x, y, xOrient, yOrient, axolotl = false){
    let movingBuffer = 0;
    let lizard;
    let lizardButt;
    let stickyConstraint;
    let stuckTile;
    let lizardBodyImages;
    if(!axolotl){
        lizardBodyImages = {
        bodySegment: 'bodySegment',
        head: 'head',
        legs: 'legs',
        color: 0x3d824e
    }
} else {
    lizardBodyImages = {
        bodySegment: 'axolotlBodySegment',
        head: 'axolotlHead',
        legs: 'axolotlLegs',
        color: 0xffae80
    }
}
    const attackThrustAmount = 0.4;
    const thrustCooldown = 30;
    let thrustCooldownTimer = 0;
    const stickyVectorStrengthNotIdling = 0.02;
    const stickyVectorStrengthIdling = 0.5;
    let stickyVectorStrength = stickyVectorStrengthNotIdling;
    lizardHead = scene.matter.add.sprite(x+(20 * xOrient),y+(20 * yOrient), lizardBodyImages.head, 0, {isSensor: true, frictionAir:0.01, mass:0, inverseMass:0, ignoreGravity: true, frictionAir:0, label: "lizardSkull"});
    if(axolotl){
        lizardHead.setDepth(2);
    }
    lizard = scene.matter.add.sprite(x, y, lizardBodyImages.bodySegment, 0, {shape:'circle', restitution: 0, friction: 0, density: 0.003, frictionStatic: 0, frictionAir: 0.1, onCollideCallback: collideCallback});
    lizardButt = scene.matter.add.sprite(x - (40*xOrient), y - (40*yOrient), lizardBodyImages.bodySegment, 0, {shape: 'circle', friction: 0, restitution: 0, density: 0.002, frictionAir: 0.12});
    scene.matter.add.constraint(lizard, lizardButt, 40, 0.9);
    scene.matter.add.constraint(lizardHead, lizard, 5, 0.9);
    lizard.dead = false;
    const tailPhysicsConfig = {friction: 0, mass: 0, inverseMass: 0, frictionAir: 0.2}
    const lizardTail1 = scene.matter.add.circle(x - (55 * xOrient),y+(60*yOrient),2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail1, lizardButt, 15, 0.9);
    const lizardTail2 = scene.matter.add.circle(x-(70+xOrient),y-(80+yOrient),4, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail1, lizardTail2, 15, 0.9);
    const lizardTail3 = scene.matter.add.circle(x-(85+xOrient),y-(100+yOrient),2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail2, lizardTail3, 15, 0.9);
    const lizardTail4 = scene.matter.add.circle(x-(100*xOrient),y-(120*yOrient), 2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail3, lizardTail4, 15, 0.9);
    const frontLeg = scene.add.sprite(x,y,lizardBodyImages.legs).setDepth(1);
    const backLeg = scene.add.sprite(x,y,lizardBodyImages.legs).setDepth(1);
    frontLeg.anims.createFromAseprite(lizardBodyImages.legs);
    backLeg.anims.createFromAseprite(lizardBodyImages.legs);
    frontLeg.anims.play("Idle");
    backLeg.anims.play("Idle");
    lizardHead.anims.createFromAseprite(lizardBodyImages.head);
    lizardHead.anims.play("Nuetral");
    lizard.health = 3;
    lizard.oxygen = 100;
    let damageCooldown = 60;
    lizard.oxygenDepletion = scene.tweens.add({
        targets: lizard,
        oxygen: 0,
        duration: 60000,
        onComplete: ()=>{
            lizard.die();
        }
    })
    //load the appropriate sfx into the game
    lizard.hurtSFX = scene.sound.add("lizardhurt");
    //when the lizard gets an oxygen power-up use lizard.oxygenDepletion.restart() to make the oxygen full again
    lizard.bodyParts = {
        frontLeg: lizard,
        backLeg: lizardButt,
        head: lizardHead,
        tailTip: lizardTail4
    }
    lizard.displayParts = [
        lizard,
        lizardButt,
        frontLeg,
        backLeg,
        lizardHead
    ]
    lizard.verticalFlip = false;
    lizard.horizontalFlip = false;
    lizard.setVerticalFlip = (input) => {
            frontLeg.flipY = input;
            backLeg.flipY = input;
            lizardHead.flipY = !input;
    }
    lizard.setHorizontalFlip = (input) => {
        
            frontLeg.flipX = input;
            backLeg.flipX = input;
        
    }
    lizard.setAllBodiesAngle = (angle) => {
        
    }
    lizard.stickingBuffer = 0;
    lizard.maxStickingBuffer = 4;
    lizard.body.label = "lizardHead";
    lizardButt.body.label = "lizardButt"
    lizard.sticking = {isSticking:false, x:0, y:0};
    scene.graphics = scene.add.graphics();
    //scene.matter.add.mouseSpring();
    const ray = scene.heroRaycaster.createRay().setConeDeg(50);
    lizard.moveLizard = (x,y) => {
        if(!lizard.dead){
        movingBuffer = 0;
        lizard.isMoving = true;
        let force = 0.0015;
        
        if(lizard.sticking.isSticking){
            force = 0.012;
            if(frontLeg.anims.currentAnim.key != "Crawl"){
                frontLeg.anims.play({key:"Crawl", repeat: -1});
                backLeg.play({key:"Crawl", repeat: -1, startFrame: 4});
            }
            
        } else if (frontLeg.anims.currentAnim.key != "Swim"){
            frontLeg.anims.play({key:"Swim", repeat:-1});
            backLeg.play({key:"Swim", repeat:-1, startFrame: 4});
        }
        
        lizard.applyForce(new Phaser.Math.Vector2(x*force,y*force));
        lizardHead.applyForce(new Phaser.Math.Vector2(x*force,y*force));
        //lizardHead.applyForce(new Phaser.Math.Vector2(x*force,y*force));
        let lizardVelocity = lizard.getVelocity();
        if(!lizard.sticking.isSticking){
            let lizardAngle = Math.atan2(lizardVelocity.y, lizardVelocity.x);
            //lizard.setAngle(Phaser.Math.RadToDeg(lizardAngle) + 180);
            lizardAngle = Math.atan2(lizardVelocity.y, lizardVelocity.x);
            //lizardButt.setAngle(Phaser.Math.RadToDeg(lizardAngle) + 180);
        }
        
    }
    }
    lizard.attack = () => {
        if(thrustCooldownTimer > thrustCooldown && !lizard.dead){
            scene.sound.play("attack");
                lizardHead.thrust(attackThrustAmount);
           
            lizardHead.anims.play("Attack");
            lizardHead.anims.nextAnim = "Nuetral";
            thrustCooldownTimer = 0;
        }
        
    }
    
    function collideCallback(e){ 
        const o1 = e.bodyA;
        const o2 = e.bodyB;
        if(!o1.isStatic && !o2.isStatic){
            return;
        }
        if((o1.label === "lizardHead" && o2.label === "Rectangle Body") || (o2.label === "lizardHead" && o1.label === "Rectangle Body")){
            if(o2.label === "Rectangle Body"){
                stuckTile = o2;
            } else if (o1.label === "Rectangle Body"){
                stuckTile = o1;
            }
            const collisionNormal = e.collision.normal;
            lizard.stickingBuffer = 0;
            lizard.sticking.isSticking = true;
            lizard.sticking.x=collisionNormal.x;
            lizard.sticking.y=collisionNormal.y;
            if(stickyConstraint && stickyConstraint.type === "constraint"){
                //we've verified that stickyConstraint is a constraint and not undefined
                if(!(stickyConstraint.bodyA.id === o1.id && stickyConstraint.bodyB.id === o2.id )){
                    //we've verified that we're not creating the same constraint again (for memory purposes);
                    if(lizard.isMoving){
                        //we only wish to create this if the lizard is in motion
                        scene.matter.world.removeConstraint(stickyConstraint);
                        stickyConstraint = scene.matter.add.constraint(o1,o2,30,stickyVectorStrength);
                    }
                    
                }
                
            } else {
                //this will be called the first time the lizard collides with the wall, when stickyConstraint is undefined
                    stickyConstraint = scene.matter.add.constraint(o1,o2,30,stickyVectorStrength);
            }
            
            

            
        }
    }
    lizard.die = ()=>{
        if(!lizard.dead){
            scene.emitter.emit("lizardDeath");
        }
        
        lizard.dead = true;
        lizardHead.anims.play("Dead");
        console.log("Oh no I'm dead lol");
    }
    lizard.damage = (amount) => {
        console.log(`Lizard go OuchieWawa x${amount}`);
        if(damageCooldown < 1){
            lizard.hurtSFX.play();
            lizardHead.anims.play({key: "Damage", repeat: 2});
            lizardHead.anims.nextAnim = "Nuetral";
            damageCooldown = 60;
            lizard.health --;
            scene.emitter.emit("lizardHurt");
            if(lizard.health < 1){
                lizard.die();
            } 
        }
        
    }
    //this is a little stupid but I think it's easier to make the pirahna call the .damage function on any part of the lizard it hits, I want to avoid hard-coding the scene's lizard instance into the pirahna's code in case I ever plan on making a co-op mode with multiple lizards that manage their own seperate health, this way I also can make different body parts have different levels of being vulnerable
    lizardButt.damage = (amount) => {
        lizard.damage(amount);
    }
    lizardHead.damage = (amount) => {
        lizard.damage(amount);
    }
    lizard.update = (time, delta) => {
        damageCooldown--;
        thrustCooldownTimer++;
        if(stickyConstraint && stickyConstraint.type === "constraint"){
            //we've verified the constraint isn't null and is indeed a constraint, because we can't remove a constraint that doesn't exist
            const breakAwayDistance = 40;
            const xDifference = Math.abs(stickyConstraint.bodyA.position.x - stickyConstraint.bodyB.position.x);
            const yDifference = Math.abs(stickyConstraint.bodyA.position.y - stickyConstraint.bodyB.position.y);
            if((xDifference > breakAwayDistance || yDifference > breakAwayDistance) && lizard.isMoving){
                lizard.sticking.isSticking = false;
                scene.matter.world.removeConstraint(stickyConstraint);
            } else {
                lizard.breakingInformation = `X: ${xDifference} Y: ${yDifference}`;
            }
            if(lizard.isMoving){
                stickyConstraint.stiffness = stickyVectorStrengthNotIdling;
            } else {
                stickyConstraint.stiffness = stickyVectorStrengthIdling;
            }
            
        }
        //draw the lizard body
        
    //scene.graphics.fillStyle(0x00aa00);
     scene.graphics.setDepth(0);
     const lizardThiccness = 16;
     let lineWidth = lizardThiccness;
     scene.graphics.lineStyle(lineWidth,lizardBodyImages.color,1);
     scene.lizardBody = new Phaser.Curves.Spline([
        lizard.getCenter(),
        lizardButt.getCenter(),
        new Phaser.Math.Vector2(lizardTail1.position.x,lizardTail1.position.y),
        new Phaser.Math.Vector2(lizardTail2.position.x,lizardTail2.position.y),
        new Phaser.Math.Vector2(lizardTail3.position.x,lizardTail3.position.y),
        new Phaser.Math.Vector2(lizardTail4.position.x,lizardTail4.position.y)]
     );
     const bodyPoints = scene.lizardBody.getSpacedPoints(30);
     
     for (let i = 1; i <= bodyPoints.length - 2; i++){
        scene.graphics.strokeLineShape(new Phaser.Geom.Line(bodyPoints[i -1].x, bodyPoints[i-1].y, bodyPoints[i+1].x,bodyPoints[i+1].y));
        if(i > bodyPoints.length - lizardThiccness){
            lineWidth--;
            scene.graphics.lineStyle(lineWidth,lizardBodyImages.color,1);
        }
     }
     //rotate the lizard's head so it is facing the right way
     getAngle = (obj1, obj2) => {
    // angle in radians
    var angleRadians = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    // angle in degrees
    var angleDeg = (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 180 / Math.PI);
    return angleDeg;
    }
     const lizardHeadAngle = getAngle(lizardButt,lizard);
     lizardHead.setAngle(lizardHeadAngle);
     //Auto-Aim assist
     //Detect enemies in line of sight
        ray.setAngleDeg(lizardHeadAngle);
        ray.setOrigin(lizardHead.x,lizardHead.y);
        const findings = ray.castCone();
        //const findings = [];
        //calculate the nearest enemy
        let closestDistance = 0;
        let closestObject;
        findings.forEach((finding)=> {
            //wow a real world use for the pythagorean theorem! Glad I stayed in school
            const coords = finding.segment;
            const thisDistance = Phaser.Math.Between(coords.x1,coords.y1,coords.x2,coords.y2);
            if (closestDistance === 0 || thisDistance < closestDistance){
                closestDistance = thisDistance;
                closestObject = finding.object;
            }
        })
        //console.log(closestObject);
        if(closestObject && closestObject.body){
            const angleBetween = Phaser.Math.Angle.Between(lizardHead.x, lizardHead.y, closestObject.body.position.x, closestObject.body.position.y);
            //console.log(angleBetween);
            lizardHead.rotation = angleBetween ;
        }
        
     frontLeg.setPosition(lizard.x,lizard.y);
     backLeg.setPosition(lizardButt.x,lizardButt.y);
    //scene.lizardBody.draw(scene.graphics);

    lizard.stickingBuffer ++; //this little sticking buffer ensures that the lizard stops sticking to the wall if they're not touching the wall, but gives a few frames of buffer to stop the lizard from constantly sticking/unsticking and becoming frustrating to control
    if(lizard.stickingBuffer > lizard.maxStickingBuffer){
        //lizard.sticking.isSticking = false;
    }
    const lizardFlipped = lizard.x > lizardButt.x;
    if( lizard.sticking.isSticking){
        const stickingAmount = 0.003;

        const stickingVector = new Phaser.Math.Vector2(lizard.sticking.x * stickingAmount, lizard.sticking.y * stickingAmount);
      //lizard.applyForce(stickingVector);
      lizardButt.applyForce(stickingVector);
      //try to keep the lizard's legs facing towards the wall it is sticking to
      if(lizard.sticking.y < 0 && Math.abs(lizard.sticking.y) > Math.abs(lizard.sticking.x)){
        if(lizardFlipped){
            frontLeg.setAngle(0);
            backLeg.setAngle(0);
            lizard.setVerticalFlip(true);
            lizard.setHorizontalFlip(true);
            
            
        } else {
            
            frontLeg.setAngle(180);
            backLeg.setAngle(180);
            lizard.setVerticalFlip(false);
            lizard.setHorizontalFlip(true);
        }
      } else if (lizard.sticking.y > 0 && Math.abs(lizard.sticking.y) > Math.abs(lizard.sticking.x)){
        if(lizardFlipped){
            frontLeg.setAngle(180);
            backLeg.setAngle(180);
            lizard.setVerticalFlip(true);
            lizard.setHorizontalFlip(false);
            
        } else {
            frontLeg.setAngle(0);
            backLeg.setAngle(0);
            lizard.setVerticalFlip(false);
            lizard.setHorizontalFlip(false);
        }
      } else if (lizard.sticking.x > 0){
        if(lizard.y > lizardButt.y){
            frontLeg.setAngle(270);
            backLeg.setAngle(270);
            lizard.setVerticalFlip(false);
            lizard.setHorizontalFlip(false);
        } else {
            frontLeg.setAngle(90);
            backLeg.setAngle(90);
            lizard.setVerticalFlip(true);
            lizard.setHorizontalFlip(false);
        }
        
      } else if (lizard.sticking.x < 0){
        if(lizard.y > lizardButt.y){
            frontLeg.setAngle(270);
            backLeg.setAngle(270);
            lizard.setVerticalFlip(true);
            lizard.setHorizontalFlip(false);
        } else {
            frontLeg.setAngle(90);
            backLeg.setAngle(90);
            lizard.setVerticalFlip(false);
            lizard.setHorizontalFlip(false);
        }
        
      }
      
    } else {
        //try to keep the legs always facing towards the bottom
        lizard.setHorizontalFlip(false);
        if(lizardFlipped){
            lizard.setVerticalFlip(true);
            
        } else {
            lizard.setVerticalFlip(false);
        }
    }
    if(!lizard.isMoving){
        frontLeg.play("Idle");
        backLeg.play("Idle");
    }
    }
    scene.matter.world.on("beforeupdate", ()=>{
    
        movingBuffer++;
        lizard.isMoving = movingBuffer < 2;
    })
    scene.matter.world.on("afterupdate", lizard.update);
    lizard.draw = () => {
        
    }
    
    return lizard;
}

