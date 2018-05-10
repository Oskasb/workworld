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
            sourceVec.x = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5, -2, 2);
            sourceVec.y = 0;
            sourceVec.z = 0;

            sourceVec.applyQuaternion(WorldAPI.getWorldCamera().getCamera().quaternion);
            sourceVec.y = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5, -2, 2);

            WorldAPI.getWorldCamera().getCamera().position.x += sourceVec.x;
            WorldAPI.getWorldCamera().getCamera().position.y += sourceVec.y;
            WorldAPI.getWorldCamera().getCamera().position.z += sourceVec.z;
        };

        DragFunctions.thumbstickDrag = function() {
            lookAt.x = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5, -2, 2);
            lookAt.y = 0;
            lookAt.z = MATH.clamp(-WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5, -2, 2);
            lookAt.applyQuaternion(WorldAPI.getWorldCamera().getCamera().quaternion);
            WorldAPI.getWorldCursor().moveCursorPosition(lookAt);
        };

        return DragFunctions;

    });

