function createLizard(scene){
    
    scene.lizardHead = scene.matter.add.sprite(420, 100, 'bodySegment', 0, {shape:'circle', friction: 0, restitution: 0.6});
    scene.lizardTail = scene.matter.add.sprite(400, 200, 'lizardTail', 0, { shape: 'circle', friction: 0, restitution: 0.6 });
    //scene.lizardHead.setCircle();
    scene.matter.add.constraint(scene.lizardHead, scene.lizardTail, 40, 0.2);
    scene.lizardTail2 = scene.matter.add.circle(380,200,10);
    scene.matter.add.constraint(scene.lizardTail, scene.lizardTail2, 40, 0.8);
    scene.lizardTail3 = scene.matter.add.circle(360,200,5);
    scene.matter.add.constraint(scene.lizardTail2, scene.lizardTail3, 40, 0.8);
    console.log(scene.lizardTail2);
    scene.lizardHead.anims.createFromAseprite("bodySegment");
    scene.lizardTail.anims.createFromAseprite("bodySegment");

    
    scene.lizardHead.setFrictionAir(0.02);
    scene.lizardHead.verticalFlip = false;
    scene.lizardHead.horizontalFlip = false;
    scene.lizardHead.setVerticalFlip = (input) => {
        if(input){
            scene.lizardHead.flipY = true;
            scene.lizardTail.flipY = true;
        } else {
            scene.lizardHead.flipY = false;
            scene.lizardTail.flipY = false;
        }
    }
    scene.lizardHead.setHorizontalFlip = (input) => {
        if(input){
            scene.lizardHead.flipX = true;
            scene.lizardTail.flipX = true;
        } else {
            scene.lizardHead.flipX = false;
            scene.lizardTail.flipX = false;
        }

    }
    scene.lizardTail.setFrictionAir(0.04);
    scene.lizardHead.body.label = "lizardHead";
    scene.lizardHead.sticking = {isSticking:false, x:0, y:0};
    scene.graphics = scene.add.graphics();
    scene.lizardBody;
    scene.matter.add.mouseSpring();
    scene.moveLizard = (x,y) => {
        scene.lizardHead.isMoving = true;
        let force = 0.0005;
        if(scene.lizardHead.sticking.isSticking){
            force = 0.002;
            if(scene.lizardHead.anims.currentAnim.key != "Crawl"){
                scene.lizardHead.play({key:"Crawl", repeat: -1});
                scene.lizardTail.play({key:"Crawl", repeat: -1, startFrame: 4});
            }
            
        } else if (scene.lizardHead.anims.currentAnim.key != "Swim"){
            scene.lizardHead.play({key:"Swim", repeat:-1});
            scene.lizardTail.play({key:"Swim", repeat:-1, startFrame: 4});
        }
        scene.lizardHead.applyForce(new Phaser.Math.Vector2(x*force,y*force));
        let lizardVelocity = scene.lizardHead.getVelocity();
        if(!scene.lizardHead.sticking.isSticking){
            let lizardAngle = Math.atan2(lizardVelocity.y, lizardVelocity.x);
            scene.lizardHead.setAngle(Phaser.Math.RadToDeg(lizardAngle) + 180);
            lizardAngle = Math.atan2(lizardVelocity.y, lizardVelocity.x);
            scene.lizardTail.setAngle(Phaser.Math.RadToDeg(lizardAngle) + 180);
        }
        
        
    }
    
    scene.matter.world.on("collisionend",(e,o1,o2) => {
        if(o1.label === "lizardHead" || o2.label === "lizardHead"){
            scene.lizardHead.sticking.isSticking = false;
        }
    })
    scene.matter.world.on("collisionactive",(e,o1,o2) => {
        if(o1.label === "lizardHead" || o2.label === "lizardHead"){
            const collisionNormal = e.pairs[0].collision.normal;
            scene.lizardHead.sticking.isSticking = true;
            scene.lizardHead.sticking.x=collisionNormal.x;
            scene.lizardHead.sticking.y=collisionNormal.y;
        }
    })

}

