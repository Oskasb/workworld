"use strict";

define([
        'ui/GameScreen',
        'PipelineAPI'
    ],
    function(
        GameScreen,
        PipelineAPI
    ) {

        var GameAPI;
        var guiRenderer;

        var piece;
        var dirtyState;
        var activationState;
        var text;
        var i;
        var actors;
        var elem;

        var size;
        var axis;
        var factor;
        var corner;


        var calcVec = new THREE.Vector3();
        var calcVec2 = new THREE.Vector3();

        var HudMapProcessor = function(gRenderer, gameApi) {
            GameAPI = gameApi;
            guiRenderer = gRenderer;

            this.mapCenter = new THREE.Vector3();
            this.playerPos = new THREE.Vector3();
            this.mapSize = 0;

            this.mapActorElements = [];

        };

        HudMapProcessor.prototype.show_map_corners = function(guiElement) {

            if (!guiElement.enabled) {
                guiElement.enableGuiElement();
                return;
            }

            corner = -0.25;

            size = 0.37;

            guiElement.origin.set(corner, corner, -1); // (activeSelection.piece.frustumCoords);
            GameScreen.fitView(guiElement.origin);

            if (this.mapCenter.equals(guiElement.origin)) {
                return;
            }

            this.mapCenter.copy(guiElement.origin);


            axis = guiElement.origin.x;
            if (Math.abs(guiElement.origin.y) < Math.abs(guiElement.origin.x)) {
                axis = guiElement.origin.y;
            }

            factor = Math.abs(corner) * axis + size*axis;

            this.size = Math.abs(factor*2);

            calcVec.z = 0;

            calcVec.x = factor;

            calcVec.y = factor;
            guiElement.applyElementPosition(0, calcVec);

            calcVec.x = 0;
            guiElement.applyElementPosition(6, calcVec);

            calcVec.x = -factor;
            guiElement.applyElementPosition(1, calcVec);

            calcVec.y = 0;
            guiElement.applyElementPosition(4, calcVec);

            calcVec.y = -factor;
            guiElement.applyElementPosition(2, calcVec);

            calcVec.x = 0;
            guiElement.applyElementPosition(7, calcVec);

            calcVec.x = factor;
            guiElement.applyElementPosition(3, calcVec);

            calcVec.y = 0;
            guiElement.applyElementPosition(5, calcVec);

        };


        HudMapProcessor.prototype.drawActorOnMap = function(actor, guiElement) {


            calcVec.subVectors(actor.piece.getPos()  , this.playerPos);

            calcVec.multiplyScalar(1 / 1000);


            calcVec.y = -calcVec.z - 0.15;
            calcVec.x = calcVec.x - 0.15;

        //    calcVec.multiplyScalar(this.size);

        //    calcVec.y = calcVec.z;

            GameScreen.fitView(calcVec);

            calcVec.z = -1;

            guiElement.applyElementPosition(0, calcVec);

            piece = actor.piece;

            text = '_';
            if (piece.render) {
                text = 'R'
            }


            activationState = piece.getPieceActivationState();

        //    if (activationState) {
                text += activationState;
        //    }

            dirtyState = piece.anyStateIsDirty();


            if (dirtyState) {
                text += '_D'
            } else {
                text += '__'
            }

            guiElement.setText(text);

            calcVec2.set(guiElement.options.offset_x, guiElement.options.offset_y, 0);

            guiElement.renderText(calcVec2);

        };



        HudMapProcessor.prototype.drawActors = function(actors, guiElement) {
            var cs = 0;

            for (i = 0; i < actors.length; i++) {

                if (actors[i].piece.getCombatStatus()) {
                    if (guiElement.children[guiElement.options.map_actor_element_id][cs]) {
                        this.drawActorOnMap(actors[i], guiElement.children[guiElement.options.map_actor_element_id][cs])
                    } else {
                        guiElement.spawnChildElement(guiElement.options.map_actor_element_id)
                    }
                    cs++

                }


            }

            calcVec.z = 99;

            for (0; cs < guiElement.children[guiElement.options.map_actor_element_id].length; cs++) {
                elem = guiElement.children[guiElement.options.map_actor_element_id][cs];
                elem.applyElementPosition(null, calcVec);
                elem.setText('xxxx');
                elem.renderText(calcVec);
                //    i--
            }
        };


        HudMapProcessor.prototype.process_local_map = function(guiElement) {


            var controlledActor = GameAPI.getControlledActor();
            if (controlledActor) {
                this.playerPos.copy(controlledActor.piece.getPos());
            } else {
                return;
            }

            actors = GameAPI.getActors();

            guiElement.origin.copy(this.mapCenter);

        //    guiElement.origin.x -= this.size/2;
         //   guiElement.origin.y -= this.size/2;

            if (!guiElement.children[guiElement.options.map_actor_element_id]) {
                for (i = 0; i < actors.length; i++) {
                    if (actors[i].piece.getCombatStatus()) {
                        guiElement.spawnChildElement(guiElement.options.map_actor_element_id)
                    }

                }
                return;
            }

            this.drawActors(actors, guiElement);




        };


        return HudMapProcessor;

    });