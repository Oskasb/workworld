"use strict";

define([

    ],
    function(

    ) {

        var DynamicLight = function(conf, idx, buffer) {

            this.id = conf.id;
            this.txcoords = conf.txcoords;
            this.index = idx;
            this.buffer = buffer;

            this.lastIntensity = 0;

            this.bsi = ENUMS.BufferSpatial.LIGHT_FIRST_INDEX + ENUMS.DynamicLight.STRIDE * this.index;

            if (this.bsi > ENUMS.BufferSpatial.BUFFER_SIZE + ENUMS.DynamicLight.STRIDE) {
                console.log("LIGHT BUFFER OVERFLOW..", this.bsi);
            }

        };

        DynamicLight.prototype.setDynamicLightSourceCanvas = function(sourceCanvas) {
            this.sourceCanvas = document.createElement('canvas');
            this.sourceCtx = this.sourceCanvas.getContext('2d');
            this.sourceCanvas.width = this.getCoordW();
            this.sourceCanvas.height = this.getCoordH();
            this.sourceCtx.drawImage(sourceCanvas, this.getCoordX(), this.getCoordY(), this.getCoordW(), this.getCoordH(), 0, 0, this.getCoordW(), this.getCoordH())
        };

        DynamicLight.prototype.setDynamicLightIntensity = function(value) {
            this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY] = Math.clamp(value, 0, 1);
        };

        DynamicLight.prototype.setDynamicLightUpdate = function(bool) {
            this.buffer[this.bsi + ENUMS.DynamicLight.HAS_UPDATE] = bool;
            if (bool === 0) {
            }
        };

        DynamicLight.prototype.getDynamicLightUpdate = function() {
            return this.buffer[this.bsi + ENUMS.DynamicLight.HAS_UPDATE];
        };

        DynamicLight.prototype.getDynamicLightIntensity = function() {
            this.lastIntensity = this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY];
            return this.lastIntensity;
        };

        DynamicLight.prototype.dynamicLightUpdated = function() {
            return this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY] !== this.lastIntensity;
        };

        DynamicLight.prototype.setDynamicLightIntensity = function(value) {
            this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY] = Math.round(value * 100) / 100;
        };

        DynamicLight.prototype.getCoordX = function() {
            return this.txcoords[0];
        };

        DynamicLight.prototype.getCoordY = function() {
            return this.txcoords[1];
        };

        DynamicLight.prototype.getCoordW = function() {
            return this.txcoords[2];
        };

        DynamicLight.prototype.getCoordH = function() {
            return this.txcoords[3];
        };

        DynamicLight.prototype.getSourceCanvas = function() {
            return this.sourceCanvas;
        };

        DynamicLight.prototype.updateDynamicBone = function() {

            if (this.getDynamicLightUpdate()) {

            }

        };

        return DynamicLight;

    });

