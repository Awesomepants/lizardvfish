const createJelly = (scene, x, y, ceiling, floor) => {
    let ascending = false;
    const jellySprite = scene.matter.add.image(x,y,"jellyHead").setDepth(1);
    const jellyLight = scene.lights.addLight(0,0,500).setColor(0x3afffb).setIntensity(4);
    const Bodies = Phaser.Physics.Matter.Matter.Bodies;
    const tentacleRoot = Bodies.circle(x - 20,y,10);
    const tentacleRoot2 = Bodies.circle(x + 20, y, 10);
    const jellyHead = Bodies.circle(x,y,20);
    jellySprite.setExistingBody(jellyHead);
    jellySprite.setFrictionAir(0.1);
    function createTentacle(root, xOffset){
        const rootX = root.position.x + xOffset;
        const rootY = root.position.y;
        let tentacle1 = [root];
    for (i = 1;i<5;i++){
        const tentacleSeg = scene.matter.add.circle(rootX,rootY+(i*30),10, {frictionAir: 0.05, ignoreGravity: false, onCollideCallback: provideDamage});
        tentacle1.push(tentacleSeg);
        if(tentacle1[i - 1]){
            scene.matter.add.constraint(tentacle1[i-1],tentacle1[i], 30, 0.05);
            
        } else {
            console.log("unrestrainted" + i);
        }
        
        
    }
    return tentacle1;
    }
    const tentacles = [createTentacle(jellyHead, -20), createTentacle(jellyHead, 0), createTentacle(jellyHead, 20)]
    const tentacleFirst = tentacles[0];
    scene.matter.world.on("afterupdate", ()=>{
    scene.graphics.lineStyle(4,0x3afffb);
    tentacles.forEach((tentacle, tIndex) => {
        let segmentArray = [];
        tentacle.forEach((segment, sIndex) => {
            segmentArray.push({x: segment.position.x + (((tIndex + sIndex) % 2) * 3), y: segment.position.y});
        })
        tentacleShape = new Phaser.Curves.Spline(segmentArray);
        tentacleShape.draw(scene.graphics);
    })
    jellyLight.x = jellySprite.x;
    jellyLight.y = jellySprite.y;
    if(jellySprite.y > floor){
        ascending = true;
    } else if (jellySprite.y < ceiling){
        ascending = false;
    }
    if(ascending){
        jellySprite.applyForce({x:0, y: -0.005});
    }
    })
    
};