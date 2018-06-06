"use strict";

define([],
    function() {

        var tempVec = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();

        var transitionTime = 2.0;

        var DynamicControlSelector = function() {
            this.sourcePosition = new THREE.Vector3();
            this.camSourcePosition = new THREE.Vector3();
            this.transitionStart = 0;
            this.target = null;
            this.source = null;
        };

        DynamicControlSelector.prototype.initiateControlChange = function(target) {

            if (!target.getGamePiece()) {
                WorldAPI.addTextMessage('Not a game piece.. '+target.idKey);
                return;
            }
            this.source = WorldAPI.getControlledRenderable();

            WorldAPI.getWorldCamera().getCameraPosition(this.camSourcePosition);

            if (this.source) {
                this.source.setIsControlled(0);
            }

            WorldAPI.getContoledPiecePosAndQuat(this.sourcePosition);

            this.target = target;
            this.transitionStart = WorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME);
        };

        DynamicControlSelector.prototype.transitionUpdate = function(timeElapse) {
            var progress = timeElapse / transitionTime;
            WorldAPI.setCom(ENUMS.BufferChannels.EVENT_PROGRESS, progress);

            this.target.calculateCameraLook(tempVec2);
            tempVec.lerpVectors(this.sourcePosition, tempVec2, MATH.clamp(progress*2, 0, 1));
            WorldAPI.getWorldCamera().setLookAtVec(tempVec);


            this.target.calculateCameraHome(tempVec2);
            tempVec.lerpVectors(this.camSourcePosition, tempVec2, MATH.curveSigmoid(progress));
            WorldAPI.getWorldCamera().setCameraPosVec(tempVec);

        };

        DynamicControlSelector.prototype.finishControlChange = function() {
            WorldAPI.addTextMessage("Control transition ended");

            WorldAPI.setCom(ENUMS.BufferChannels.EVENT_PROGRESS, 0);

            var onReady = function() {
                WorldAPI.addTextMessage("Controls activated");
            };

            WorldAPI.setControlledRenderable(this.target);
            this.target.getGamePiece().activatePieceControls(onReady);
            this.target.setIsControlled(1);
            WorldAPI.addTextMessage("Control PTR:", WorldAPI.getCom(ENUMS.BufferChannels.CONTROLLED_POINTER));
            this.target = null;
        };

        DynamicControlSelector.prototype.updateControlSelector = function() {
            if (this.target) {
                this.transitionUpdate(WorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME) - this.transitionStart);
            }
        };

        return DynamicControlSelector;

    });
