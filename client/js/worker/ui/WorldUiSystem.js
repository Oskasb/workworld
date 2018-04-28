"use strict";

define([
        'GuiAPI',
        'EffectsAPI',
        'ui/systems/GuiPointerSystem',
        'ui/systems/GuiSurfaceSystem'
    ],
    function(
        GuiAPI,
        EffectsAPI,
        GuiPointerSystem,
        GuiSurfaceSystem
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
            this.guiSurfaceSystem = new GuiSurfaceSystem();
            this.addGuiSystem(this.guiSurfaceSystem)

        };

        WorldUiSystem.prototype.addGuiSystem = function(guiSystem) {
            guiSystem.initGuiSystem(systemReady)
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

