"use strict";

define([
        'GuiAPI',
    ],
    function(
        GuiAPI
    ) {

        var hoverDistance;
        var closestDistance;
        var closestDynamic;
        var distSq;
        var calcVec = new THREE.Vector3();
        var pointerPosVec = new THREE.Vector3();

        var ScreenspaceProbe = function() {
            this.currentProbedDynamic = null;
        };


        var getHoverDistanceToPos = function(pos, pointerPos) {

            /*
            pointerFrustumPos.set(
                ((mouseState.x-GameScreen.getLeft()) / GameScreen.getWidth() - 0.5) ,
                -((mouseState.y-GameScreen.getTop()) / GameScreen.getHeight()- 0.5) ,
                0
            );

            matchView(pos);
            */

            return pos.distanceToSquared(pointerPos);
        };


        ScreenspaceProbe.prototype.getDynamicPointerdistance = function(dynamic) {
            return getHoverDistanceToPos(dynamic.screenPos, pointerPosVec);
        };

        ScreenspaceProbe.prototype.probeScreenDynamics = function(dynamics) {

            pointerPosVec.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            pointerPosVec.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);
            pointerPosVec.z = -1;

            closestDistance = 9999999;
            closestDynamic = null;
            for (var i = 0; i < dynamics.length; i++) {

                if (dynamics[i].isVisible) {

                    distSq = this.getDynamicPointerdistance(dynamics[i]);

                    if (distSq < closestDistance) {
                        closestDistance = distSq;
                        closestDynamic = dynamics[i];
                    }
                }
            }

            if (this.currentProbedDynamic !== closestDynamic) {
                if (closestDynamic) {
                    WorldAPI.addTextMessage('Hover dynamic: '+closestDynamic.idKey)
                } else {
                    WorldAPI.addTextMessage('Release Hover dynamic')
                }
            }


            this.currentProbedDynamic = closestDynamic;
            return this.currentProbedDynamic;
        };

        ScreenspaceProbe.prototype.getCurrentDynamicHover = function() {
            return this.currentProbedDynamic;
        };

        return ScreenspaceProbe;

    });

