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

        var ButtonFunctions = function() {

        };

        ButtonFunctions.toggleControl = function(targetValue, source) {

            piece = WorldAPI.getControlledRenderable().getGamePiece();
            control = piece.getControlStateById(source);
            console.log("Press Toggle Control", targetValue , source);
            control.setPieceControlTargetState(targetValue);

        };

        return ButtonFunctions;

    });

