"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiPlateElement',
        'ui/elements/GuiEdgeElement',
        'ui/elements/GuiCornerElement',
        'ui/functions/GuiSurfaceLayout'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiPlateElement,
        GuiEdgeElement,
        GuiCornerElement,
        GuiSurfaceLayout
    ) {


        var surfaceAvtive = false;
        var surfacePassive = false;

        var tempVec1 = new THREE.Vector3();

        var GuiSurfaceElement = function() {

            this.obj3d = new THREE.Object3D();

            this.guiSurfaceLayout = new GuiSurfaceLayout();

            this.backplate = new GuiPlateElement();

            this.topLeft = new GuiCornerElement();
            this.topRight = new GuiCornerElement();
            this.bottomLeft = new GuiCornerElement();
            this.bottomRight = new GuiCornerElement();

            this.top = new GuiEdgeElement();
            this.left = new GuiEdgeElement();
            this.right = new GuiEdgeElement();
            this.bottom = new GuiEdgeElement();

        };

        GuiSurfaceElement.prototype.initSurfaceElement = function(onReadyCB) {

            var cornersReady = function() {
                onReadyCB(this);
            }.bind(this);


            var configLoaded = function() {
                this.initSurfaceCorners(cornersReady);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_SURFACE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiSurfaceElement.prototype.initSurfaceCorners = function(cornersReady) {

            var last = function(crnr) {
                crnr.getCornerQuaternion().set(0, 0, -1, 0);
                cornersReady();
            }.bind(this);

            var br = function(crnr) {
                crnr.getCornerQuaternion().set(1, 0, 0, 0);
                this.bottomRight.initCornerElement(last)
            }.bind(this);

            var bl = function(crnr) {
                crnr.getCornerQuaternion().set(0, 1, 0, 0);
                this.bottomLeft.initCornerElement(br)
            }.bind(this);

            var tr = function(crnr) {
                crnr.getCornerQuaternion().set(0, 0, 0, 1);
                this.topRight.initCornerElement(bl)
            }.bind(this);

            var tl = function(edge) {
                edge.setRotation(0, 0, -Math.PI * 0.5);
                this.topLeft.initCornerElement(tr)
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

            var t = function() {
                this.top.initEdgeElement(l)
            }.bind(this);

            this.backplate.initPlateElement(t)

        };

        GuiSurfaceElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiSurfaceElement.prototype.applySurfaceData = function(surfaceData) {
            this.guiSurfaceLayout.parseLaoutConfig(surfaceData.layout);
            this.guiSurfaceLayout.applyLayoutToCorners(this.topLeft, this.topRight, this.bottomLeft, this.bottomRight);
            this.guiSurfaceLayout.applyLayoutToEdges(this.top, this.left, this.right, this.bottom);
            this.guiSurfaceLayout.getLayoutCenter(this.backplate.getPlatePosition());
            this.backplate.setPlateWidthAndHeight(this.guiSurfaceLayout.getLayoutWidth(), this.guiSurfaceLayout.getLayoutHeight())
        };

        GuiSurfaceElement.prototype.applyCornersPassive = function(bool, dataKey) {
            this.topLeft.setCornerPassive(bool, dataKey);
            this.topRight.setCornerPassive(bool, dataKey);
            this.bottomLeft.setCornerPassive(bool, dataKey);
            this.bottomRight.setCornerPassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyCornersActive = function(bool, dataKey) {
            this.topLeft.setCornerActive(bool, dataKey);
            this.topRight.setCornerActive(bool, dataKey);
            this.bottomLeft.setCornerActive(bool, dataKey);
            this.bottomRight.setCornerActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyEdgesPassive = function(bool, dataKey) {
            this.top.setEdgeActive(bool, dataKey);
            this.left.setEdgeActive(bool, dataKey);
            this.right.setEdgeActive(bool, dataKey);
            this.bottom.setEdgeActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyEdgesActive = function(bool, dataKey) {
            this.top.setEdgePassive(bool, dataKey);
            this.left.setEdgePassive(bool, dataKey);
            this.right.setEdgePassive(bool, dataKey);
            this.bottom.setEdgePassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyBackplatePassive = function(bool, dataKey) {
            this.backplate.setPlatePassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyBackplateActive = function(bool, dataKey) {
            this.backplate.setPlateActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.updateSurfaceVisuals = function(surfaceData) {

            if (surfaceData.corners) {
                this.applyCornersPassive(surfacePassive, surfaceData.corners.passive_fx);
                this.applyCornersActive(surfaceAvtive, surfaceData.corners.active_fx);
            }

            if (surfaceData.edges) {
                this.applyEdgesPassive(surfacePassive, surfaceData.edges.passive_fx);
                this.applyEdgesActive(surfaceAvtive, surfaceData.edges.active_fx);
            }

            if (surfaceData.backplate) {
                this.applyBackplatePassive(surfacePassive, surfaceData.backplate.passive_fx);
                this.applyBackplateActive(surfaceAvtive, surfaceData.backplate.active_fx);
            }

        };

        GuiSurfaceElement.prototype.testPointerHover = function(surfaceData) {

            surfacePassive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getMouseX(), GuiAPI.getMouseY());

            surfaceAvtive = false;

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
                surfaceAvtive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getStartDragX(), GuiAPI.getStartDragY());
            }

        };

        GuiSurfaceElement.prototype.updateSurfaceElement = function(surfaceData) {

            this.applySurfaceData(surfaceData);
            this.testPointerHover(surfaceData);
            this.updateSurfaceVisuals(surfaceData)

        };

        return GuiSurfaceElement;

    });