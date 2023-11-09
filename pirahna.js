const createPirahna = (scene, x, y) => {
    const notDrowningForce = new Phaser.Math.Vector2(0,-0.0017)
    const pirahna = scene.matter.add.sprite(x,y,"pirahna",0,{shape: "circle", circleRadius: 25, ignoreGravity: true, frictionAir: 0.1});
    pirahna.anims.createFromAseprite('pirahna');
    pirahna.anims.play({key:"Swim", repeat: -1});
    const light = scene.lights.addLight(0,0,150).setColor(0x36b5f5).setIntensity(3);
    scene.matter.world.on("afterupdate",()=>{
        pirahna.applyForce(notDrowningForce);
        light.x = pirahna.x;
        light.y = pirahna.y;
    })
    return pirahna;
}