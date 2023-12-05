const createHUD = (scene, lizard) => {
    const healthText = scene.add.text(50,20,"Health", {fontSize:"30px"}).setScrollFactor(0,0);
    const oxygenText = scene.add.text(50,60, "Oxygen", {fontSize:"30px"}).setScrollFactor(0,0);
    scene.add.sprite(30,30,"icons",3).setScrollFactor(0,0);
    scene.add.sprite(30,70,"icons",2).setScrollFactor(0,0);
    scene.matter.world.on("afterupdate",()=>{
        healthText.text = `${lizard.health}`;
        oxygenText.text = `${Math.floor(lizard.oxygen)}`;
    })

}