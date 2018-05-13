"use strict";

define([

    ],
    function(

    ) {

        var sourceVec = new THREE.Vector3();
        var lookAt = new THREE.Vector3();

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

        DragFunctions.thumbstickDrag = function() {

            WorldAPI.addTextMessage('Drag... thumbstickDrag')

        };

        DragFunctions.dragCamX = function() {
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_X, MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_X) + WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X), -1, 1));
        };

        DragFunctions.dragCamY = function() {
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_Y, MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_Y) + WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), -1, 1));
        };

        DragFunctions.dragCamZ = function() {
            WorldAPI.setCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z, MATH.clamp(WorldAPI.getCom(ENUMS.BufferChannels.UI_CAM_DRAG_Z) - WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), -1, 1));
        };


        return DragFunctions;

    });

