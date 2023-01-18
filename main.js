const MODULE_ID = "kriegspielSupportModule";

Hooks.once("init", async function() {
    game.settings.register( MODULE_ID, "hiddenDrawings",{
        name: "Hidden GM Drawings",
        hint: "Automaticly Hide GM Drawings",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
    });
});

Hooks.on('preCreateDrawing', (drawing) => {
    if(game.user.isGM && game.settings.get(MODULE_ID, "hiddenDrawings")){
        drawing.updateSource({hidden: true});
    }  
});

Hooks.on('getSceneControlButtons', (controls) => {
    if (game.user.isGM){
        addHiddenDrawingsButton(controls)
    }
});


function addHiddenDrawingsButton(controls){
    controls.forEach( control => {
        if(canvas && canvas.ready && control.layer === "drawings" && canvas.activeLayer.options.name === control.layer)
        control.tools.push({
            name: "hiddenDrawingToggle",
            title: "Hidden Drawings Toggle",
            icon: "fa-solid fa-user-secret", //icons/svg/cowled.svg
            toggle: true,
            active: game.settings.get(MODULE_ID, "hiddenDrawings"),
            visible: game.user.isGM,
            onClick: toggleHiddenDrawingsButton,
            layer: control.layer,
            activeTool: "drawings"
        })
    });
}

function toggleHiddenDrawingsButton(){
    console.log("button press");
    game.settings.set(MODULE_ID, "hiddenDrawings", !game.settings.get(MODULE_ID, "hiddenDrawings"));
}
