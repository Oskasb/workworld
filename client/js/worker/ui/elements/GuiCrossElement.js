"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiEdgeElement',
        'ui/functions/GuiCrossLayout'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiEdgeElement,
        GuiCrossLayout
    ) {

        var GuiCrossElement = function() {

            this.textElements = [];

            this.hover = false;
            this.press = false;
            this.on = false;
            this.disabled = false;

            this.callbacks = {
                hover   : [],
                press   : [],
                release : []
            };

            this.centerPosition = new THREE.Vector3();

            this.guiCrossLayout = new GuiCrossLayout();

            this.top = new GuiEdgeElement();
            this.left = new GuiEdgeElement();
            this.right = new GuiEdgeElement();
            this.bottom = new GuiEdgeElement();

        };

        GuiCrossElement.prototype.initCrossElement = function(onReadyCB) {

            var cornersReady = function() {
                onReadyCB(this);
            }.bind(this);

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.initCrossElements(cornersReady);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_CROSS_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiCrossElement.prototype.initCrossElements = function(cornersReady) {

            var tl = function(edge) {
                edge.setRotation(0, 0, -Math.PI * 0.5);
                cornersReady();
            }.bind(this);

            var r = function(edge) {
                edge.getEdgeQuaternion().set(1, 0, 0, 0);
                this.right.initEdgeElement(tl)
            }.bind(this);

            var b = function(edge) {
                edge.setRotation(0, 0, Math.PI * 0.5);
                this.bottom.initEdgeElement(r)
            }.bind(this);

            var l = function(edge) {
                edge.getEdgeQuaternion().set(0, 0, 0, 1);
                this.left.initEdgeElement(b)
            }.bind(this);

            this.top.initEdgeElement(l)

        };

        GuiCrossElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiCrossElement.prototype.applySurfaceData = function(posVec, surfaceData) {

            this.guiCrossLayout.setRootPosition(posVec);
            this.guiCrossLayout.parseLaoutConfig(surfaceData.layout);
            this.guiCrossLayout.applyLayoutToEdges(this.top, this.left, this.right, this.bottom, surfaceData.edges.thickness);

        };

        GuiCrossElement.prototype.applyEdgesStates = function(edgesData, hover, press, on) {
            this.top.applyEdgeElementDataState(edgesData, hover, press, on);
            this.left.applyEdgeElementDataState(edgesData, hover, press, on);
            this.right.applyEdgeElementDataState(edgesData, hover, press, on);
            this.bottom.applyEdgeElementDataState(edgesData, hover, press, on);

        };


        GuiCrossElement.prototype.updateSurfaceVisuals = function(surfaceData) {

            if (surfaceData.edges) {
                this.applyEdgesStates(surfaceData.edges, this.hover, this.press, this.on);
            }
        };

        GuiCrossElement.prototype.updateCrossElement = function(posVec, surfaceData) {

            this.applySurfaceData(posVec ,surfaceData);
            this.updateSurfaceVisuals(surfaceData);
            this.disabled = false;
        };


        GuiCrossElement.prototype.setOn = function(bool) {
            this.on = bool;
        };

        GuiCrossElement.prototype.getOn = function() {
            return this.on;
        };


        GuiCrossElement.prototype.disableCrossElement = function() {

            this.top.disableEdgeElement();
            this.left.disableEdgeElement();
            this.right.disableEdgeElement();
            this.bottom.disableEdgeElement();
            this.disabled = true;
        };


        GuiCrossElement.prototype.getCrossLayout = function() {
            return this.guiCrossLayout;
        };

        return GuiCrossElement;

    });