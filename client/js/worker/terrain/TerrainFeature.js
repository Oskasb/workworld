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

            for (var i = 0; i < this.elements.length; i++) {
                if (Math.random() < 0.1) {
                    this.elements[i].triggerTerrainFeatureEffect(fxByFeature[this.featureType], tpf)
                }
            }
        };

        return TerrainFeature;

    });

