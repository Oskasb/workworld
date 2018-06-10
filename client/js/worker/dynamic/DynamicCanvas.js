"use strict";

define([
        'ui/canvas/CanvasDraw',
    'PipelineAPI'
    ],
    function(
        CanvasDraw,
        PipelineAPI
    ) {

    var i;

        var rgbaData = [0, 0, 0, 0];

        var DynamicCanvas = function(cnvTx, id) {
            this.id = id;
            this.texture = cnvTx;
            this.ctx = cnvTx.ctx;
            this.bufferImgId = cnvTx.bufferImgId;

            this.sourceImage = this.texture.sourceImage;
            this.width = this.texture.canvas.width;
            this.height = this.texture.canvas.height;
        };


        DynamicCanvas.prototype.updateDynamicCanvase = function() {

            rgbaData[0] = Math.random()*0.0;
            rgbaData[1] = Math.random()*0.0;
            rgbaData[2] = Math.random()*0.0;
            rgbaData[3] = Math.random()*0.5;
     //   CanvasDraw.fillWithImage(this.width, this.height, this.ctx, this.sourceImage);

            this.ctx.drawImage(this.sourceImage, 0, 0, this.width, this.height, 0, 0, this.width, this.height);

            CanvasDraw.attenuateContext(this.width, this.height, this.ctx, CanvasDraw.toRgba(rgbaData));

        //    this.ctx.globalCompositeOperation = 'source-over';
        //
        //    this.ctx.drawImage(this.sourceCanvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);

            this.texture.needsUpdate = true;

        //   this.texture.needsUpdate = true;

        };

        return DynamicCanvas;

    });

