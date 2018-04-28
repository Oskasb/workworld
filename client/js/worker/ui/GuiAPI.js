"use strict";

define([

        'ui/systems/GuiPointerSystem',
        'ui/systems/GuiSurfaceSystem'
    ],
    function(
        GuiPointerSystem,
        GuiSurfaceSystem
    ) {


        var pointerSys;
        var guiSurfaceSystem;
        var guiSystems = [];

        var callbackRegistry = {};

        var guiUpdateCallbacks = [];

        var systemReady = function(guiSystem) {

            if (guiSystems.indexOf(guiSystem) === -1) {
                guiSystems.push(guiSystem);
            }
        };

        var GuiAPI = function() {

        };

        GuiAPI.initGuiApi = function() {
            pointerSys = new GuiPointerSystem();
            guiSurfaceSystem = new GuiSurfaceSystem();
        };

        GuiAPI.enableGuiSystems = function() {
            GuiAPI.addGuiSystem(pointerSys);
            GuiAPI.addGuiSystem(guiSurfaceSystem)
        };

        GuiAPI.getSurfaceSystem = function() {
            return guiSurfaceSystem;
        };

        GuiAPI.activateDefaultGui = function() {

        };

        GuiAPI.registerCallback = function() {

        };

        GuiAPI.addGuiUpdateCallback = function(cb) {
            guiUpdateCallbacks.push(cb);
        };

        GuiAPI.removeGuiUpdateCallback = function(cb) {
            guiUpdateCallbacks.splice(guiUpdateCallbacks.indexOf(cb, 1));
        };

        GuiAPI.addGuiSystem = function(guiSystem) {
            guiSystem.initGuiSystem(systemReady)
        };

        GuiAPI.updateGui = function() {
            for (var i = 0; i < guiSystems.length; i++) {
                guiSystems[i].updateGuiSystem();
            }

            for (i = 0; i < guiUpdateCallbacks.length; i++) {
                guiUpdateCallbacks[i]();
            }

        };

        return GuiAPI;

    });