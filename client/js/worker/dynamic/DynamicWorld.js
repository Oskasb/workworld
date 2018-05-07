"use strict";


define([
        'worker/dynamic/DynamicRenderable'
    ],
    function(
        DynamicRenderable
    ) {

        var dynamics = [];

        var newDynRen;
        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();

        var addDynamicRenderable = function(dynRen) {
            if (dynamics.indexOf(dynRen) !== -1) {
                console.log("Dupe Add attempted... bailing");
                return;
            }
            dynamics.push(dynRen)
        };

        var DynamicWorld = function() {

        };

        var scale;

        DynamicWorld.prototype.includeDynamicRenderable = function(renderable) {
            addDynamicRenderable(renderable);
        };

        DynamicWorld.prototype.spliceDynamicRenderable = function(renderable) {
            dynamics.splice(dynamics.indexOf(renderable), 1)
        };

        DynamicWorld.prototype.setupDynamicRenderable = function(renderableId, pos, quat, scale) {
            newDynRen = new DynamicRenderable();
            newDynRen.setRenderableIdKey(renderableId);
            newDynRen.setRenderableScale(scale);
            newDynRen.setRenderablePosition(pos);
            newDynRen.setRenderableQuaternion(quat);
            return newDynRen;
        };

        var geoms = ['wooden_crate', 'creative_crate'];
        var distance;
        var mass;

        var pokeAllDyn = function() {
            for (var i = 0; i < dynamics.length;i++) {

                mass = dynamics[i].getDynamicMass();

                tempVec1.x = (Math.random()-0.5) * 1000 * (mass+1000);
                tempVec1.y = (Math.random()+0.1) * 1000 * (mass+1000);
                tempVec1.z = (Math.random()-0.5) * 1000 * (mass+1000);

                dynamics[i].applyForceVector(tempVec1);

                tempVec1.x = (Math.random()-0.5) * 1000 * mass;
                tempVec1.y = (Math.random()-0.5) * 1000 * mass;
                tempVec1.z = (Math.random()-0.5) * 1000 * mass;

                dynamics[i].applyTorqueVector(tempVec1);

            }
            WorldAPI.setCom(ENUMS.BufferChannels.PUSH_ALL_DYNAMICS, 0);
        };

        var attractAllDyn = function(maxRange) {

            tempVec2.copy(WorldAPI.getWorldCursor().getCursorObj3d().position);
            tempVec2.y+=20;

            for (var i = 0; i < dynamics.length;i++) {

                dynamics[i].getDynamicPosition(tempVec1);
                tempVec1.subVectors(tempVec2, tempVec1);
                distance = tempVec1.length();

                if (distance < maxRange) {
                    mass = dynamics[i].getDynamicMass();
                    tempVec1.normalize();
                    tempVec1.multiplyScalar(500 * (mass+200) * Math.sqrt(1/distance));
                    dynamics[i].applyForceVector(tempVec1);
                }
            }
        };

        var repelAllDyn = function(maxRange) {

            tempVec2.copy(WorldAPI.getWorldCursor().getCursorObj3d().position);
            tempVec2.y += 2;

            for (var i = 0; i < dynamics.length;i++) {

                dynamics[i].getDynamicPosition(tempVec1);
                tempVec1.subVectors(tempVec1, tempVec2);
                distance = tempVec1.length();

                if (distance < maxRange) {
                    mass = dynamics[i].getDynamicMass();
                    tempVec1.normalize();
                    tempVec1.multiplyScalar(1500 * (mass + 500) / (maxRange/distance+1));
                    dynamics[i].applyForceVector(tempVec1);
                }
            }
        //    WorldAPI.setCom(ENUMS.BufferChannels.REPEL_DYNAMICS, 0);
        };

        DynamicWorld.prototype.updateDynamicWorld = function() {

            if (WorldAPI.getCom(ENUMS.BufferChannels.SPAWM_BOX_RAIN)) {
                if (Math.random() < 0.5) {
                    tempVec1.copy(WorldAPI.getWorldCursor().getCursorPosition());
                    tempVec1.x += -190+Math.random()*380;
                    tempVec1.y += 15+Math.random()*165;
                    tempVec1.z += -190+Math.random()*380;

                    tempQuat.copy(WorldAPI.getWorldCursor().getCursorQuaternion());

                    scale = 1+Math.floor(Math.random()*9);

                    newDynRen = this.setupDynamicRenderable(geoms[Math.floor(Math.random()*geoms.length)], tempVec1, tempQuat, scale);
                    newDynRen.initRenderable(addDynamicRenderable);
                }
            }

            if (WorldAPI.getCom(ENUMS.BufferChannels.PUSH_ALL_DYNAMICS)) {
                pokeAllDyn();
            }

            if (WorldAPI.getCom(ENUMS.BufferChannels.ATTRACT_DYNAMICS)) {
                attractAllDyn(150);
            }

            if (WorldAPI.getCom(ENUMS.BufferChannels.REPEL_DYNAMICS)) {
                repelAllDyn(35);
            }

            for (var i = 0; i < dynamics.length;i++) {
                dynamics[i].tickRenderable();
            }


        };

        return DynamicWorld;

    });

