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
            "creative_crate_geometry_effect",

            "model_geometry_wall_rock_50_effect",
            "model_geometry_tree_3_combined_effect",
            "crate_wood_geometry_effect",
            "model_geometry_tree_3_combined_effect"
        ];

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempObj3D = new THREE.Object3D();
        var fxArg = {effect:"firey_explosion_core", pos:tempVec1, vel:tempVec2};

        var TerrainElement = function(area, origin, sideSize) {

            this.area = area;
            this.origin = new THREE.Vector3().copy(origin);
            this.extents = new THREE.Vector3(sideSize, sideSize, sideSize);
            this.center = new THREE.Vector3().copy(this.extents).multiplyScalar(0.5);
            this.center.addVectors(this.center, this.origin);

            this.terrainElements = [];
            this.elementType = 0;
            this.scale = 1;
        };


        TerrainElement.prototype.testTerrainElementsForType = function(elements, type) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].elementType === type) {
                    return true;
                }
            }
        };

        TerrainElement.prototype.visualizeTerrainElement = function(pos, quat) {
            this.fxId = fxByFeature[this.elementType];
            this.geometryInstance = new GeometryInstance();
            this.geometryInstance.setInstanceFxId(this.fxId);
            this.geometryInstance.setObject3d(new THREE.Object3D());

            this.geometryInstance.setInstancePosition(pos);
            this.geometryInstance.setInstanceQuaternion(quat);
            this.geometryInstance.setInstanceSize(this.scale);
        };

        TerrainElement.prototype.determineTerrainElementType = function(otherElements) {

            if (Math.random() < 0.5) return;

            tempVec1.x = this.center.x + (Math.random()-0.5)*this.extents.x * 0.5;
            tempVec1.z = this.center.z + (Math.random()-0.5)*this.extents.x * 0.5;
            tempVec1.y = this.area.getHeightAndNormalForPos(tempVec1, tempVec2);

            tempObj3D.position.x = 0;
            tempObj3D.position.z = 0;
            tempObj3D.position.y = 0;

            tempObj3D.quaternion.set(0, 0, 0, 1);
            tempObj3D.lookAt(tempVec2);
            tempObj3D.rotateX(Math.PI * 0.5);

            tempObj3D.rotateY(Math.PI * Math.random());

            if (tempVec1.y > 0) {

                if (tempVec1.y > 1 && tempVec2.y > 0.95) {

                    if (!this.testTerrainElementsForType(otherElements, ENUMS.TerrainFeature.WOODS)) {
                        this.scale = 7.5*(Math.random())+0.3;
                        tempVec1.y += 6 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.WOODS;

                    } else {

                        if (Math.random() < 0.5) return;

                        this.scale =  0.5 + 5.2*(Math.random()+0.4) * Math.random();
                        tempVec1.y += 6 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.WOODS;
                    }
                } else {

                    if (tempVec2.y > 0.80) {
                        this.scale = 0.3
                        tempVec1.y += 6 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.FLAT_GROUND;
                    } else {
                        this.scale = 0.1 + 0.2*(Math.random()+0.5) * Math.random();
                        tempVec1.y += 6 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.STEEP_SLOPE;
                    }

                }

            } else {
                return
            }

            this.visualizeTerrainElement(tempVec1, tempObj3D.quaternion);

        };

        TerrainElement.prototype.triggerTerrainFeatureEffect = function(fxId, tpf) {
            this.fxId = fxId;

            if (this.effects.length) {
            //    if (Math.random() < tpf*this.effects.length * 2) {
                    EffectsAPI.returnPassiveEffect(this.effects.pop())
            //    }
            }

            if (true) {

                fxArg.effect = "water_foam_particle_effect";

            //    this.normal.x = (Math.random()-0.5) * 5;
            //    this.normal.z = (Math.random()-0.5) * 5;
            //    this.normal.y = 0;

            //    this.effects.unshift(EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion))
            //    EffectsAPI.requestTemporaryPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion, 10)

            //    fxArg.effect = this.fxId;
                fxArg.pos.copy(this.object3d.position);
            //    fxArg.vel.copy(this.normal);

            //    fxArg.vel.normalize();

                fxArg.vel.x = 0;
                fxArg.vel.y = 0;
                fxArg.vel.z = 1;

            //    fxArg.vel.applyQuaternion(this.object3d.quaternion);

                fxArg.vel.x = 0;
                fxArg.vel.y = 1;
                fxArg.vel.z = 0;

                tmpObj3D.lookAt(fxArg.vel);
                tmpObj3D.rotateZ(Math.random()*Math.PI);

                fxArg.vel.copy(this.normal);

                    fxArg.vel.y = 0;
                    fxArg.vel.normalize();

                this.effects.unshift(EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, fxArg.vel, null, tmpObj3D.quaternion))

                // EffectsAPI.requestTemporaryPassiveEffect(fxArg.effect, fxArg.pos, fxArg.vel, 10, this.object3d.quaternion, 3);

                //      evt.fire(evt.list().GAME_EFFECT, fxArg);
            }

        };


        TerrainElement.prototype.updateTerrainElementVisibility = function(tpf, visible) {

            if (this.geometryInstance) {
                if (visible) {
                    this.geometryInstance.renderGeometryInstance();
                } else {
                    this.geometryInstance.hideGeometryInstance();
                }
            }

        };

        TerrainElement.prototype.updateTerrainElement = function(tpf, idx) {

            if (this.geometryInstance) {

                this.geometryInstance.getInstancePosition(tempObj3D.position);

            //    tempObj3D.position.x += 0.001*Math.cos(WorldAPI.getWorldTime()*0.3 + idx);
            //    tempObj3D.position.z += 0.001*Math.sin(WorldAPI.getWorldTime()*0.3 + idx);
                tempObj3D.position.y += 0.001*Math.sin(WorldAPI.getWorldTime()*0.2 + idx*idx);

                this.geometryInstance.getInstanceQuaternion(tempObj3D.quaternion);

                tempObj3D.rotateY(tpf*2);
                tempObj3D.rotateZ(tpf*2);

                this.geometryInstance.setInstancePosition(tempObj3D.position);
                this.geometryInstance.setInstanceQuaternion(tempObj3D.quaternion);

            }

        };

        return TerrainElement;

    });

