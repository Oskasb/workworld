"use strict";

define([
        'worker/dynamic/DynamicLight'
    ],
    function(
        DynamicLight
    ) {

    var i;

        var DynamicLights = function(spatialBuffer) {
            this.buffer = spatialBuffer;
            this.lights = [];
            this.lightMap = {};
        };

        DynamicLights.prototype.addDynamicLight = function(boneConfig) {
            var light = new DynamicLight(boneConfig.id,  boneConfig.index, this.buffer);


            this.lightMap[boneConfig.name] = boneConfig.index;
            this.lights[boneConfig.index] = light;
        };

        DynamicLights.prototype.applyLightsConfig = function(config) {
            for (i = 0; i < config.length; i++) {
                this.addDynamicLight(config[i].data);
            }
        };

        DynamicLights.prototype.attachModelBone = function(bone, boneConfig) {

            // this.bones[boneConfig.index].inheritBonePosAndQuat(bone.position, bone.quaternion);

        };

        DynamicLights.prototype.getLightById = function(id) {
            return this.lights[this.lightMap[id]];
        };

        DynamicLights.prototype.updateDynamicLights = function() {
            for (i = 0; i < this.lights.length; i++) {
                this.lights[i].updateDynamicLight();
            }
        };

        return DynamicLights;

    });

