
"use strict";


define([
        'PipelineObject'
    ],
    function(
        PipelineObject
    ) {

        var count = 0;

        var i;
        var key;

        var childCount;
        var elemCountDiff;

        var txElemId;
        var letter;
        var callback;

        var child;

        var guiRendererCallbacks;

        var calcVec = new THREE.Vector3();

        var GuiElement = function(dataKey, ready) {

            count++;

            this.elementId = dataKey+'_'+count;

            this.fxElements = [];

            this.spriteKey = null;
            this.colorCurveKey = null;
            this.children = {};

            this.enabled = false;
            this.position = new THREE.Vector3();
            this.origin   = new THREE.Vector3();
            this.textOffsetVec = new THREE.Vector3();
            this.requestedChildren = 0;
            this.dataKey = dataKey;

            this.pointerState = 0;
            this.target = null;
            this.text = '';
            this.letter = '';

            var applyData = function() {
                this.applyData(this.pipeObj.buildConfig()[dataKey], ready);
            }.bind(this);

            this.pipeObj = new PipelineObject('GUI_PARTICLE_ELEMENTS', 'ELEMENTS', applyData, dataKey);
        };

        GuiElement.prototype.applyData = function (config, ready) {
            this.config = config;

            this.disableFunc = config.render_calls.gui_render_disable;
            this.enableFunc = config.render_calls.gui_render_enable;
            this.renderFunc = config.render_calls.gui_renderer_callback;
            this.updateFunc = config.render_calls.gui_update_callback;
            this.options = config.options;
            this.fxIds = config.effect_ids;

            ready(this)
        };

        GuiElement.prototype.setText = function(text) {
            if (this.text !== text || Math.random() < 0.01) {
                this.generateChildrenForText(text);
            }
            this.text = text;
        };



        GuiElement.prototype.setPointerState = function(state) {
            this.pointerState = state;
        };

        GuiElement.prototype.getPointerState = function() {
            return this.pointerState;
        };


        GuiElement.prototype.generateChildrenForText = function(text) {

            childCount = this.requestedChildren;

            if (this.children[this.options.text_element_id]) {
                childCount += this.children[this.options.text_element_id].length;
            }

            elemCountDiff = text.length - childCount;

            if (!elemCountDiff) return;

            if (elemCountDiff < 0) {
                if (this.children[this.options.text_element_id]) {
                    while (this.requestedChildren + this.children[this.options.text_element_id].length > text.length) {
                        this.despawnChildElement(this.children[this.options.text_element_id].pop());
                    }
                }

            } else if (elemCountDiff > 0) {
                for (i = this.text.length; i < text.length; i++) {
                    this.spawnChildElement(this.options.text_element_id);
                }
            }
        };




        GuiElement.prototype.renderText = function(textOffsetVector) {

            txElemId = this.options.text_element_id;


            this.textOffsetVec.copy(textOffsetVector);

            this.textOffsetVec.x += this.options.pad_x || 0;
            this.textOffsetVec.y += this.options.pad_y || 0;

            if (this.children[txElemId]) {

                for (i = 0; i < this.children[txElemId].length; i++) {
                    letter = this.text[i];

                    if (!letter) {
                        this.generateChildrenForText(this.text);
                        return;
                    }

                    child = this.children[txElemId][i];
                    child.origin.copy(this.position);


                    if (child.letter !== letter) {
                        child.setSpriteKey(this.text[i]);
                        child.letter = this.text[i];
                    }

                    if (child.colorCurveKey !== this.colorCurveKey) {
                        child.setColorCurveKey(this.colorCurveKey)
                    }

                    child.applyElementPosition(null, this.textOffsetVec);

                    this.textOffsetVec.z = 0;

                    this.textOffsetVec.x += child.options.step_x;
                }
            }
        };

        GuiElement.prototype.setTarget = function(target) {
            if (this.target !== target) {
                this.disableGuiElement();
            }
            this.target = target;
        };

        GuiElement.prototype.setSpriteKey = function(spriteKey) {

            if (!spriteKey) {
                console.log("set null sprite", this);
                return;
            }

            if (this.spriteKey !== spriteKey) {
                if (!this.fxElements.length) return;
                this.updateRenderingSpriteKey(spriteKey);
            }
            this.spriteKey = spriteKey;
        };

        GuiElement.prototype.setColorCurveKey = function(colorCurveKey) {
            if (this.colorCurveKey !== colorCurveKey || Math.random() < 0.005) {
                if (!this.fxElements.length) return;
                this.updateRenderingColorCurveKey(colorCurveKey);
            }
            this.colorCurveKey = colorCurveKey;
        };

        GuiElement.prototype.updateRenderingSpriteKey = function(spriteKey) {

            if (!spriteKey) {
                console.log("Bad sprite key in gui elem:", this.letter, this)
                return;
            }

            guiRendererCallbacks.updateElementsSpriteKey(this.fxElements, spriteKey)
        };

        GuiElement.prototype.updateRenderingColorCurveKey = function(colorCurveKey) {
            guiRendererCallbacks.updateElementsColorCurveKey(this.fxElements, colorCurveKey)
        };

        GuiElement.prototype.getTarget = function() {
            return this.target;
        };

        GuiElement.prototype.registerChildElement = function(element) {
            if (!this.children[element.dataKey]) {
                this.children[element.dataKey] = [];
            }
            element.enableGuiElement(guiRendererCallbacks);
            this.children[element.dataKey].push(element);
            this.requestedChildren--;
        };

        GuiElement.prototype.spawnChildElement = function(fxId) {
            callback = function(element) {
                this.registerChildElement(element);
            }.bind(this);

            this.requestedChildren++;
            guiRendererCallbacks.generateChildElement(fxId, callback)
        };

        GuiElement.prototype.despawnChildElement = function(child) {
            child.disableGuiElement();
            guiRendererCallbacks.removeChildElement(child)
        };

        GuiElement.prototype.enableGuiElement = function(guiCallbacks) {
            if (guiCallbacks) {
                guiRendererCallbacks = guiCallbacks;
            }

            this.enabled = true;

            for (i = 0; i < this.fxIds.length; i++) {
                guiRendererCallbacks[this.enableFunc](this, i);
            }
        };

        var children;

        GuiElement.prototype.removeChildren = function() {

            for (var key in this.children) {

                children = this.children[key];

                if (typeof(this.children[key]) === 'undefined') {

                    console.log("Children undefined", this);

                }

                    while (this.children[key].length) {
                        this.despawnChildElement(this.children[key].pop());
                    }

            }
        };

        GuiElement.prototype.disableGuiElement = function() {
            this.setText('');
            calcVec.set(0, 0, 0);
            this.renderText(calcVec);

            this.enabled = false;
            this.spriteKey = null;
            this.colorCurveKey = null;
            guiRendererCallbacks[this.disableFunc](this.fxElements);
            this.removeChildren();
        };

        GuiElement.prototype.updateGuiElement = function(guiCallbacks) {
            guiRendererCallbacks = guiCallbacks;
            if (this.renderFunc) {
                guiRendererCallbacks[this.renderFunc](this);
            }
        };

        GuiElement.prototype.applyElementPosition = function(fxIndex, offsetVec3) {
            if (!guiRendererCallbacks) return;

            if (offsetVec3) {
                this.position.addVectors(this.origin, offsetVec3);
            } else {
                if (this.position.equals(this.origin)) {
                    return;
                }
                this.position.copy(this.origin);
            }

            if (fxIndex !== null) {
                guiRendererCallbacks[this.updateFunc](this, this.fxElements[fxIndex]);
            } else {
                for (var i = 0; i < this.fxElements.length; i++) {
                    guiRendererCallbacks[this.updateFunc](this, this.fxElements[i]);
                }
            }
        };

        GuiElement.prototype.removeGuiElement = function () {
            this.pipeObj.removePipelineObject();
        };

        return GuiElement
    });