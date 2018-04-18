"use strict";

define([
        'ui/particle/functions/GuiButtonFunctions',
        'ui/particle/processors/HudPointerProcessor',
        'ui/GameScreen',
        'PipelineAPI'
    ],
    function(
        GuiButtonFunctions,
        HudPointerProcessor,
        GameScreen,
        PipelineAPI
    ) {

        var GameAPI;
        var guiRenderer;
        var mouseState;

        var calcVec = new THREE.Vector3();
        var calcVec2 = new THREE.Vector3();

        var cursorPosition = new THREE.Vector3();

        var POINTER_STATES;

        var HudUiProcessor = function(gRenderer, gameApi) {
            GameAPI = gameApi;
            guiRenderer = gRenderer;
            this.guiButtonFunctions = new GuiButtonFunctions(gRenderer, gameApi);
            this.hudPointerProcessor = new HudPointerProcessor();
            POINTER_STATES = ENUMS.PointerStates;
        };


        HudUiProcessor.prototype.show_aim_state_status = function(guiElement) {

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



        HudUiProcessor.prototype.show_selection_corners = function(guiElement) {

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


        HudUiProcessor.prototype.updateCursorPoint = function() {

            cursorPosition.set(
                ((mouseState.x-GameScreen.getLeft()) / GameScreen.getWidth() - 0.5),
                -((mouseState.y-GameScreen.getTop()) / GameScreen.getHeight()) + 0.5,
                -1
            );

            GameScreen.fitView(cursorPosition);

        };

        HudUiProcessor.prototype.show_cursor_point = function(guiElement) {



            if (mouseState.action[0]) {

                if (!guiElement.enabled) {
                    guiElement.enableGuiElement();
                    return;
                }

            } else if (guiElement.enabled) {
                guiElement.disableGuiElement();
            }

            guiElement.origin.copy(cursorPosition);
            calcVec.set(0, 0, 0);
            guiElement.applyElementPosition(null, calcVec);

        };

        HudUiProcessor.prototype.show_active_selection = function(guiElement) {

            var activeSelection = GameAPI.getSelectionActivatedActor();

            if (activeSelection) {

                if (!activeSelection.piece.render) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                if (activeSelection.piece.getPieceActivationState() < ENUMS.PieceActivationStates.VISIBLE) {
                    guiElement.setTarget(null);
                    guiElement.disableGuiElement();
                    return;
                }

                if (!guiElement.enabled) {
                    guiElement.enableGuiElement();
                }

                guiElement.origin.copy(activeSelection.piece.frustumCoords);
                GameScreen.fitView(guiElement.origin);

                for (var i = 0; i < guiElement.fxElements.length; i++) {
                    guiElement.applyElementPosition(i);
                }

            } else if (guiElement.enabled) {
                guiElement.disableGuiElement();
            }

        };

        HudUiProcessor.prototype.updateTextElement = function(text, guiElement, position, offset) {
            guiElement.setText(text);

            guiElement.applyElementPosition(null, position);

            guiElement.renderText(offset);
        };

        HudUiProcessor.prototype.applyElementStateMap = function(guiElement, stateMap) {

            if (stateMap[guiElement.getPointerState()].color_curve) {
                guiElement.setColorCurveKey(stateMap[guiElement.getPointerState()].color_curve);
            }

            if (stateMap[guiElement.getPointerState()].sprite_id) {
                guiElement.setSpriteKey(stateMap[guiElement.getPointerState()].sprite_id);
            }

        };


        HudUiProcessor.prototype.show_application_status = function(guiElement) {

            //    return;

            var offsetChildren = guiElement.options.offset_children;

            var i;

            var monitor = PipelineAPI.readCachedConfigKey('STATUS', guiElement.options.monitor_key);

            if (!monitor.length) return;


            var labelElemId = guiElement.options.label_elemet_id;
            var valueElemId = guiElement.options.value_elemet_id;

            if (!guiElement.enabled) {

                guiElement.enableGuiElement();
            }

            calcVec.z = 0;
            calcVec.x = 0;
            calcVec.y = 0;

            guiElement.origin.set(guiElement.options.screen_pos[0], guiElement.options.screen_pos[1], guiElement.options.screen_pos[2]);
            GameScreen.fitView(guiElement.origin);



            if (!guiElement.children[labelElemId]) {
                for (i = 0; i < monitor.length; i++) {
                    guiElement.spawnChildElement(labelElemId);
                    guiElement.spawnChildElement(valueElemId);
                }
                return;
            }

            if (monitor.length > guiElement.children[labelElemId].length) {
                for (i = guiElement.children[labelElemId].length; i < monitor.length; i++) {
                    //        guiElement.spawnChildElement(labelElemId);
                    //        guiElement.spawnChildElement(valueElemId);
                }
            }

            calcVec.z = 0;
            calcVec.x = 0;
            calcVec.y = 0;

            calcVec2.x = 0;
            calcVec2.y = 0;
            calcVec2.z = 0;

            var child;

            calcVec.y = offsetChildren[1];

            var update = false;

            for (i = 0; i < guiElement.children[labelElemId].length; i++) {

                if (!monitor[i]) {
                    return;
                }

                child = guiElement.children[labelElemId][i];

                child.origin.copy(guiElement.origin);

                calcVec.x = offsetChildren[0];

                calcVec2.x = child.options.offset_x;
                calcVec2.y = child.options.offset_y;

                if (monitor[i].dirty || Math.random() < 0.005) {
                    update = true;
                    this.updateTextElement(monitor[i].key, child, calcVec, calcVec2);

                    if (guiElement.children[valueElemId]) {

                        if (guiElement.children[valueElemId][i]) {
                            calcVec.x = offsetChildren[2];
                            child = guiElement.children[valueElemId][i];
                            child.origin.copy(guiElement.origin);

                            calcVec2.x = child.options.offset_x;
                            calcVec2.y = child.options.offset_y;


                            this.updateTextElement(''+monitor[i].value, child, calcVec, calcVec2);

                        }
                    }
                    monitor[i].dirty = false;
                }

                calcVec.y -= child.options.row_y;
            }

            if (update) {
                calcVec.z = 0;
                calcVec.x = 0;
                calcVec.y = 0;
                guiElement.applyElementPosition(null, calcVec);
            }

        };


        HudUiProcessor.prototype.activateMenuState = function(menuState) {
            menuState.active = true;
            this.guiButtonFunctions.callButtonActivate(menuState.functionKey , menuState.value)


        };

        HudUiProcessor.prototype.deactivateMenuState = function(menuState) {
            menuState.active = false;
            this.guiButtonFunctions.callButtonDeactivate(menuState.functionKey , menuState.value)
        };

        HudUiProcessor.prototype.show_menu_status = function(guiElement) {

            //    return;

            var offsetChildren = guiElement.options.offset_children;

            var i;

            var menuState = PipelineAPI.readCachedConfigKey('GUI_STATE', guiElement.options.gui_key);

            if (!menuState.length) return;

            var labelElemId = guiElement.options.label_elemet_id;
            var valueElemId = guiElement.options.value_elemet_id;

            if (!guiElement.enabled) {
                guiElement.enableGuiElement();
                return;
            }

            if (!guiElement.children[labelElemId]) {
                for (i = 0; i < menuState.length; i++) {
                    guiElement.spawnChildElement(labelElemId);
                }

                return;
            }


            if (menuState.length > guiElement.children[labelElemId].length) {
                for (i = guiElement.children[labelElemId].length; i < menuState.length; i++) {
                    //        guiElement.spawnChildElement(labelElemId);
                }
                return;
            }



            guiElement.origin.set(guiElement.options.screen_pos[0], guiElement.options.screen_pos[1], guiElement.options.screen_pos[2]);
            GameScreen.fitView(guiElement.origin);

            calcVec.z = 0;
            calcVec.x = 0;
            calcVec.y = 0;

            calcVec2.x = 0;
            calcVec2.y = 0;
            calcVec2.z = 0;

            var child;
            var stateMap;
            var state = 0;

            calcVec.y = offsetChildren[1];

            var update = false;

            for (i = 0; i < guiElement.children[labelElemId].length; i++) {

                if (!menuState[i]) {
                    return;
                }

                child = guiElement.children[labelElemId][i];

                child.origin.copy(guiElement.origin);

                calcVec.x = offsetChildren[0];

                calcVec2.x = child.options.offset_x;
                calcVec2.y = child.options.offset_y;

                stateMap = child.options.state_map;



                var stateChanged = this.hudPointerProcessor.updateElementPointerState(child, mouseState, cursorPosition);

                if (stateChanged) {

                    var elementState = child.getPointerState();

                    if (elementState === POINTER_STATES.DEACTIVATE) {

                        console.log(child.getPointerState());

                        if (menuState[i].active) {
                            this.deactivateMenuState(menuState[i])
                        }
                    }


                    if (elementState === POINTER_STATES.ACTIVATE) {
                        if (!menuState[i].active) {
                            this.activateMenuState(menuState[i])
                        }
                    }


                    menuState[i].dirty = true;
                }


                if (menuState[i].dirty || Math.random() < 0.1) {
                    update = true;

                    this.applyElementStateMap(child, stateMap);
                    this.updateTextElement(menuState[i].key, child, calcVec, calcVec2);

                    menuState[i].dirty = false;
                }

                calcVec.y -= child.options.row_y;
            }


        };


        HudUiProcessor.prototype.updateMouseState = function(mState) {
            mouseState = mState;
            this.updateCursorPoint();
        };

        return HudUiProcessor;

    });