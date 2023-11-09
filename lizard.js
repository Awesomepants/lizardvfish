function createLizard(scene, x, y){
    let movingBuffer = 0;
    let lizard;
    let lizardButt;
    let stickyConstraint;
    let stuckTile;
    const attackThrustAmount = 0.4;
    const thrustCooldown = 60;
    let thrustCooldownTimer = 0;
    const stickyVectorStrength = 0.014;
    const stickyVectorStrengthIdling = 0.014;
    lizardHead = scene.matter.add.sprite(x+20,y, 'head', 0, {isSensor: true, frictionAir:0.1, mass: 0, inverseMass: 0, ignoreGravity: true});
    lizard = scene.matter.add.sprite(x, y, 'bodySegment', 0, {slop: 2, shape:'circle', restitution: 0, friction: 0, density: 0.003, frictionStatic: 0, frictionAir: 0.1});
    lizardButt = scene.matter.add.sprite(x - 40, y, 'bodySegment', 0, {slop: 2, shape: 'circle', friction: 0, restitution: 0, density: 0.001, frictionAir: 0.1});
    scene.matter.add.constraint(lizard, lizardButt, 40, 0.9);
    scene.matter.add.constraint(lizardHead, lizard, 5, 0.9);
    const tailPhysicsConfig = {friction: 0, density: 0.0001, frictionAir: 0.09}
    const lizardTail1 = scene.matter.add.circle(x - 60,y,2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail1, lizardButt, 15, 0.9);
    const lizardTail2 = scene.matter.add.circle(x-80,y,4, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail1, lizardTail2, 15, 0.9);
    const lizardTail3 = scene.matter.add.circle(x-100,y,2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail2, lizardTail3, 15, 0.9);
    const lizardTail4 = scene.matter.add.circle(x-120,y, 2, tailPhysicsConfig);
    scene.matter.add.constraint(lizardTail3, lizardTail4, 15, 0.9);
    const frontLeg = scene.add.sprite(x,y,'legs').setDepth(1);
    const backLeg = scene.add.sprite(x,y,'legs').setDepth(1);
    frontLeg.anims.createFromAseprite("legs");
    backLeg.anims.createFromAseprite("legs");
    lizardHead.anims.createFromAseprite("head");

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
    scene.lizardBody;
    scene.matter.add.mouseSpring();
    lizard.moveLizard = (x,y) => {
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
    lizard.attack = () => {
        if(thrustCooldownTimer > thrustCooldown){
            lizardHead.thrust(attackThrustAmount);
            lizardHead.anims.play("Attack");
            lizardHead.anims.nextAnim = "Nuetral";
            thrustCooldownTimer = 0;
        }
        
    }
    
    scene.matter.world.on("collisionstart",(e,o1,o2) => { 
        
        if((o1.label === "lizardHead" && o2.label === "Rectangle Body") || (o2.label === "lizardHead" && o1.label === "Rectangle Body")){
            if(o2.label === "Rectangle Body"){
                stuckTile = o2;
            } else if (o1.label === "Rectangle Body"){
                stuckTile = o1;
            }
            const collisionNormal = e.pairs[0].collision.normal;
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
                        console.log("Creating sticky constraint");
                        scene.matter.world.removeConstraint(stickyConstraint);
                        stickyConstraint = scene.matter.add.constraint(o1,o2,30,stickyVectorStrength);
                    }
                    
                }
                
            } else {
                //this will be called the first time the lizard collides with the wall, when stickyConstraint is undefined
                    stickyConstraint = scene.matter.add.constraint(o1,o2,30,stickyVectorStrength);
                    console.log("creating sticky constraint from the else");
            }
            
            

            
        }
    })
    lizard.update = (time, delta) => {
        thrustCooldownTimer++;
        if(stickyConstraint && stickyConstraint.type === "constraint"){
            //we've verified the constraint isn't null and is indeed a constraint, because we can't remove a constraint that doesn't exist
            const breakAwayDistance = 60;
            const xDifference = Math.abs(stickyConstraint.bodyA.position.x - stickyConstraint.bodyB.position.x);
            const yDifference = Math.abs(stickyConstraint.bodyA.position.y - stickyConstraint.bodyB.position.y);
            if((xDifference > breakAwayDistance || yDifference > breakAwayDistance) && lizard.isMoving){
                lizard.sticking.isSticking = false;
                scene.matter.world.removeConstraint(stickyConstraint);
            }
            
            
        }
        //draw the lizard body
    scene.graphics.clear();
    scene.graphics.fillStyle(0x00aa00);
     scene.graphics.setDepth(0);
     const lizardThiccness = 16;
     let lineWidth = lizardThiccness;
     scene.graphics.lineStyle(lineWidth,0x3d824e,1);
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
            scene.graphics.lineStyle(lineWidth,0x3d824e,1);
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
     //frontLeg.setAngle(lizardHeadAngle);
     //backLeg.setAngle(lizardHeadAngle);
     frontLeg.setPosition(lizard.x,lizard.y);
     backLeg.setPosition(lizardButt.x,lizardButt.y);
    //scene.lizardBody.draw(scene.graphics);

    lizard.stickingBuffer ++; //this little sticking buffer ensures that the lizard stops sticking to the wall if they're not touching the wall, but gives a few frames of buffer to stop the lizard from constantly sticking/unsticking and becoming frustrating to control
    if(lizard.stickingBuffer > lizard.maxStickingBuffer){
        //lizard.sticking.isSticking = false;
    }
    //apply the "sticking" force for the lizard
    
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

