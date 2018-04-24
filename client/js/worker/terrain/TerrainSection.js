"use strict";

define([
        'worker/terrain/TerrainFeature'
    ],
    function(
        TerrainFeature
    ) {

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();

        var TerrainSection = function(area, origin, sideSize) {
            this.area = area;
            this.origin = new THREE.Vector3().copy(origin);
            this.extents = new THREE.Vector3(sideSize, sideSize, sideSize);
            this.center = new THREE.Vector3().copy(this.extents).multiplyScalar(0.5);
            this.center.addVectors(this.center, this.origin);

            this.terrainFeatures = [];
            this.wasVisible = false;
        };

        TerrainSection.prototype.genereateSectionFeatures = function(gridSide) {

            var size = (this.extents.x/gridSide);

            for (var i = 0; i < gridSide; i++) {
                for (var j = 0; j < gridSide; j++) {

                    tempVec1.x = this.origin.x + i * size;
                    tempVec1.z = this.origin.z + j * size;
                    tempVec1.y = this.area.getHeightAndNormalForPos(tempVec1);

                    var feature = new TerrainFeature(this.area, tempVec1, size);
                    feature.generateFeatureElements(2);
                    this.terrainFeatures.push(feature);
                }
            }
        };


        TerrainSection.prototype.updateSectionVisibility = function(tpf) {

            this.isVisible = WorldAPI.visibilityTest(this.center, this.extents.x);

            if (this.wasVisible === this.isVisible) {
                return;
            }

            for (var i = 0; i < this.terrainFeatures.length; i++) {
                this.terrainFeatures[i].updateFeatureVisibility(tpf, this.isVisible);
            }

            this.wasVisible = this.isVisible;

        };

        TerrainSection.prototype.updateTerrainSection = function(tpf) {

            this.updateSectionVisibility(tpf);

            if (this.isVisible) {
                for (var i = 0; i < this.terrainFeatures.length; i++) {
                    this.terrainFeatures[i].updateTerrainFeature(tpf, this.isVisible)
                }
            }


        };

        return TerrainSection;

    });

