"use strict";

define([
        'PipelineAPI'
    ],
    function(
        PipelineAPI
    ) {


        var guiStates = {
            MAIN_MENU:[
                {key:'PLAY',    functionKey:'toggle_status_key' ,   value:'APP_LOADER',              active:false,    dirty:true},
                {key:'STATUS',  functionKey:'toggle_gui_system' ,   value:'gui_system_status',       active:false,       dirty:true},
                {key:'MAP',     functionKey:'toggle_gui_system' ,   value:'gui_system_map',          active:false,       dirty:true}
            ]

        };

        var GuiState = function() {

        };

        GuiState.initGuiState = function() {
            GuiState.registerGuiState('MAIN_MENU');
        };

        GuiState.registerGuiState = function(stateKey) {
            if (!guiStates[stateKey]) {
                guiStates[stateKey] = [];
            }

            for (var i = 0; i < guiStates[stateKey].length; i++) {
                guiStates[stateKey][i].dirty = true;
            }

            PipelineAPI.setCategoryKeyValue('GUI_STATE', stateKey, guiStates[stateKey]);
        };

        return GuiState;

    });