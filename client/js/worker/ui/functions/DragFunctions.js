"use strict";

define([

    ],
    function(

    ) {

        var value;
        var control;
        var targetValue;
        var calcVec = new THREE.Vector3();
        var sourceVec = new THREE.Vector3();
        var lookAt = new THREE.Vector3();
        var piece;
        var DragFunctions = function() {

        };

        DragFunctions.dragSourceCamera = function() {
            DragFunctions.dragCamX();
            DragFunctions.dragCamY();
        };

        DragFunctions.cursorDrag = function() {

            lookAt.x = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5, -2, 2);
            lookAt.y = 0;
            lookAt.z = MATH.clamp(-WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5, -2, 2);

            lookAt.multiplyScalar(Math.sqrt(WorldAPI.getWorldCamera().distanceToLookTarget())*0.1);

            lookAt.applyQuaternion(WorldAPI.getWorldCamera().getCamera().quaternion);
            WorldAPI.getContoledPiecePosAndQuat(sourceVec);
            lookAt.addVectors(lookAt, sourceVec);
            WorldAPI.setContolPosAndQuat(lookAt);
        };


        DragFunctions.thumbstickDrag = function(value, source) {
            piece = WorldAPI.getControlledRenderable().getGamePiece();
            piece.getControlStateById('elevator').setPieceControlTargetState(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5);
            piece.getControlStateById('aeilron').setPieceControlTargetState(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5);
        };

        DragFunctions.dragCamX = function() {
            value = MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_X) + WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X), -1, 1);
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_X, value);
            return value;
        };

        DragFunctions.dragCamY = function() {
            value = MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_Y) + WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), -1, 1)
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_Y, value);
            return value;
        };

        DragFunctions.dragCamZ = function() {
            value = MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z) - WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), -1, 1)
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z, value);
            return value;
        };


        DragFunctions.onDragControl = function(value, source) {
            piece = WorldAPI.getControlledRenderable().getGamePiece();
            control = piece.getControlStateById(source);
            targetValue = control.getControlStateTargetValue();
            control.setPieceControlTargetState(value * control.getControlFactor() + targetValue);
        };

        DragFunctions.toggleControl = function(value, source) {
            piece = WorldAPI.getControlledRenderable().getGamePiece();
            control = piece.getControlStateById(source);
            targetValue = control.getControlStateTargetValue();
            control.setPieceControlTargetState(value * control.getControlFactor() + targetValue);
        };

        return DragFunctions;

    });

