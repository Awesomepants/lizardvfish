const createPirahna = (scene, x, y) => {
    const notDrowningForce = new Phaser.Math.Vector2(0,-0.0017)
    const pirahna = scene.matter.add.sprite(x,y,"pirahna",0,{shape: "circle", circleRadius: 25, ignoreGravity: true, frictionAir: 0.1});
    pirahna.anims.createFromAseprite('pirahna');
    pirahna.anims.play({key:"Swim", repeat: -1});
    scene.matter.world.on("afterupdate",()=>{
        pirahna.applyForce(notDrowningForce);
    })
    return pirahna;
}