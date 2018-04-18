"use strict";

define([
        'ui/particle/functions/GuiRenderer',
        'ui/particle/GuiState'
    ],
    function(
        GuiRenderer,
        GuiState
    ) {

        var guiRenderer;
        var GameAPI;

        var defaultGuySystems = [
            "gui_main_menu_system",
            "gui_system_combat",
            "gui_system_interaction"
        ];

        var GuiAPI = function() {

        };

        GuiAPI.initGuiApi = function(gameApi) {
        //    GuiState.initGuiState();
        //    GameAPI = gameApi;
        //    guiRenderer = new GuiRenderer(GameAPI);
        //    GuiAPI.activateDefaultGuiSystems();
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
            guiRenderer.requestCameraMatrixUpdate();
            guiRenderer.updateGuiRenderer();
        };

        return GuiAPI;

    });