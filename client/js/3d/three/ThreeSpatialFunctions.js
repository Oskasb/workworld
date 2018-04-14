"use strict";


define([
    'ui/GameScreen'
], function(
    GameScreen
) {

    var calcVec = new THREE.Vector3();
    var calcVec2 = new THREE.Vector3();
    var pointerFrustumPos = new THREE.Vector3();
    var frustumCoordinates = new THREE.Vector3(0, 0, 0);
    var hoverCoords = new THREE.Vector3(0, 0, 0);
    var distsq;

    var sizeFactor = 0.51;

    var matchView = function(vec3) {
        vec3.x *= sizeFactor * GameScreen.getAspect();
        vec3.v *= sizeFactor;
        vec3.z = 0;
    };

    var ThreeSpatialFunctions = function() {

    };


    ThreeSpatialFunctions.prototype.getHoverDistanceToPos = function(pos, mouseState) {

        pointerFrustumPos.set(
            ((mouseState.x-GameScreen.getLeft()) / GameScreen.getWidth() - 0.5) ,
            -((mouseState.y-GameScreen.getTop()) / GameScreen.getHeight()- 0.5) ,
            0
        );

        matchView(pos);


        distsq = pos.distanceToSquared(pointerFrustumPos);

        return distsq;

    };



    return ThreeSpatialFunctions;

});