function updateLizard(scene){
    
    //draw the lizard body
    scene.graphics.clear();
    scene.graphics.fillStyle(0x00aa00);
     scene.graphics.setDepth(-1);
     let lineWidth = 20;
     scene.graphics.lineStyle(lineWidth,0x1f4b43,1);
     scene.lizardBody = new Phaser.Curves.Spline([
        scene.lizardHead.getCenter(),
        scene.lizardTail.getCenter(),
        new Phaser.Math.Vector2(scene.lizardTail2.position.x,scene.lizardTail2.position.y),
        new Phaser.Math.Vector2(scene.lizardTail3.position.x,scene.lizardTail3.position.y)]
     );
     const bodyPoints = scene.lizardBody.getSpacedPoints(30);
     
     for (let i = 1; i <= bodyPoints.length - 2; i++){
        scene.graphics.strokeLineShape(new Phaser.Geom.Line(bodyPoints[i -1].x, bodyPoints[i-1].y, bodyPoints[i+1].x,bodyPoints[i+1].y));
        if(i > bodyPoints.length - 20){
            lineWidth--;
            scene.graphics.lineStyle(lineWidth,0x1f4b43,1);
        }
     }
    //scene.lizardBody.draw(scene.graphics);


    //apply the "sticking" force for the lizard
    const lizardFlipped = scene.lizardHead.x > scene.lizardTail.x;
    if(scene.lizardHead.sticking.isSticking){
        const stickingAmount = 0.001;
        const stickingVector = new Phaser.Math.Vector2(scene.lizardHead.sticking.x * stickingAmount, scene.lizardHead.sticking.y * stickingAmount);
      scene.lizardHead.applyForce(stickingVector);
      scene.lizardTail.applyForce(stickingVector);
      //try to keep the lizard's legs facing towards the wall it is sticking to
      if(scene.lizardHead.sticking.y === -1){
        if(lizardFlipped){
            scene.lizardHead.setAngle(0);
            scene.lizardTail.setAngle(0);
            scene.lizardHead.setVerticalFlip(true);
            scene.lizardHead.setHorizontalFlip(true);
            //scene.lizardTail.flipX = false;
            //console.log("thisContext");
            
        } else {
            
            scene.lizardHead.setAngle(180);
            scene.lizardTail.setAngle(0);
            scene.lizardHead.setVerticalFlip(false);
            scene.lizardHead.setHorizontalFlip(true);
        }
      } else if (scene.lizardHead.sticking.y === 1){
        if(lizardFlipped){
            scene.lizardHead.setAngle(180);
            scene.lizardTail.setAngle(180);
            scene.lizardHead.setVerticalFlip(true);
            scene.lizardHead.setHorizontalFlip(false);
            
        } else {
            scene.lizardHead.setAngle(0);
            scene.lizardTail.setAngle(0);
            scene.lizardHead.setVerticalFlip(false);
            scene.lizardHead.setHorizontalFlip(false);
        }
      } else if (scene.lizardHead.sticking.x === 1){
        if(scene.lizardHead.y > scene.lizardTail.y){
            scene.lizardHead.setAngle(270);
            scene.lizardTail.setAngle(270);
            scene.lizardHead.setVerticalFlip(false);
            scene.lizardHead.setHorizontalFlip(false);
        } else {
            scene.lizardHead.setAngle(90);
            scene.lizardTail.setAngle(90);
            scene.lizardHead.setVerticalFlip(true);
            scene.lizardHead.setHorizontalFlip(false);
        }
        
      } else if (scene.lizardHead.sticking.x === -1){
        if(scene.lizardHead.y > scene.lizardTail.y){
            scene.lizardHead.setAngle(270);
            scene.lizardTail.setAngle(270);
            scene.lizardHead.setVerticalFlip(true);
            scene.lizardHead.setHorizontalFlip(false);
        } else {
            scene.lizardHead.setAngle(90);
            scene.lizardTail.setAngle(90);
            scene.lizardHead.setVerticalFlip(false);
            scene.lizardHead.setHorizontalFlip(false);
        }
        
      }
      
    } else {
        //try to keep the legs always facing towards the bottom
        scene.lizardHead.setHorizontalFlip(false);
        if(lizardFlipped){
            scene.lizardHead.setVerticalFlip(true);
            
        } else {
            scene.lizardHead.setVerticalFlip(false);
        }
    }
    if(!scene.lizardHead.isMoving){
        console.log("idling...")
        scene.lizardHead.play("Idle");
        scene.lizardTail.play("Idle");
    }
}