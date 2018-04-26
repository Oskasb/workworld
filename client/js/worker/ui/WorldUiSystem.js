"use strict";

define([
        'GuiAPI',
        'Events',
        'EffectsAPI',
        'ui/systems/GuiPointerSystem'
    ],
    function(
        GuiAPI,
        evt,
        EffectsAPI,
        GuiPointerSystem
    ) {

        var guiSystems = [];

        var systemReady = function(guiSystem) {

            if (guiSystems.indexOf(guiSystem) === -1) {
                guiSystems.push(guiSystem);
            }
        };

        var WorldUiSystem = function() {
            GuiAPI.initGuiApi();
        };

        WorldUiSystem.prototype.activateDefaultGui = function() {
            GuiAPI.activateDefaultGuiSystems();

            var pointerSys = new GuiPointerSystem();
            this.addGuiSystem(pointerSys)

        };

        WorldUiSystem.prototype.addGuiSystem = function(guiSystem) {
            guiSystem.initGuiSystem(systemReady)
        };

        WorldUiSystem.prototype.setElementPosition = function(fx, posVec) {
            EffectsAPI.updateEffectPosition(fx, posVec);
        };



        WorldUiSystem.prototype.updateWorldUiSystem = function(inputBuffer, lastInputBuffer) {
            for (var i = 0; i < guiSystems.length; i++) {
                guiSystems[i].updateGuiSystem();
            }

            GuiAPI.updateGui();
        //    this.renderImmediateInputState(inputBuffer, lastInputBuffer);
        };

        return WorldUiSystem;

    });

