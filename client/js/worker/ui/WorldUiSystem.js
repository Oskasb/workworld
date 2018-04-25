"use strict";

define([
    'GuiAPI',
        'Events',
        'EffectsAPI',
        'PipelineObject'
    ],
    function(
        GuiAPI,
        evt,
        EffectsAPI,
        PipelineObject
    ) {

        var pointerFrustumPos = new THREE.Vector3();
        var cursorElementId = 'gui_cursor_pointer_follow';
        var cursorEeffectId = 'gui_pointer_follow_effect';

        var inputBuffer = [];
        var lastBuffer = [];


        var WorldUiSystem = function() {
            this.cursorElement;
            GuiAPI.initGuiApi();
        };

        WorldUiSystem.prototype.activateDefaultGui = function() {
            GuiAPI.activateDefaultGuiSystems();
        };

        WorldUiSystem.prototype.enableCursorElement = function() {
        //

            var fx = EffectsAPI.requestPassiveEffect(cursorEeffectId, pointerFrustumPos);
        //    console.log("Enable Cursor", fx);
            this.cursorElement = fx;
        };

        WorldUiSystem.prototype.disableCursorElement = function() {
            //    console.log("Enable Cursor", cursorElementId, pointerFrustumPos, cursorEeffectId);
            EffectsAPI.returnPassiveEffect(this.cursorElement);
            this.cursorElement = null;
        };


        WorldUiSystem.prototype.setElementPosition = function(fx, posVec) {
            EffectsAPI.updateEffectPosition(fx, posVec);
        };

        WorldUiSystem.prototype.renderImmediateInputState = function(inputBuffer, lastInputBuffer) {

            pointerFrustumPos.x = inputBuffer[ENUMS.InputState.MOUSE_X];
            pointerFrustumPos.y = inputBuffer[ENUMS.InputState.MOUSE_Y];
            pointerFrustumPos.z = -1;

            //    for (var i = 0; i < inputBuffer.length; i++) {

                if (inputBuffer[ENUMS.InputState.ACTION_0] && this.cursorElement) {
                    this.setElementPosition(this.cursorElement, pointerFrustumPos)
                }

                if (inputBuffer[ENUMS.InputState.ACTION_0] !== lastInputBuffer[ENUMS.InputState.ACTION_0]) {

                    if (inputBuffer[ENUMS.InputState.ACTION_0]) {
                    //    console.log("Input Update On", inputBuffer[ENUMS.InputState.ACTION_0], lastInputBuffer[ENUMS.InputState.ACTION_0])
                        this.enableCursorElement();
                    } else {
                    //    console.log("Input Update Off", inputBuffer[ENUMS.InputState.ACTION_0], lastInputBuffer[ENUMS.InputState.ACTION_0])
                        if (this.cursorElement) {
                            this.disableCursorElement();
                        }

                    }

                }

        //    }

        };



        WorldUiSystem.prototype.updateWorldUiSystem = function(inputBuffer, lastInputBuffer) {
            GuiAPI.updateGui();
        //    this.renderImmediateInputState(inputBuffer, lastInputBuffer);
        };

        return WorldUiSystem;

    });

