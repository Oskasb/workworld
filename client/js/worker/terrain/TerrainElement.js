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

        var i;
        var elemMap = {};
        elemMap[ENUMS.TerrainFeature.WOODS] = "tree_leafy_1";
        elemMap[ENUMS.TerrainFeature.STEEP_SLOPE] = "wall_rock_1";
        elemMap[ENUMS.TerrainFeature.FLAT_GROUND] = "tree_leafy_2";


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

            this.renderables = [];
        };

        TerrainElement.prototype.addRenderable = function(ren) {
            this.renderables.push(ren);
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

                if (tempVec1.y > 1 && tempVec2.y > 0.92) {

                    if (!this.testTerrainElementsForType(otherElements, ENUMS.TerrainFeature.WOODS)) {
                        this.scale = Math.floor(10*(Math.random()*Math.random()))+2;
                        tempVec1.y += 6.5 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.WOODS;

                    } else {

                        if (Math.random() < 0.5) return;

                        this.scale =  1.5 + Math.floor(5*(Math.random()));
                        tempVec1.y += 6 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.WOODS;
                    }
                } else {

                    if (tempVec2.y > 0.70) {
                        this.scale = 0.2 * Math.floor(4*(Math.random()))+0.5;
                        tempVec1.y += 2.5 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.STEEP_SLOPE;
                    } else {
                        this.scale = Math.floor(4*(Math.random()))*0.1 +0.2;
                        tempVec1.y += 2 * this.scale;
                        this.elementType = ENUMS.TerrainFeature.STEEP_SLOPE;
                    }

                }

            } else {
                return
            }

            return WorldAPI.buildDynamicRenderable(elemMap[this.elementType], tempVec1, tempObj3D.quaternion, this.scale);

        //    this.visualizeTerrainElement(tempVec1, tempObj3D.quaternion);
        };


        TerrainElement.prototype.updateTerrainElement = function(tpf, visible) {

                for (i = 0; i < this.renderables.length; i++) {
                    this.renderables[i].tickRenderable();
                }
        };


        TerrainElement.prototype.updateTerrainElementVisibility = function(tpf, visible) {

                for (i = 0; i < this.renderables.length; i++) {
                    this.renderables[i].applyRenderableVisibility(visible);
                }

        };


        return TerrainElement;

    });

