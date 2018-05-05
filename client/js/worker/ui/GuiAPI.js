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

        GuiAPI.getMouseX = function() {
            return WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
        };

        GuiAPI.getMouseY = function() {
            return WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);
        };

        GuiAPI.getStartDragX = function() {
            return WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_X)
        };

        GuiAPI.getStartDragY = function() {
            return WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_Y);
        };

        GuiAPI.viewToLayoutX = function(x) {
            return -x / WorldAPI.sampleInputBuffer(ENUMS.InputState.FRUSTUM_FACTOR) / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT);
        };

        GuiAPI.viewToLayoutY = function(y) {
            return  0.5 - (y / WorldAPI.sampleInputBuffer(ENUMS.InputState.FRUSTUM_FACTOR));
        };

        GuiAPI.layoutToViewX = function(x) {
            return GuiAPI.scaleByWidth(x - 0.5 );
        };

        GuiAPI.layoutToViewY = function(y) {
            return GuiAPI.scaleByHeight(1 - (0.5 + y));
        };

        GuiAPI.scaleByWidth = function(value) {
            return value * WorldAPI.sampleInputBuffer(ENUMS.InputState.FRUSTUM_FACTOR) * WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT);
        };

        GuiAPI.scaleByHeight = function(value) {
            return value * WorldAPI.sampleInputBuffer(ENUMS.InputState.FRUSTUM_FACTOR);
        };

        GuiAPI.scaleByClampedAspect = function(value) {
            return value * WorldAPI.sampleInputBuffer(ENUMS.InputState.FRUSTUM_FACTOR) * Math.min(WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT), 1);
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