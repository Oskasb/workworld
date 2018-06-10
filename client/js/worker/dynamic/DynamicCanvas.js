"use strict";

define([
        'ui/canvas/CanvasDraw'
    ],
    function(
        CanvasDraw
    ) {

    var i;

        var rgbaData = [0, 0, 0, 0];

        var intensity;

        var x;
        var y;
        var w;
        var h;

        var DynamicCanvas = function(cnvTx, id) {
            this.id = id;
            this.texture = cnvTx;
            this.ctx = cnvTx.ctx;
            this.bufferImgId = cnvTx.bufferImgId;

            this.sourceImage = this.texture.sourceImage;
            this.width = this.texture.canvas.width;
            this.height = this.texture.canvas.height;
        };

        DynamicCanvas.prototype.updateCanvasLight = function(light) {

            if (light.dynamicLightUpdated()) {

                intensity = light.getDynamicLightIntensity();

                if (intensity !== 0) {
                    x = light.getCoordX();
                    y = light.getCoordY();
                    w = light.getCoordW();
                    h = light.getCoordH();
                    this.ctx.drawImage(light.getSourceCanvas(), x, y, w, h);
                }

                if (intensity !== 1) {
                    rgbaData[0] = 0;
                    rgbaData[1] = 0;
                    rgbaData[2] = 0;
                    rgbaData[3] = 1 - intensity;
                    CanvasDraw.attenuateContextRect(x, y, w, h, this.ctx, CanvasDraw.toRgba(rgbaData));
                }
            }
        };

        DynamicCanvas.prototype.updateCanvasLights = function(lights) {
            for (i = 0; i < lights.length; i++) {
                this.updateCanvasLight(lights[i])
            }
        };

        DynamicCanvas.prototype.updateDynamicCanvase = function(lights) {

            this.updateCanvasLights(lights);
            this.texture.needsUpdate = true;
        };

        return DynamicCanvas;

    });
