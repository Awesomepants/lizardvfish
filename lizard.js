function createLizard(scene){
    scene.lizardHead = scene.matter.add.image(420, 100, 'lizardHead', null, { shape: 'circle', friction: 0, restitution: 0.6 });
    scene.lizardTail = scene.matter.add.image(400, 200, 'lizardTail', null, { shape: 'circle', friction: 0, restitution: 0.6 });
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
            scene.lizardTail.flipY = true;
        } else {
            scene.lizardHead.flipX = false;
            scene.lizardTail.flipX = false;
        }

    }
    scene.lizardTail.setFrictionAir(0.04);
    scene.lizardHead.body.label = "lizardHead";
    scene.lizardHead.sticking = {isSticking:false, x:0, y:0};
    scene.graphics = scene.add.graphics();
    scene.lizardBody = new Phaser.Geom.Line(
       scene.lizardHead.x,
       scene.lizardHead.y,
       scene.lizardTail.x,
       scene.lizardTail.y
    );//new Phaser.Geom.Polygon(scene, [[scene.lizardHead.getTopCenter().x,scene.lizardHead.getTopCenter().y],[scene.lizardTail.getTopCenter().x,scene.lizardTail.getTopCenter().y],/*tip of tail*/[scene.lizardTail.getBottomCenter().x,scene.lizardTail.getBottomCenter.y],[scene.lizardHead.getTopCenter.x,scene.lizardHead.getTopCenter.y]])
    scene.matter.add.constraint(scene.lizardHead, scene.lizardTail, 40, 0.2);
    scene.matter.add.mouseSpring();
    scene.moveLizard = (x,y) => {
        let force = 0.0005;
        if(scene.lizardHead.sticking.isSticking){
            force = 0.002;
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
            //console.log("lizardHead lifted");
            scene.lizardHead.sticking.isSticking = false;
        }
    })
    scene.matter.world.on("collisionactive",(e,o1,o2) => {
        if(o1.label === "lizardHead" || o2.label === "lizardHead"){
            //console.log("lizardHead is touching");
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
    scene.lizardBody.setTo(
            scene.lizardHead.x,
            scene.lizardHead.y,
            scene.lizardTail.x,
            scene.lizardTail.y
         
     );
     scene.graphics.setDepth(-1);
     scene.graphics.lineStyle(20,0x00000,1);
    scene.graphics.strokeLineShape(scene.lizardBody);

    //console.log(scene.lizardHead.getTopCenter());

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
            console.log("flipped");
            scene.lizardHead.setHorizontalFlip(true);
            
        } else {
            scene.lizardHead.setAngle(180);
            scene.lizardTail.setAngle(0);
            scene.lizardHead.setVerticalFlip(false);
            console.log("notflipped");
            scene.lizardHead.setHorizontalFlip(true);
        }
      } else if (scene.lizardHead.sticking.y === 1){
        if(lizardFlipped){
            scene.lizardHead.setAngle(180);
            scene.lizardTail.setAngle(180);
            scene.lizardHead.setVerticalFlip(true);
            console.log("flipped");
            scene.lizardHead.setHorizontalFlip(false);
            
        } else {
            scene.lizardHead.setAngle(0);
            scene.lizardTail.setAngle(0);
            scene.lizardHead.setVerticalFlip(false);
            console.log("notflipped");
            scene.lizardHead.setHorizontalFlip(false);
        }
      } else if (scene.lizardHead.sticking.x === 1){
        if(scene.lizardHead.y > scene.lizardTail.y){
            scene.lizardHead.setAngle(270);
            scene.lizardTail.setAngle(270);
            scene.lizardHead.setVerticalFlip(false);
            console.log("flipped");
            scene.lizardHead.setHorizontalFlip(false);
        } else {
            scene.lizardHead.setAngle(90);
            scene.lizardTail.setAngle(90);
            scene.lizardHead.setVerticalFlip(true);
            console.log("not flipped");
            scene.lizardHead.setHorizontalFlip(false);
        }
        
      } else if (scene.lizardHead.sticking.x === -1){
        if(scene.lizardHead.y > scene.lizardTail.y){
            scene.lizardHead.setAngle(270);
            scene.lizardTail.setAngle(270);
            scene.lizardHead.setVerticalFlip(true);
            console.log("flipped");
            scene.lizardHead.setHorizontalFlip(false);
        } else {
            scene.lizardHead.setAngle(90);
            scene.lizardTail.setAngle(90);
            scene.lizardHead.setVerticalFlip(false);
            console.log("not flipped");
            scene.lizardHead.setHorizontalFlip(false);
        }
        
      }
      
    } else {
        //try to keep the legs always facing towards the bottom
        if(lizardFlipped){
            scene.lizardHead.setVerticalFlip(true);
            
        } else {
            scene.lizardHead.setVerticalFlip(false);
        }
    }
}