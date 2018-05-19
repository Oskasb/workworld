"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiPlateElement',
        'ui/elements/GuiEdgeElement',
        'ui/elements/GuiCornerElement',
        'ui/elements/GuiTextElement',
        'ui/functions/GuiSurfaceLayout'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiPlateElement,
        GuiEdgeElement,
        GuiCornerElement,
        GuiTextElement,
        GuiSurfaceLayout
    ) {

        var count = 0;
        var i;
        var elem;
        var surfaceAvtive = false;
        var surfacePassive = false;

        var GuiSurfaceElement = function() {
            count++;
            var surfaceIndex = count;

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

            this.samplePointer = true;

            var registerPressSource = function() {
                WorldAPI.setCom(ENUMS.BufferChannels.UI_PRESS_SOURCE, surfaceIndex)
            };

            var registerHoverSource = function(bool) {
                if (bool) {
                    WorldAPI.setCom(ENUMS.BufferChannels.UI_HOVER_SOURCE, surfaceIndex)
                } else {
                    if (WorldAPI.getCom(ENUMS.BufferChannels.UI_HOVER_SOURCE) === surfaceIndex) {
                        WorldAPI.setCom(ENUMS.BufferChannels.UI_HOVER_SOURCE, 0)
                    }
                }
            };

            this.addSurfacePressCallback(registerPressSource);
            this.addSurfaceHoverCallback(registerHoverSource);

        };

        GuiSurfaceElement.prototype.initSurfaceElement = function(onReadyCB) {

            var cornersReady = function() {
                onReadyCB(this);
            }.bind(this);

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
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

        GuiSurfaceElement.prototype.applySurfaceData = function(posVec, surfaceData) {

            this.guiSurfaceLayout.setRootPosition(posVec);

            this.guiSurfaceLayout.parseLaoutConfig(surfaceData.layout);

            if (surfaceData.corners) {
                this.guiSurfaceLayout.applyLayoutToCorners(this.topLeft, this.topRight, this.bottomLeft, this.bottomRight);
            }

            if (surfaceData.edges) {
                this.guiSurfaceLayout.applyLayoutToEdges(this.top, this.left, this.right, this.bottom, surfaceData.edges.thickness);
            }


            this.guiSurfaceLayout.getLayoutCenter(this.centerPosition);

            if (surfaceData.backplate) {
                this.backplate.setPlatePosition(this.centerPosition);

                this.backplate.setPlateWidthAndHeight(this.guiSurfaceLayout.getLayoutWidth(), this.guiSurfaceLayout.getLayoutHeight())
            }

            this.guiSurfaceLayout.getLayoutCenter(this.centerPosition);

        };


        GuiSurfaceElement.prototype.applyCornersStates = function(edgesData, hover, press, on) {
            this.topLeft.applyCornerElementDataState(edgesData, hover, press, on);
            this.topRight.applyCornerElementDataState(edgesData, hover, press, on);
            this.bottomLeft.applyCornerElementDataState(edgesData, hover, press, on);
            this.bottomRight.applyCornerElementDataState(edgesData, hover, press, on);
        };

        GuiSurfaceElement.prototype.applyEdgesStates = function(edgesData, hover, press, on) {
            this.top.applyEdgeElementDataState(edgesData, hover, press, on);
            this.left.applyEdgeElementDataState(edgesData, hover, press, on);
            this.right.applyEdgeElementDataState(edgesData, hover, press, on);
            this.bottom.applyEdgeElementDataState(edgesData, hover, press, on);
        };

        GuiSurfaceElement.prototype.applyBackplateStates = function(edgesData, hover, press, on) {
            this.backplate.applyPlateElementDataState(edgesData, hover, press, on);
        };

        GuiSurfaceElement.prototype.updateSurfaceVisuals = function(surfaceData) {

            if (surfaceData.backplate) {
                this.applyBackplateStates(surfaceData.backplate, this.hover, this.press, this.on);
            }

            if (surfaceData.edges) {
                this.applyEdgesStates(surfaceData.edges, this.hover, this.press, this.on);
            }

            if (surfaceData.corners) {
                this.applyCornersStates(surfaceData.corners, this.hover, this.press, this.on);
            }

            for (i = 0; i < this.textElements.length; i++) {
                this.textElements[i].visualizeText(this.guiSurfaceLayout, this.hover, this.press, this.on)
            }

        };

        GuiSurfaceElement.prototype.testPointerHover = function() {

            surfacePassive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getMouseX(), GuiAPI.getMouseY());

            if (surfacePassive !== this.hover) {
                this.hover = surfacePassive;
                this.callSurfaceCallbackList(this.callbacks.hover, this.hover);
            }

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
                surfaceAvtive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getStartDragX(), GuiAPI.getStartDragY());

                if (surfaceAvtive !== this.press) {
                    this.press = surfaceAvtive;
                    this.callSurfaceCallbackList(this.callbacks.press, this.press);
                }

            } else {

                if (this.press) {
                    this.callSurfaceCallbackList(this.callbacks.release, this.hover);
                }
                this.press = false;
            }
        };

        GuiSurfaceElement.prototype.addSurfaceTextElement = function(layoutKey, string, cb) {

            var txt = function(txtElem) {
                txtElem.setElementText(string);
                this.textElements.push(txtElem);
                if (typeof(cb) === 'function') {
                    cb(txtElem);
                }
            }.bind(this);

            elem = new GuiTextElement();
            elem.setElementLayoutKey(layoutKey);
            elem.initTextElement(txt);
            return elem;
        };

        GuiSurfaceElement.prototype.updateSurfaceElement = function(posVec, surfaceData) {

            this.applySurfaceData(posVec ,surfaceData);

            if (this.samplePointer) {
                this.testPointerHover();
            }

            this.updateSurfaceVisuals(surfaceData)
            this.disabled = false;
        };

        GuiSurfaceElement.prototype.addSurfaceHoverCallback = function(cb) {
            this.callbacks.hover.push(cb);
        };

        GuiSurfaceElement.prototype.setSurfaceQuaternion = function(quat) {
            this.backplate.setPlateQuaternion(quat);
        };

        GuiSurfaceElement.prototype.setBackplateRotation = function(x, y, z) {
            this.backplate.setPlateRotation(x, y, z);
        };

        GuiSurfaceElement.prototype.setSamplePointer = function(bool) {
            this.samplePointer = bool;
        };

        GuiSurfaceElement.prototype.setSamplePointer = function(bool) {
            this.samplePointer = bool;
        };

        GuiSurfaceElement.prototype.setOn = function(bool) {
            this.on = bool;
        };

        GuiSurfaceElement.prototype.getOn = function() {
            return this.on;
        };

        GuiSurfaceElement.prototype.getPress = function() {
            return this.press
        };

        GuiSurfaceElement.prototype.addSurfacePressCallback = function(cb) {
            this.callbacks.press.push(cb);
        };

        GuiSurfaceElement.prototype.addSurfaceReleaseCallback = function(cb) {
            this.callbacks.release.push(cb);
        };

        GuiSurfaceElement.prototype.addSurfaceOutCallback = function(cb) {
            this.callbacks.out.push(cb);
        };

        GuiSurfaceElement.prototype.disableSurfaceElement = function() {

            this.topLeft.disableCornerElement();
            this.topRight.disableCornerElement();
            this.bottomLeft.disableCornerElement();
            this.bottomRight.disableCornerElement();

            this.top.disableEdgeElement();
            this.left.disableEdgeElement();
            this.right.disableEdgeElement();
            this.bottom.disableEdgeElement();

            this.backplate.disablePlateElement();

            for (i = 0; i < this.textElements.length; i++) {
                this.textElements[i].disableTextElement()
            }

            this.disabled = true;
        };

        GuiSurfaceElement.prototype.callSurfaceCallbackList = function(callbacks, bool) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](bool);
            }
        };

        GuiSurfaceElement.prototype.getSurfaceLayout = function() {
            return this.guiSurfaceLayout;
        };

        return GuiSurfaceElement;

    });