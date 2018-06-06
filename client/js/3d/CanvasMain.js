"use strict";


define([
    'Events',
    '3d/SimpleSpatial',
    '3d/CanvasGuiThree',
    'ui/canvas/CanvasDraw',
    'PipelineAPI',
    'ThreeAPI'

], function(
    evt,
    SimpleSpatial,
    CanvasGuiThree,
    CanvasDraw,
    PipelineAPI,
    ThreeAPI
) {

    var i;
    var canvases = [];
    var canvasMap = {};
    var msg;

    var aerodynId = 'aerodynamics';

    var attenuateColor = 'rgba(0.5, 0.25, 0, 0.2)';

    var drawRandomlyOnContext = function(w, h, ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(
            Math.floor(Math.random()*w/2),
            Math.floor(Math.random()*h/2),
            Math.floor(Math.random()*w/2),
            Math.floor(Math.random()*h/2)
        );
    };

    var attenuateContext = function(w, h, ctx) {

        ctx.fillStyle = attenuateColor;
        ctx.fillRect(
            0,
            0,
            w,
            h
        );

    };

    var addCanvasThree = function(cnvGuiThree) {
        canvases.push(cnvGuiThree);
    };

    var removeCanvasThree = function(cnvGuiThree) {
        cnvGuiThree.remove3dGuiHost();
        canvases.splice(canvases.indexOf(cnvGuiThree), 1);
        delete canvasMap[cnvGuiThree.id];
    };

    var CanvasMain = function() {

    };

    CanvasMain.prototype.removeDynamicCanvas = function(id) {
        removeCanvasThree(canvasMap[id])
    };

    CanvasMain.prototype.addDynamicCanvas = function(id, resolution, conf) {
        var cnvGuiThree = new CanvasGuiThree(id, resolution, conf)
        canvasMap[id] = cnvGuiThree;
        addCanvasThree(cnvGuiThree);
    };


    CanvasMain.prototype.drawAerodynamics = function(cnvGuiThree) {

        var controlSpat = WorkerAPI.getDynamicByPointer(WorkerAPI.getCom(ENUMS.BufferChannels.CONTROLLED_POINTER));
        if (controlSpat) {
            attenuateContext(cnvGuiThree.resolution, cnvGuiThree.resolution, cnvGuiThree.ctx);
            CanvasDraw.drawAerodynamicDebug(controlSpat, cnvGuiThree);
            drawRandomlyOnContext(cnvGuiThree.resolution, cnvGuiThree.resolution, cnvGuiThree.ctx)
        }

    };

    CanvasMain.prototype.updateCanvasState = function() {

        if (WorkerAPI.getCom(ENUMS.BufferChannels.DRAW_AERODYNAMICS)) {

            if (!this.aerodyns) {

                var conf = {
                    element:{
                        pos:[0.0, 0.0],
                        size:[1.0, 1.0],
                        blendMode:"AdditiveBlending"
                    }
                };

                this.addDynamicCanvas(aerodynId, 1024, conf)
            }

            this.aerodyns = true;

            this.drawAerodynamics(canvasMap[aerodynId])

        } else if (this.aerodyns) {
            this.removeDynamicCanvas(aerodynId);
            this.aerodyns = false;
        }

    };

    CanvasMain.prototype.updateCanvasElement = function(cnvGuiThree) {
        cnvGuiThree.updateCanvasGui();
    };


    CanvasMain.prototype.updateCanvasTextures = function() {
        for (i = 0; i < canvases.length; i++) {
            this.updateCanvasElement(canvases[i])
        }
    };

    CanvasMain.prototype.updateCanvasMain = function() {
        this.updateCanvasState();
        this.updateCanvasTextures();
    };

    return CanvasMain;

});