"use strict";

define([
        'EffectsAPI',
        'worker/geometry/GeometryInstance'
    ],
    function(
        EffectsAPI,
        GeometryInstance
    ) {

        var fxByFeature = [
            "water_foam_particle_effect",
            "water_foam_particle_effect",
            "model_geometry_wall_rock_50_effect",
            "model_geometry_tree_3_combined_effect",
            "crate_wood_geometry_effect",
            "model_geometry_tree_3_combined_effect",
            "crate_wood_geometry_effect",
            "water_shade_particle_effect",
            "crate_wood_geometry_effect"
        ];

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempObj3D = new THREE.Object3D();
        var fxArg = {effect:"firey_explosion_core", pos:tempVec1, vel:tempVec2};

        var ShoreElement = function(area, origin, sideSize) {

            this.area = area;
            this.origin = new THREE.Vector3().copy(origin);
            this.extents = new THREE.Vector3(sideSize, sideSize, sideSize);
            this.center = new THREE.Vector3().copy(this.extents).multiplyScalar(0.5);
            this.center.addVectors(this.center, this.origin);

            this.terrainElements = [];
            this.elementType = 0;
            this.scale = 1;

            this.shoreDepth = -100;

            this.effects = [];
        };


        ShoreElement.prototype.testTerrainElementsForType = function(elements, type) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].elementType === type) {
                    return true;
                }
            }
        };

        ShoreElement.prototype.visualizeShoreElement = function(pos, quat) {
            this.fxId = fxByFeature[this.elementType];
            this.geometryInstance = new GeometryInstance(this.fxId);
            this.geometryInstance.setInstancePosition(pos);
            this.geometryInstance.setInstanceQuaternion(quat);
            this.geometryInstance.setInstanceSize(this.scale);
        };

        ShoreElement.prototype.determineShoreElementType = function(otherElements) {

            tempVec1.x = this.center.x;
            tempVec1.z = this.center.z;
            tempVec1.y = this.area.getHeightAndNormalForPos(tempVec1, tempVec2);

            tempObj3D.position.x = 0;
            tempObj3D.position.z = 0;
            tempObj3D.position.y = 0;

            tempObj3D.quaternion.set(0, 0, 0, 1);
            tempObj3D.lookAt(tempVec2);
            tempObj3D.rotateX(Math.PI * 0.5);
        //    tempObj3D.rotateY(Math.PI * Math.random());



            if (tempVec1.y < 0) {

                this.shoreDepth = tempVec1.y;
                tempVec1.y = 0.5;

                if (this.shoreDepth > -2) {

                    tempVec1.x += tempVec2.z * this.shoreDepth * 3;
                    //    tempObj3D.position.y += tempVec2.y * tempObj3D.position.y;
                    tempVec1.z += tempVec2.x * this.shoreDepth * 3;

                    this.elementType = ENUMS.TerrainFeature.SHORELINE;

                //    this.visualizeShoreElement(tempVec1, tempObj3D.quaternion);

                } else {

                    tempVec1.x -= tempVec2.z * this.shoreDepth * 3;
                    //    tempObj3D.position.y += tempVec2.y * tempObj3D.position.y;
                    tempVec1.z -= tempVec2.x * this.shoreDepth * 3;

                    this.scale = 0.3;
                    this.elementType = ENUMS.TerrainFeature.SHALLOW_WATER;
                }

                this.center.copy(tempVec1);

                if (this.testTerrainElementsForType(otherElements, this.elementType)) {
            //        return;
                }


            }

        };



        ShoreElement.prototype.triggerShoreEffect = function(fxId, tpf) {
            this.fxId = fxId;

            if (this.effects.length) {
            //    if (Math.random() < tpf*this.effects.length * 2) {
                    EffectsAPI.returnPassiveEffect(this.effects.pop())
            //    }
            }

            if (true) {

                fxArg.effect = fxByFeature[this.elementType];

            //    this.normal.x = (Math.random()-0.5) * 5;
            //    this.normal.z = (Math.random()-0.5) * 5;
            //    this.normal.y = 0;

            //    this.effects.unshift(EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion))
            //    EffectsAPI.requestTemporaryPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion, 10)

            //    fxArg.effect = this.fxId;
            //    fxArg.vel.copy(this.normal);
            //    fxArg.vel.normalize();

                fxArg.vel.x = 0;
                fxArg.vel.y = 0;
                fxArg.vel.z = 1;

            //    fxArg.vel.applyQuaternion(this.object3d.quaternion);

                fxArg.vel.x = 0;
                fxArg.vel.y = 1;
                fxArg.vel.z = 0;

                tempObj3D.position.x = 0;
                tempObj3D.position.z = 0;
                tempObj3D.position.y = 0;

                tempObj3D.lookAt(fxArg.vel);
                tempObj3D.rotateZ(Math.random()*Math.PI);

            //    fxArg.vel.copy(this.normal);

            //    fxArg.vel.y = 0;
            //    fxArg.vel.normalize();

                this.effects.unshift(EffectsAPI.requestPassiveEffect(fxArg.effect, this.center, fxArg.vel, null, tempObj3D.quaternion))

                // EffectsAPI.requestTemporaryPassiveEffect(fxArg.effect, fxArg.pos, fxArg.vel, 10, this.object3d.quaternion, 3);

                //      evt.fire(evt.list().GAME_EFFECT, fxArg);
            }

        };


        ShoreElement.prototype.updateShoreElementVisibility = function(tpf, visible) {

            this.triggerShoreEffect();

        };

        ShoreElement.prototype.updateShoreElement = function(tpf, idx) {

        //    if (this.elementType === ENUMS.TerrainFeature.SHORELINE) {
                this.triggerShoreEffect();
        //    }

        };

        return ShoreElement;

    });

