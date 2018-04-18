"use strict";

define([
        'ui/GameScreen'
    ],
    function(
        GameScreen
    ) {

        var GameAPI;
        var guiRenderer;
        var calcVec = new THREE.Vector3();
        var calcVec2 = new THREE.Vector3();

        var CombatStatusUiProcessor = function(gRenderer, gameApi) {
            GameAPI = gameApi;
            guiRenderer = gRenderer;
        };


        CombatStatusUiProcessor.prototype.show_aim_state_status = function(guiElement) {

            var activeSelection = GameAPI.getSelectionActivatedActor();

            if (activeSelection) {

                var controllerActor = GameAPI.getControlledActor();

                if (!controllerActor) {
                    return;
                }

                var state = controllerActor.piece.getPieceStateByStateId(guiElement.options.sample_state);

                var value = state.getValue();

                var axisFactors = guiElement.options.axis_factors;

                if (!guiElement.enabled) {
                    guiElement.enableGuiElement();
                }

                guiElement.origin.copy(activeSelection.piece.frustumCoords);
                GameScreen.fitView(guiElement.origin);

                var max_offset = 20;

                var distance = activeSelection.piece.cameraDistance;
                var offset = max_offset * Math.sqrt(Math.abs(value * 0.6)) * Math.abs(value) * 4;
                var factor = Math.clamp(offset / (distance), -0.25, 0.25);

                calcVec.z = 0;

                calcVec.x = factor * axisFactors[0];
                calcVec.y = factor * axisFactors[1];
                guiElement.applyElementPosition(0, calcVec);

                calcVec.x = -factor * axisFactors[0];
                calcVec.y = -factor * axisFactors[1];
                guiElement.applyElementPosition(1, calcVec);

            } else if (guiElement.enabled) {
                guiElement.disableGuiElement();
            }

        };



        CombatStatusUiProcessor.prototype.show_selection_corners = function(guiElement) {

            var activeSelection = GameAPI.getSelectedActor();

            if (activeSelection) {

                if (!activeSelection.piece.render) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }


                if (!guiElement.enabled) {
                    guiElement.enableGuiElement();
                }



                guiElement.origin.copy(activeSelection.piece.frustumCoords);
                GameScreen.fitView(guiElement.origin);

                var distance = activeSelection.piece.cameraDistance;
                var size = activeSelection.piece.boundingSize;

                var factor = Math.clamp(size / (distance), 0.03, 0.3);

                calcVec.z = 0;

                calcVec.x = factor;

                calcVec.y = factor;
                guiElement.applyElementPosition(0, calcVec);

                calcVec.x = 0;
                guiElement.applyElementPosition(6, calcVec);

                calcVec.x = -factor;
                guiElement.applyElementPosition(1, calcVec);

                calcVec.y = 0;
                guiElement.applyElementPosition(4, calcVec);

                calcVec.y = -factor;
                guiElement.applyElementPosition(2, calcVec);

                calcVec.x = 0;
                guiElement.applyElementPosition(7, calcVec);

                calcVec.x = factor;
                guiElement.applyElementPosition(3, calcVec);

                calcVec.y = 0;
                guiElement.applyElementPosition(5, calcVec);

            } else if (guiElement.enabled) {
                guiElement.disableGuiElement();
            }
        };


        CombatStatusUiProcessor.prototype.show_combat_status = function(guiElement) {

            var activeSelection = guiElement.getTarget();

            if (activeSelection) {

                if (activeSelection.piece.getPieceActivationState() < ENUMS.PieceActivationStates.ENGAGED) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                if (!activeSelection.piece.render) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                var combatStatus = activeSelection.piece.getCombatStatus();

                if (!combatStatus) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                var combatState = combatStatus.getDynamic('combat_state');

                if (!combatState || combatState === ENUMS.CombatStates.NONE || combatState === ENUMS.CombatStates.REMOVED) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                var factor = guiElement.options.offset_y;
                var displayName = activeSelection.id;

                var maxHealth = combatStatus.getDynamic('max_health');
                var health = combatStatus.getDynamic('health');

                var maxArmor = combatStatus.getDynamic('max_armor');
                var armor = combatStatus.getDynamic('armor');

                var stateElementId = guiElement.options.status_element_id;
                var healthElementId = guiElement.options.health_element_id;
                var armorElementId = guiElement.options.armor_element_id;

                var textElementId = guiElement.options.text_element_id;

                if (!guiElement.enabled) {

                    guiElement.enableGuiElement();

                    guiElement.spawnChildElement(stateElementId);

                    for (var i = 0; i < maxHealth; i++) {
                        guiElement.spawnChildElement(healthElementId);
                    }
                    for (i = 0; i < maxArmor; i++) {
                        guiElement.spawnChildElement(armorElementId);
                    }

                    for (i = 0; i < displayName.length; i++) {
                        guiElement.spawnChildElement(textElementId);
                    }

                    return;
                }

                guiElement.origin.copy(activeSelection.piece.frustumCoords);
                GameScreen.fitView(guiElement.origin);


                var rowHeight = 0;

                var width = 0;

                if (guiElement.children[healthElementId]) {
                    var spaceNeeded = 0;
                    if (guiElement.children[healthElementId].length) {
                        width = guiElement.children[healthElementId][0].options.step_x;
                        spaceNeeded += (maxHealth * width);
                        rowHeight = guiElement.children[healthElementId][0].options.step_y;
                    }
                }

                if (guiElement.children[armorElementId]) {
                    if (guiElement.children[armorElementId].length) {
                        spaceNeeded += (maxArmor * guiElement.children[armorElementId][0].options.step_x)
                    }
                }

                var rows = Math.floor(spaceNeeded / (Math.abs(guiElement.options.offset_children[0])*2));

                var padding = 0;

                if (spaceNeeded < Math.abs(guiElement.options.offset_children[0])) {
                    padding = width;
                }


                calcVec.z = 0;
                calcVec.x = 0;
                calcVec.y = factor - rows*rowHeight;
                guiElement.applyElementPosition(0, calcVec);
                guiElement.applyElementPosition(1, calcVec);

                calcVec.x = guiElement.options.offset_children[0];
                calcVec.y = guiElement.options.offset_children[1];

                var child;

                if (guiElement.children[stateElementId]) {
                    for (i = 0; i < guiElement.children[stateElementId].length; i++) {
                        child = guiElement.children[stateElementId][i];
                        calcVec2.z = 0;

                        calcVec2.x = child.options.offset_x;
                        calcVec2.y = child.options.offset_y;

                        var stateMap = child.options.state_map;

                        child.origin.copy(guiElement.position);

                        if (!stateMap[combatState]) {
                            console.log("No stateMap for Combat State", child, combatState, stateMap);
                            return;
                        }

                        child.setColorCurveKey(stateMap[combatState].color_curve);

                        var stateSprite = stateMap[combatState].sprite_id;

                        if (!stateSprite) {
                            console.log("Missing sprite for state: ", combatState, stateMap);
                        }

                        child.setSpriteKey(stateSprite);
                        child.applyElementPosition(null, calcVec2);
                    }
                }


                if (guiElement.children[healthElementId]) {
                    for (i = 0; i < guiElement.children[healthElementId].length; i++) {
                        calcVec.z = 0;
                        child = guiElement.children[healthElementId][i];
                        child.origin.copy(guiElement.position);
                        child.applyElementPosition(0, calcVec);

                        if (i < health) {
                            child.applyElementPosition(1, calcVec);
                        } else {
                            calcVec.z = 99;
                            child.applyElementPosition(1, calcVec);
                        }

                        calcVec.x += child.options.step_x+padding;
                        if (calcVec.x > Math.abs(guiElement.options.offset_children[0])) {
                            calcVec.x = guiElement.options.offset_children[0];
                            calcVec.y += child.options.step_y;
                        }
                    }
                }

                if (guiElement.children[armorElementId]) {

                    calcVec.x += 0.003;

                    for (i = 0; i < guiElement.children[armorElementId].length; i++) {
                        calcVec.z = 0;
                        child = guiElement.children[armorElementId][i];
                        child.origin.copy(guiElement.position);
                        child.applyElementPosition(0, calcVec);

                        if (i < armor) {
                            child.applyElementPosition(1, calcVec);
                        } else {
                            calcVec.z = 99;
                            child.applyElementPosition(1, calcVec);
                        }

                        calcVec.x += child.options.step_x;
                        if (calcVec.x > Math.abs(guiElement.options.offset_children[0])) {
                            calcVec.x = guiElement.options.offset_children[0];
                            calcVec.y += child.options.step_y;
                        }
                    }
                }

                if (guiElement.children[textElementId]) {

                    calcVec.x = guiElement.options.offset_children[2];
                    calcVec.y = guiElement.options.offset_children[3];

                    for (i = 0; i < guiElement.children[textElementId].length; i++) {
                        calcVec.z = 0;
                        child = guiElement.children[textElementId][i];
                        child.origin.copy(guiElement.position);
                        child.setSpriteKey(displayName[i]);
                        child.applyElementPosition(0, calcVec);
                        calcVec.x += child.options.step_x;
                    }
                }


            } else if (guiElement.enabled) {
                guiElement.setTarget(null);
                guiElement.disableGuiElement();
            }

        };


        return CombatStatusUiProcessor;

    });