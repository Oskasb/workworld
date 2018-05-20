"use strict";

define([
        'Events'
    ],
    function(
        evt
    ) {

        var target;

        var fxPos = new THREE.Vector3();
        var fxVel = new THREE.Vector3();
        var fxQuat = new THREE.Quaternion();
        var tempObj = new THREE.Object3D();

        var up = new THREE.Vector3(0, 1, 0);

        tempObj.lookAt(up);
        var fxArgs = {effect:'', pos:fxPos, vel:fxVel, quat:fxQuat};

        var ModuleEffectFunctions = function() {

        };

        var spawnTargetEffect = function(renderable, target, fxId) {
            fxArgs.effect = fxId;
            evt.fire(evt.list().WATER_EFFECT, fxArgs);
        };

        ModuleEffectFunctions.propellerEffect = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
            fxArgs.pos.y -= 6.5;
            fxArgs.vel.set(2*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);
            fxArgs.vel.y +=0.1;
            spawnTargetEffect(renderable, target, 'prop_effect');
        };

        ModuleEffectFunctions.rudderEffect = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
            fxArgs.quat.copy(tempObj.quaternion);
            fxArgs.pos.y = 1.5;
            fxArgs.vel.set(0, 0, 0);
            spawnTargetEffect(renderable, target, 'wake_effect');
        };


        ModuleEffectFunctions.baseEffect = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            spawnTargetEffect(renderable, target, 'prop_effect');
        };

        ModuleEffectFunctions.bowEffect = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
            fxArgs.pos.y = -2;
            fxArgs.vel.set(1*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);
            fxArgs.vel.y +=0.1;
            spawnTargetEffect(renderable, target, 'prop_effect');
            fxArgs.pos.y = 1.5;
            spawnTargetEffect(renderable, target, 'wake_effect');

        };

        return ModuleEffectFunctions;

    });

