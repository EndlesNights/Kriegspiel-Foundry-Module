const MODULE_ID = "kriegspielSupportModule";
import {kriegDice} from "./scripts/dice.js";
import {libWrapper} from './scripts/shim.js';

Hooks.once("init", async function() {
    game.KriegDice = kriegDice;

    //Adds options for GM drawingst to be placed as automaticly hidden
    game.settings.register( MODULE_ID, "hiddenGMDrawings",{
        name: "Hidden GM Drawings",
        hint: "Automaticly Hide GM Drawings",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
    });


    //Adds options for GM drawingst to be placed as automaticly hidden
    game.settings.register( MODULE_ID, "limitedPlayerDrawingsVission",{
        name: "Limited Player Drawing Vission",
        hint: "When on, players will be unable to see other player drawings",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });

    //Limit players vission of other players drawings by overriding the Drawing.prototype._refresh()
    libWrapper.register(
        MODULE_ID,
        "Drawing.prototype._refresh",
        _drawingRefresh
    );

});

/**
 * Option to limit players vission of other players drawings by overriding the Drawing.prototype._refresh()
 * @param {method} wrapped Drawing.prototype._refresh
 * @param {object} options  
 * @returns 
 */
function _drawingRefresh(wrapped, options){
    wrapped(options);
    if(!game.settings.get(MODULE_ID, "limitedPlayerDrawingsVission")) return;
    if(this.document.author.isGM) return;
    this.visible = (this.document.author.id === game.user.id || game.user.isGM);
    return;
}

Hooks.on('preCreateDrawing', (drawing) => {
    if(game.user.isGM && game.settings.get(MODULE_ID, "hiddenGMDrawings")){
        drawing.updateSource({hidden: true});
    }  
});

Hooks.on('getSceneControlButtons', (controls) => {
    if (game.user.isGM){
        addHiddenDrawingsButton(controls)
    }
});

Hooks.on('updateSetting', (settings) => {
    //soft refresh all the drawing on the page when the setting updates so that the entire page and all other objects do not need to be reloaded
    if(settings.key = `${MODULE_ID}.limitedPlayerDrawingsVission`){
        for(const d of canvas.drawings.placeables){
            d._refresh();
        }

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
            active: game.settings.get(MODULE_ID, "hiddenGMDrawings"),
            visible: game.user.isGM,
            onClick: toggleHiddenDrawingsButton,
            layer: control.layer,
            activeTool: "drawings"
        })
    });
}

function toggleHiddenDrawingsButton(){
    game.settings.set(MODULE_ID, "hiddenGMDrawings", !game.settings.get(MODULE_ID, "hiddenGMDrawings"));
}
