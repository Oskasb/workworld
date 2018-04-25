"use strict";


define([
    'PipelineAPI'

], function(
    PipelineAPI
) {

    var guiRenderer;

    var GuiButtonFunctions = function(gRenderer) {
        guiRenderer = gRenderer;
    };

    var toggleGuiSystem = function(systemKey, bool) {

        if (bool) {
            guiRenderer.activateGuiSystemId(systemKey)
        } else {
            guiRenderer.deactivateGuiSystemId(systemKey)
        }

    };

    var sampleDragVector = function(systemKey, bool) {

        if (bool) {
            guiRenderer.activateGuiSystemId(systemKey)
        } else {
            guiRenderer.deactivateGuiSystemId(systemKey)
        }

    };

    var toggleStatusKey = function(systemKey, bool) {
        PipelineAPI.setCategoryKeyValue(ENUMS.Category.STATUS, systemKey, bool);
    };


    var buttonFunctions = {
        toggle_gui_system:toggleGuiSystem,
        toggle_status_key:toggleStatusKey,
        sample_drag_vector:sampleDragVector
    };


    GuiButtonFunctions.prototype.callSurfacePressInit = function(functionKey, value) {
        buttonFunctions[functionKey](value, true)
    };

    GuiButtonFunctions.prototype.callButtonPressRelease = function(functionKey, value) {
        buttonFunctions[functionKey](value, false)
    };

    GuiButtonFunctions.prototype.callButtonActivate = function(functionKey, value) {
        buttonFunctions[functionKey](value, true)
    };

    GuiButtonFunctions.prototype.callButtonDeactivate = function(functionKey, value) {
        buttonFunctions[functionKey](value, false)
    };

    return GuiButtonFunctions;

});