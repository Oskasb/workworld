"use strict";

define([

        'ui/functions/GuiRenderer',
        'ui/GuiState'
    ],
    function(
        GuiRenderer,
        GuiState
    ) {

        var guiRenderer;

        var defaultGuySystems = [
            "gui_main_menu_system"
        //    "gui_system_combat",
        //
        ];

        var GuiAPI = function() {

        };

        GuiAPI.initGuiApi = function() {
            GuiState.initGuiState();
        //    GameAPI = gameApi;
            guiRenderer = new GuiRenderer();
        };

        GuiAPI.activateDefaultGuiSystems = function() {

            for (var i = 0; i < defaultGuySystems.length; i++) {
                GuiAPI.activateGuiSystem(defaultGuySystems[i])
            }

        };

        GuiAPI.activateGuiSystem = function(systemId) {
            guiRenderer.activateGuiSystemId(systemId);
        };

        GuiAPI.deactivateGuiSystem = function(systemId) {
            guiRenderer.deactivateGuiSystemId(systemId);
        };

        GuiAPI.updateGui = function() {
        //    guiRenderer.requestCameraMatrixUpdate();
            guiRenderer.updateGuiRenderer();
        };

        return GuiAPI;

    });