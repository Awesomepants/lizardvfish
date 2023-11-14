const createHUD = (scene, lizard) => {
    const healthText = scene.add.text(10,10,"Health").setScrollFactor(0,0);
    const oxygenText = scene.add.text(10,30, "Oxygen").setScrollFactor(0,0);
    scene.matter.world.on("afterupdate",()=>{
        healthText.text = `Health: ${lizard.health}`;
        oxygenText.text = `Oxygen: ${Math.floor(lizard.oxygen)}`;
    })
}