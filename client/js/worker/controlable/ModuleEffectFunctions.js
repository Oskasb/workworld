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
        var tempVec2 = new THREE.Vector3();
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


        var randomPosAtShapeEdge = function(renderable, shape, store) {
            store.set(shape.size.x + (Math.random()*0.01) + shape.size.x * MATH.sign(shape.offset.x) * 2,  shape.size.y * (Math.random()-0.5), shape.size.z * (Math.random()-0.5));
            store.applyQuaternion(renderable.quat);
            store.applyQuaternion(shape.rotation);
        };

        var randomPosInShape = function(renderable, shape, store) {
            store.set(shape.size.x * (Math.random()-0.5),  shape.size.y * (Math.random()-0.5), shape.size.z * (Math.random()-0.5));
            store.applyQuaternion(renderable.quat);
            store.applyQuaternion(shape.rotation);
        };


        ModuleEffectFunctions.propellerEffect = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 30 > speed -4) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            randomPosInShape(renderable, target, tempVec2);

            fxArgs.pos.add(tempVec2);

            if (fxArgs.pos.y > 2) return;

            fxArgs.pos.y -= 2.5;
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

            randomPosInShape(renderable, target, tempVec2);
            fxArgs.pos.add(tempVec2);
            if (fxArgs.pos.y > 2) return;

            tempObj.quaternion.set(0, 0.72, 0.72, 0);
            tempObj.rotateZ(Math.random()*5);

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

            if (Math.random() * 5 > speed-1) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);


            fxArgs.vel.set(1*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);

            tempVec1.multiplyScalar(Math.random()*0.5);
            fxArgs.pos.add(tempVec1);

            randomPosAtShapeEdge(renderable, target, tempVec2);

            fxArgs.pos.add(tempVec2);

            if (fxArgs.pos.y > 2) return;

            fxArgs.pos.y = -2;

            spawnTargetEffect(renderable, target, 'prop_effect');

            if (Math.random() * 520 > speed -1) {
                return;
            }

            fxArgs.pos.sub(tempVec1);

            fxArgs.pos.y = 1.5;

            spawnTargetEffect(renderable, target, 'bow_splash');

        };

        ModuleEffectFunctions.rotateBoneX = function(renderable, moduleState, trgt) {

            var dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            dynBone.getDynamicBoneQuaternion(tempObj.quaternion);
            tempObj.rotateX(moduleState.getAppliedFactor());
            dynBone.setDynamicBoneQuaternion(tempObj.quaternion);

        };

        ModuleEffectFunctions.translateBoneX = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 5 > speed-1) {
                return;
            }

        };

        ModuleEffectFunctions.wakeEffect = function(renderable, moduleState, trgt) {
            speed = renderable.getDynamicSpeed();

            if (Math.random() * 520 > speed -3) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            randomPosAtShapeEdge(renderable, target, tempVec2);
            if (fxArgs.pos.y > 2) return;

            fxArgs.vel.copy(target.offset);
            fxArgs.vel.z = 0;
            fxArgs.vel.normalize();

            fxArgs.pos.add(tempVec2);
            fxArgs.pos.y = 1.5;
            fxArgs.vel.applyQuaternion(renderable.quat);
            spawnTargetEffect(renderable, target, 'bow_splash');

        };

        return ModuleEffectFunctions;

    });

