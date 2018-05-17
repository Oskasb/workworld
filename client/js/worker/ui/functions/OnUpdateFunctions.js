"use strict";

define([],
    function() {


    var eventCallbacks = [];

        var OnUpdateFunctions = function() {

        };

        var notifyControlTransitionCompleted = function(value) {
            WorldAPI.completeControlChange()
        };

        OnUpdateFunctions.stateUpdate = function(value) {

            if (value === 1) {

            }
        };

        OnUpdateFunctions.selectUpdate = function(value) {

            if (value === 1) {
                console.log("attach callback..")
                eventCallbacks.push(notifyControlTransitionCompleted);
                WorldAPI.setCom(ENUMS.BufferChannels.DYNAMIC_HOVER, 0);
                WorldAPI.setCom(ENUMS.BufferChannels.UI_HOVER_SOURCE, 0);
                WorldAPI.setCom(ENUMS.BufferChannels.UI_PRESS_SOURCE, 0);
            }
        };

        OnUpdateFunctions.eventUpdate = function(value) {

            if (value >= 1) {
                while(eventCallbacks.length) {
                    console.log("pop callback..", eventCallbacks)
                    eventCallbacks.pop()(value);
                }
            }

        };

        OnUpdateFunctions.dragCamZ = function() {
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z, MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z) - WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), -1, 1));
        };

        return OnUpdateFunctions;

    });
