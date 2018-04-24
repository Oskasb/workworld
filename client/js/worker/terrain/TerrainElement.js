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
            "model_geometry_tree_3_combined_effect",
            "model_geometry_tree_3_combined_effect",
            "model_geometry_tree_3_combined_effect",
            "creative_crate_geometry_effect",
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

        TerrainElement.prototype.visualizeTerrainElement = function(obj3d) {
            this.fxId = fxByFeature[this.elementType];
            this.geometryInstance = new GeometryInstance(this.fxId);
            this.geometryInstance.setInstancePosition(obj3d.position);
            this.geometryInstance.setInstanceQuaternion(obj3d.quaternion);
            this.geometryInstance.setInstanceSize(this.scale);
        };

        TerrainElement.prototype.determineTerrainElementType = function(otherElements) {

            tempObj3D.position.x = this.center.x;
            tempObj3D.position.z = this.center.z;
            tempObj3D.position.y = this.area.getHeightAndNormalForPos(tempObj3D.position, tempVec2);

            if (tempObj3D.position.y > 0) {

                if (tempObj3D.position.y > 5 && tempVec2.y > 0.95) {

                    tempObj3D.lookAt(tempVec2);

                    if (!this.testTerrainElementsForType(otherElements, ENUMS.TerrainFeature.WOODS)) {
                        this.scale = 0.5 // 2*(Math.random()+0.5) * Math.random();
                        tempObj3D.position.y += 6 * this.scale;

                        this.elementType = ENUMS.TerrainFeature.WOODS;

                    } else {
                        this.scale = 2;
                        this.elementType = ENUMS.TerrainFeature.FLAT_GROUND;
                    }
                }

                this.visualizeTerrainElement(tempObj3D);
                return;
            } else {

                if (tempObj3D.position.y > -3) {
                    this.elementType = ENUMS.TerrainFeature.SHORELINE;
                }


            }



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

                tempObj3D.position.x += 0.1*Math.cos(WorldAPI.getWorldTime()*0.3 + idx);
                tempObj3D.position.z += 0.1*Math.sin(WorldAPI.getWorldTime()*0.3 + idx);
                tempObj3D.position.y += 0.1*Math.sin(WorldAPI.getWorldTime()*0.2 + idx);

                this.geometryInstance.getInstanceQuaternion(tempObj3D.quaternion);

                tempObj3D.rotateY(tpf*2);
                tempObj3D.rotateZ(tpf*2);

                this.geometryInstance.setInstancePosition(tempObj3D.position);
                this.geometryInstance.setInstanceQuaternion(tempObj3D.quaternion);

            }

        };

        return TerrainElement;

    });

