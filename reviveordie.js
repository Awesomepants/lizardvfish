const restart = (scene) => {

        PokiSDK.commercialBreak(() => {
          console.log("commercial");
          scene.scene.pause("levelGenerator");
          game.sound.mute = true;
        }).then(() => {
          console.log("commercial over");
          scene.scene.resume("levelGenerator");
          game.sound.mute = false;
        })
        scene.scene.start("levelGenerator", { map: this.map });
}
const reviveordie = (scene) => {
    console.log("the lizard died")
    PokiSDK.gameplayStop();
    if(scene.reviveused){
        restart(scene)
    } else {
        console.log("adding the text");
        const text = scene.add.text(240,200,"Watch video to revive?", {fontFamily: 'Arial', fontSize: '50px', backgroundColor: '#5f2f45 ', padding: {x: 10, y: 10}});
        text.setDepth(2);
        text.scrollFactorX = 0;
        text.scrollFactorY = 0;
        const dieButton = scene.add.sprite(350,400,"icons").setDepth(2).setScale(4);
        dieButton.anims.createFromAseprite("icons");
        dieButton.anims.play("Death");
        dieButton.scrollFactorX = 0;
        dieButton.scrollFactorY = 0;
        const liveButton = scene.add.sprite(600,400,"icons").setDepth(2).setScale(4);
        liveButton.scrollFactorX = 0;
        liveButton.scrollFactorY = 0;
        dieButton.setInteractive();
        dieButton.on('pointerdown', restart);
        liveButton.setInteractive();
        const elementsToDestroy = [text, dieButton, liveButton]
        liveButton.on('pointerdown',()=>{
            PokiSDK.rewardedBreak(()=>{
                game.sound.mute = true;
            }).then((success) => {
                game.sound.mute = false;
                if(success){
                    scene.reviveused = true;
                    scene.lizardHead.dead = false;
                    scene.lizardHead.bodyParts.head.anims.play("Nuetral");
                    scene.lizardHead.health = 4;
                    scene.lizardHead.oxygen = 100;
                    elementsToDestroy.forEach((element)=>{
                        element.destroy();
                    })
                } else {
                    restart(scene);
                }
            })
        })
    }
    }
