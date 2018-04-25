"use strict";

define(['PipelineAPI'],
    function(PipelineAPI) {


        var i;
        var child;

        var callbacks;
        var inputVectorCallback;
        var menuStateCallback;

        var hudUiProcessor;

        var screen_pos;
        var POINTER_STATES;
        var calcVec = new THREE.Vector3();
        var calcVec2 = new THREE.Vector3();

        var InteractiveElement = function() {
            POINTER_STATES = ENUMS.PointerStates;
            this.setupCallbacks();
        };

        InteractiveElement.prototype.setupInteractiveElement = function(guiElement) {
            this.guiElement = guiElement;


            this.menuState = this.getMenuState();

            if (!this.menuState.length) return;

            this.labelElemId = this.guiElement.getOptionByKey(ENUMS.OptionKeys.label_elemet_id);
            this.offsetChildren = this.guiElement.getOptionByKey(ENUMS.OptionKeys.offset_children);


            if (!this.guiElement.enabled) {
                this.guiElement.enableGuiElement();
                return;
            }

            if (!this.guiElement.children[this.labelElemId]) {
                for (i = 0; i < this.menuState.length; i++) {
                    this.guiElement.spawnChildElement(this.labelElemId);
                }
                return;
            }

            if (this.menuState.length > this.guiElement.children[this.labelElemId].length) {
                for (i = this.guiElement.children[this.labelElemId].length; i < this.menuState.length; i++) {

                    //        guiElement.spawnChildElement(labelElemId);

                }
                return;
            }

            for (i = 0; i < this.menuState.length; i++) {
                this.menuState[i].dirty = true;
            }

            screen_pos = this.guiElement.getOptionByKey(ENUMS.OptionKeys.screen_pos);

            guiElement.origin.set(screen_pos[0], screen_pos[1], screen_pos[2]);
            WorldAPI.fitView(guiElement.origin);

            return true
        };

        InteractiveElement.prototype.processInteractiveChildren = function(hdUiProcessor, cursorPosition, callback) {

            this.hudUiProcessor = hdUiProcessor;

            hudUiProcessor = hdUiProcessor;

            calcVec.z = 0;
            calcVec.x = 0;
            calcVec.y = 0;

            calcVec2.x = 0;
            calcVec2.y = 0;
            calcVec2.z = 0;

            calcVec.y = this.offsetChildren[1];

            for (i = 0; i < this.guiElement.children[this.labelElemId].length; i++) {

                if (!this.menuState[i]) {
                    return;
                }

                child = this.guiElement.children[this.labelElemId][i];
                this.updateInteractiveChild(this.menuState[i], cursorPosition, callback);
            }

        };

        InteractiveElement.prototype.updateInteractiveChild = function(menuState, cursorPosition, callback) {

            child.origin.copy(this.guiElement.origin);

            calcVec.x = this.offsetChildren[0];

            calcVec2.x = child.getOptionByKey(ENUMS.OptionKeys.offset_x);
            calcVec2.y = child.getOptionByKey(ENUMS.OptionKeys.offset_y);

            if ( this.hudUiProcessor.getHudPointerProcessor().updateElementPointerState(child, cursorPosition)) {
                this.applyUpdatedState( menuState, callback);
            }

            if (menuState.dirty) {
                this.hudUiProcessor.applyElementStateMap(child, child.getOptionByKey(ENUMS.OptionKeys.state_map));
                this.hudUiProcessor.updateTextElement(menuState.key, child, calcVec, calcVec2);

                menuState.dirty = false;
            }

            calcVec.y -= child.getOptionByKey(ENUMS.OptionKeys.row_y);
        };

        InteractiveElement.prototype.applyUpdatedState = function( menuState, callback) {
            menuState.dirty = true;
            callback(menuState, child.getPointerState());
        };

        InteractiveElement.prototype.getMenuState = function() {
            return PipelineAPI.readCachedConfigKey('GUI_STATE', this.guiElement.getOptionByKey(ENUMS.OptionKeys.gui_key));
        };

        InteractiveElement.prototype.getCallback = function(key) {
            return callbacks[key];
        };

        InteractiveElement.prototype.setupCallbacks = function() {

            menuStateCallback = function(menuState, elementState) {
                if (elementState === POINTER_STATES.DEACTIVATE) {
                    if (menuState.active) {
                        hudUiProcessor.deactivateMenuState(menuState)
                    }
                }

                if (elementState === POINTER_STATES.ACTIVATE) {
                    if (!menuState.active) {
                        hudUiProcessor.activateMenuState(menuState)
                    }
                }
            };

            inputVectorCallback = function(menuState, elementState) {
                if (elementState === POINTER_STATES.PRESS_INIT) {
                    if (!menuState.active) {
                        hudUiProcessor.activateMenuState(menuState)
                    }
                }

                if (menuState.active) {
                    if (!WorldAPI.sampleInputBuffer(ENUMS.InputState.PRESS_FRAMES)) {
                        hudUiProcessor.deactivateMenuState(menuState)
                    }
                }
            };

            callbacks = {

                menuStateCallback:menuStateCallback,
                inputVectorCallback:inputVectorCallback
            }
        };

        return InteractiveElement;

    });