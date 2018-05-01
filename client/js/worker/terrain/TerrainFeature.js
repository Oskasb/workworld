"use strict";

define([
        'worker/terrain/TerrainElement',
        'worker/terrain/ShoreElement'
    ],
    function(
        TerrainElement,
        ShoreElement
    ) {

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();


        var TerrainFeature = function(area, origin, sideSize) {
            this.area = area;
            this.origin = new THREE.Vector3().copy(origin);
            this.extents = new THREE.Vector3(sideSize, sideSize, sideSize);
            this.center = new THREE.Vector3().copy(this.extents).multiplyScalar(0.5);
            this.center.addVectors(this.center, this.origin);

            this.terrainElements = [];
            this.shoreElements = [];
            this.lastShoreIdx = 0;
            this.age = 0;
        };

        TerrainFeature.prototype.generateFeatureGroundElements = function(gridSide) {

            var size = (this.extents.x/gridSide);

            for (var i = 0; i < gridSide; i++) {
                for (var j = 0; j < gridSide; j++) {

                    tempVec1.x = this.origin.x + i * size;
                    tempVec1.z = this.origin.z + j * size;
                    tempVec1.y = this.area.getHeightAndNormalForPos(tempVec1);

                    if (tempVec1.y > 0) {
                        var element = new TerrainElement(this.area, tempVec1, size);
                        element.determineTerrainElementType(this.terrainElements);
                        this.terrainElements.push(element);
                    }

                }
            }
        };


        TerrainFeature.prototype.generateFeatureShoreElements = function(gridSide) {

            var size = (this.extents.x/gridSide);

            for (var i = 0; i < gridSide; i++) {
                for (var j = 0; j < gridSide; j++) {

                    tempVec1.x = this.origin.x + i * size;
                    tempVec1.z = this.origin.z + j * size;
                    tempVec1.y = this.area.getHeightAndNormalForPos(tempVec1);

                    if (tempVec1.y > -8*Math.random()) {
                        if (tempVec1.y < 0 && 1 + Math.random()*Math.random() > tempVec1.y / -7) {
                            var element = new ShoreElement(this.area, tempVec1, size);
                            element.determineShoreElementType(this.shoreElements);
                            this.shoreElements.push(element);
                        }
                    }

                }
            }
        };


        TerrainFeature.prototype.updateTerrainFeatureFX = function(tpf) {

            this.stride = Math.floor(this.elements.length / 50);

            if (Math.random() > 0.25) {
                return;
            }

            if (this.lastStartIndex > this.stride) {
                this.lastStartIndex = 0;
            }

            for (var i = this.lastStartIndex; i < this.elements.length; i+=this.stride) {
                    this.elements[i].triggerTerrainFeatureEffect(fxByFeature[this.featureType], tpf)
            }

            this.lastStartIndex++;

        };


        TerrainFeature.prototype.updateFeatureVisibility = function(tpf, visible) {

            this.isVisible = visible;

            if (this.isVisible !== this.wasVisible) {
                for (var i = 0; i < this.terrainElements.length; i++) {
                    this.terrainElements[i].updateTerrainElementVisibility(tpf, this.isVisible)
                }

                if (visible) {
                    for (i = 0; i < this.shoreElements.length; i++) {
                        if (MATH.sillyRandom(this.age+tpf) < 0.5) {
                            this.shoreElements[i].updateShoreElementVisibility(tpf, this.isVisible)
                        }
                    }
                }
            }

            this.wasVisible = this.isVisible;

        };

        TerrainFeature.prototype.updateTerrainFeature = function(tpf) {

            this.age += tpf;

                for (var i = 0; i < this.terrainElements.length; i++) {
        //            this.terrainElements[i].updateTerrainElement(tpf, i)
                }

                if (MATH.sillyRandom(this.age+tpf) > 0.05 * tpf * this.shoreElements.length) {
                    return;
                }

                if (this.shoreElements.length) {
                    if (this.lastShoreIdx === this.shoreElements.length) {
                        this.lastShoreIdx = 0;
                    }

                    this.shoreElements[Math.floor(MATH.sillyRandom(this.lastShoreIdx+this.age)*this.shoreElements.length)].updateShoreElement(tpf);
                    this.lastShoreIdx++
                }

        };



        return TerrainFeature;

    });

