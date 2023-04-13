export const kriegDice = {};

kriegDice.src = "modules/kriegspielSupportModule/assets/dice/Face_";
kriegDice.imageContainer = ".webp";
kriegDice.nameArray = [
    "Hit & Disruption if Close Range",    //1
    "Hit Unless in Cover",                //2
    "Disruption if Close Range",          //3
    "Hit if Breechloader",                //4
    "Hit and Disruption if if Advantaged",//5
    "Hit or Own Route if Militia",        //6
    "Disruption if Close Range",          //7
    "Hit and Disruption if Advantaged",   //8
    "Disruption and hit Close Range",     //9
    "Disruption unless in Cover",         //10
    "Hit Unless Target in Cover",         //11
    "Hit if Breechloader",                //12
];
kriegDice.unrolledName = "UnRolled";

kriegDice.renderBasicSheet = _renderBasicSheet;
kriegDice.rollSelectedDice = _rollSelectedDice;
kriegDice.rollAllDice = _rollAllDice;
kriegDice.rollSelectedUnrolledDice = _rollSelectedUnrolledDice;
kriegDice.rollAllUnrolledDice = _rollAllUnrolledDice;
kriegDice.clearSelectDice = _clearSelectDice;
kriegDice.clearAllDice = _clearAllDice;

    async function _renderBasicSheet(){
        let dialogEditor = new Dialog({
            title: `Token Dice Roller`,
            content: `Note this will only effect tokens who's actor is named "DiceToken".`,
            buttons: {
                rollSelect: {
                    label: `Roll Selected`,
                    callback: () => {
                        _rollSelectedDice();
                        dialogEditor.render(true);
                    }
                },
                rollAll: {
                    label: `Roll All`,
                    callback: () => {

                        _rollAllDice();

                        dialogEditor.render(true);
                    }
                },
                rollSelectUnrolled: {
                    label: `Roll Selected Unrolled`,
                    callback: () => {
                        _rollSelectedUnrolledDice();
                        dialogEditor.render(true);
                    }
                },
                rollAllUnrolled: {
                    label: `Roll All Unrolled`,
                    callback: () => {
                        _rollAllUnrolledDice();
                        dialogEditor.render(true);
                    }
                },
                clearSelect: {
                    label: `Clear Select`,
                    callback: () => {
                        _clearSelectDice();
                        dialogEditor.render(true);
                    }
                },
                clearAll: {
                    label: `Clear All`,
                    callback: () => {
                        kriegDice._clearAllDice();
                        dialogEditor.render(true);
                    }
                }

            }
        });

        dialogEditor.render(true);
    }

    async function _rollSelectedDice(){
        for(const t of canvas.tokens.controlled){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }

            let r = new Roll("1d12");
            await r.evaluate({async: true});
            // r.toMessage();
            await t.document.update({
                "name": kriegDice.nameArray[r.total-1],
                "texture.src": kriegDice.src + r.total + kriegDice.imageContainer},
            );
        }
    }

    async function _rollAllDice(){
        for(const t of canvas.tokens.ownedTokens){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }

            let r = new Roll("1d12");
            await r.evaluate({async: true});
            // r.toMessage();
            await t.document.update({
                "name": kriegDice.nameArray[r.total-1],
                "texture.src": kriegDice.src + r.total + kriegDice.imageContainer
            });
        }
    }

    async function _rollSelectedUnrolledDice(){
        for(const t of canvas.tokens.controlled){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }


            if(t.document.texture.src !== kriegDice.src + "0" + kriegDice.imageContainer){
                continue;
            }

            let r = new Roll("1d12");
            await r.evaluate({async: true});
            // r.toMessage();
            await t.document.update({
                "name": kriegDice.nameArray[r.total-1],
                "texture.src": kriegDice.src + r.total + kriegDice.imageContainer
            });
        }
    }

    async function _rollAllUnrolledDice(){
        for(const t of canvas.tokens.ownedTokens){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }

            if(t.document.texture.src !== kriegDice.src + "0" + kriegDice.imageContainer){
                continue;
            }
            let r = new Roll("1d12");
            await r.evaluate({async: true});
            // r.toMessage();
            await t.document.update({
                "name": kriegDice.nameArray[r.total-1],
                "texture.src": kriegDice.src + r.total + kriegDice.imageContainer
            });
        }
    }

    async function _clearSelectDice(){
        for(const t of canvas.tokens.controlled){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }

            await t.document.update({
                "name": kriegDice.unrolledName,
                "texture.src": kriegDice.src + "0" + kriegDice.imageContainer});
        }
    }

    async function _clearAllDice(){
        for(const t of canvas.tokens.ownedTokens){
            if(!t.actor.name.toLowerCase().startsWith("dicetoken")){
                continue;
            }

            await t.document.update({
                "name": kriegDice.unrolledName,
                "texture.src": kriegDice.src + "0" + kriegDice.imageContainer
            });
        }
    }
