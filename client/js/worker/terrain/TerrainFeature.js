"use strict";

define([
        'worker/terrain/TerrainElement'
    ],
    function(
        TerrainElement
    ) {


        var fxByFeature = [
            "water_foam_particle_effect",
            "model_geometry_tree_3_combined_effect",
            "model_geometry_tree_3_combined_effect",
            "model_geometry_tree_3_combined_effect",
            "model_geometry_tree_3_combined_effect"
        ];

        var TerrainFeature = function(featureType) {
            this.featureType = featureType;
            this.featureKey = ENUMS.Map.TerrainFeature[featureType];
            this.elements = [];
            this.lastStartIndex = 0;
            this.stride = 85;
        };


        TerrainFeature.prototype.generateTerrainElement = function(pos, normal) {
            this.elements.push(new TerrainElement(pos, normal))
        };

        TerrainFeature.prototype.visualizeFeatureElements = function() {

            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].visualizeTerrainElement(fxByFeature[this.featureType])
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

        return TerrainFeature;

    });

