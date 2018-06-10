"use strict";

define([
        'worker/dynamic/DynamicLight',
        'ConfigObject',
    'PipelineAPI'
    ],
    function(
        DynamicLight,
        ConfigObject,
        PipelineAPI
    ) {

    var ci;
    var i;

        var DynamicLights = function(spatialBuffer) {
            this.buffer = spatialBuffer;
            this.lights = [];
            this.lightMap = {};
            this.dynamicCanvases = []
        };

        DynamicLights.prototype.addDynamicCanvas = function(dynCnv) {

            for (i = 0; i < this.lights.length; i++) {
                this.lights[i].setDynamicLightSourceCanvas(dynCnv.sourceImage);
            }

            this.dynamicCanvases.push(dynCnv);
        };

        DynamicLights.prototype.addDynamicLight = function(conf, idx) {
            var light = new DynamicLight(conf,  idx, this.buffer);

            this.lightMap[light.id] = light.index;
            this.lights[light.index] = light;

            for (ci = 0; ci < this.dynamicCanvases.length; ci++) {
                light.setDynamicLightSourceCanvas(this.dynamicCanvases[ci].sourceImage);
            }
        };

        DynamicLights.prototype.applyLightsConfig = function(config) {
            for (i = 0; i < config.length; i++) {
                this.addDynamicLight(config[i], i);
            }
        };

        DynamicLights.prototype.initDynamicLights = function(confId) {

            var lightConf = function(data) {
                var lights = data.lights;
                this.applyLightsConfig(lights)
            }.bind(this);

            this.configObject = new ConfigObject('DYNAMIC_TEXTURES', 'THREE', confId);
            this.configObject.addCallback(lightConf);
        };


        DynamicLights.prototype.attachModelConfig = function(modelId) {

            var modelConf = function() {

                var data = this.modelConfigObject.data;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === modelId) {

                        if (data[i].dynamic_texture) {
                            this.initDynamicLights(data[i].dynamic_texture)
                        }
                    }
                }

            }.bind(this);

            this.modelConfigObject = new ConfigObject('MODELS', 'THREE', 'data');
            this.modelConfigObject.addCallback(modelConf);

        };


        DynamicLights.prototype.getLightById = function(id) {
            return this.lights[this.lightMap[id]];
        };

        DynamicLights.prototype.updateDynamicLights = function() {
            for (ci = 0; ci < this.dynamicCanvases.length; ci++) {
                this.dynamicCanvases[ci].updateDynamicCanvase(this.lights)
            }
        };

        return DynamicLights;

    });

