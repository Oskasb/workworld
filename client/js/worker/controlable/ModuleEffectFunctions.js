"use strict";

define([
        'Events'
    ],
    function(
        evt
    ) {

        var target;

        var speed;

        var tempVec1 = new THREE.Vector3();
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

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 30 > speed -4) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
            fxArgs.pos.y -= 6.5;
            fxArgs.vel.set(2*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);
            fxArgs.vel.y +=0.1;
            spawnTargetEffect(renderable, target, 'prop_effect');
        };

        ModuleEffectFunctions.rudderEffect = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 220 > speed -3) {
                return;
            }

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

            speed = renderable.getDynamicSpeed();


            target = renderable.getSpatialShapeById(trgt);
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            fxArgs.vel.set(1*(Math.random()-0.5), 1, -1*(Math.random()+0.5));


            if (Math.random() * 5 > speed-1) {
                return;
            }

            fxArgs.vel.applyQuaternion(renderable.quat);

            fxArgs.pos.y = -2;
            tempVec1.multiplyScalar(Math.random()*1);
            fxArgs.pos.add(tempVec1);
            spawnTargetEffect(renderable, target, 'prop_effect');

            if (Math.random() * 520 > speed -1) {
                return;
            }

            fxArgs.pos.sub(tempVec1);

            fxArgs.pos.y = 1.5;

            spawnTargetEffect(renderable, target, 'bow_splash');




        };

        ModuleEffectFunctions.wakeEffect = function(renderable, moduleState, trgt) {
            speed = renderable.getDynamicSpeed();

            if (Math.random() * 520 > speed -3) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            fxArgs.vel.set(1*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.pos.y = 1.5;
            spawnTargetEffect(renderable, target, 'bow_splash');
            fxArgs.vel.applyQuaternion(renderable.quat);
        };

        return ModuleEffectFunctions;

    });

