"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        GuiAPI,
        ConfigObject,
        EffectList
    ) {

        var i;
        var key;
        var state;
        var tempVec1 = new THREE.Vector3();

        var TEXT_STATE = {
            on:"on",
            color:"color",
            disabled:"disabled",
            passive:"passive",
            active:"active"
        };

        var GuiTextElement = function() {

            this.textString = '';

            this.originX = 0;
            this.originY = 0;

            this.offsetX = 0;
            this.offsetY = 0;

            this.obj3d = new THREE.Object3D();
            this.skewVec = new THREE.Vector3();

            this.obj3d.quaternion.x = 0;
            this.obj3d.quaternion.y = 0;
            this.obj3d.quaternion.z = 0;
            this.obj3d.quaternion.w = 1;

            this.effectList = new EffectList();

            this.effectSize = 0.1;
            this.textSpacingX = 0.05;
            this.textSpacingY = 0.05;

            this.fontEffect = null;

            this.top = 0;
            this.left = 0;
            this.right = 0;
            this.bottom = 0;

            this.config = {
                font_size:19,
                letter_spacing:1,
                text_align_x:0,
                text_align_y:0,
                text_margin_x:0.3,
                text_margin_y:0.6,
                italic:true,
                font_effect:"default_font_effect",
                color_map:  "state_color_map",
                alpha_map:  "state_alpha_map"
            };

            this.stateColorMap = {
                color:      "fullWhite",
                disabled:   "flashGrey",
                passive:    "flatCyan",
                active:     "fullWhite",
                on:         "orange_3"
            };

            this.stateAlphaMap = {
                color:      "alpha_40",
                disabled:   "alpha_40",
                passive:    "alpha_60",
                active:     "alpha_20",
                on:         "alpha_80"
            };

            this.textState = TEXT_STATE.color;

            this.dirty = false;
        };

        GuiTextElement.prototype.initTextElement = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.dirty = true;
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_TEXT_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);
        };

        GuiTextElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiTextElement.prototype.getLetterPositionAtIndex = function(index, posVec) {
            posVec.x = this.obj3d.position.x + this.textSpacingX*index - this.elementWidth*this.config.text_align_x;
            posVec.y = this.obj3d.position.y - this.textSpacingY*(0.5-this.config.text_align_y);
            posVec.z = this.obj3d.position.z;
        };

        GuiTextElement.prototype.getLetterColorAtIndex = function(index) {
            return this.stateColorMap[this.textState];
        };

        GuiTextElement.prototype.getLetterAlphaAtIndex = function(index) {
            return this.stateAlphaMap[this.textState];
        };

        GuiTextElement.prototype.addLetterAtIndex = function(letter, index) {
            this.getLetterPositionAtIndex(index, tempVec1);
            this.effectList.addEffectToList(this.fontEffect, tempVec1, this.obj3d.quaternion, this.effectSize);
            this.setLetterAtIndex(letter, index);
            this.applyConfigurationToLetter(index);
        };

        GuiTextElement.prototype.setLetterAtIndex = function(letter, index) {
            if (this.effectList.effectCount() <= index) return;
            this.effectList.setEffectIndexSpriteKey(index, letter);
        };

        GuiTextElement.prototype.setLetterIndexColor = function(index, colorCurve) {
            if (this.effectList.effectCount() <= index) return;
            this.effectList.setEffectIndexColorKey(index, colorCurve);
        };

        GuiTextElement.prototype.setLetterIndexAlpha = function(index, alphaCurve) {
            if (this.effectList.effectCount() <= index) return;
            this.effectList.setEffectIndexAlphaKey(index, alphaCurve);
        };

        GuiTextElement.prototype.setLetterIndexScale = function(index, scale) {
            if (this.effectList.effectCount() <= index) return;
            this.effectList.setEffectIndexScale(index, scale);
        };

        GuiTextElement.prototype.updateLetterIndexPosition = function(index) {
            if (this.effectList.effectCount() <= index) return;
            this.getLetterPositionAtIndex(index, tempVec1);
            this.effectList.setEffectIndexPosition(index, tempVec1);
        };

        GuiTextElement.prototype.setSkewTextVector = function(vec3) {
            this.effectList.setEffectListVelocity(vec3);
        };

        GuiTextElement.prototype.applyConfigurationToLetter = function(index) {
            if (this.effectList.effectCount() <= index) return;
            this.setLetterIndexScale(index, this.effectSize);
            this.setLetterIndexColor(index, this.getLetterColorAtIndex(index));
            this.setLetterIndexAlpha(index, this.getLetterAlphaAtIndex(index));
            this.effectList.setEffectIndexVelocity(index, this.skewVec)
        };

        GuiTextElement.prototype.applySurfaceLayout = function(surfaceLayout) {

            this.top = surfaceLayout.getLayoutTop() - this.effectSize * this.config.text_margin_y;
            this.left = surfaceLayout.getLayoutLeft() + this.effectSize * this.config.text_margin_x;
            this.right = surfaceLayout.getLayoutRight() - this.effectSize * this.config.text_margin_x;
            this.bottom = surfaceLayout.getLayoutBottom() + this.effectSize * this.config.text_margin_y;

            this.obj3d.position.x = this.left + (this.right - this.left)*this.config.text_align_x + this.offsetX;
            this.obj3d.position.y = this.top  + (this.bottom - this.top)*this.config.text_align_y + this.offsetY;
            this.obj3d.position.z = -1;

            if (this.originX !== this.obj3d.position.x || this.originY !== this.obj3d.position.y) {
                this.originX = this.obj3d.position.x;
                this.originY = this.obj3d.position.y;
                this.dirty = true;
            }

        };

        GuiTextElement.prototype.applyTextConfig = function(textString) {

            this.fontEffect = this.config.font_effect;
            this.effectSize = this.config.font_size / 1000;
            this.textSpacingX = this.effectSize * this.config.letter_spacing;
            this.textSpacingY = this.effectSize * 2;
            this.elementWidth = this.textSpacingX * (textString.length);

            if (this.config.italic) {
                this.skewVec.set(0.24, 0, 0);
            } else {
                this.skewVec.set(0, 0, 0);
            }
        };

        GuiTextElement.prototype.updateTextConfig = function(textConfig) {

            for (key in textConfig) {
                if (this.config[key] !== textConfig[key]) {
                    this.config[key] = textConfig[key];
                    this.dirty = true
                }
            }
        };

        GuiTextElement.prototype.updateStateColorMaps = function(colorMap, alphaMap) {

            for (key in colorMap) {
                if (this.stateColorMap[key] !== colorMap[key]) {
                    this.stateColorMap[key] = colorMap[key];
                    this.dirty = true
                }
            }

            for (key in alphaMap) {
                if (this.stateAlphaMap[key] !== alphaMap[key]) {
                    this.stateAlphaMap[key] = alphaMap[key];
                    this.dirty = true
                }
            }
        };

        GuiTextElement.prototype.updateTextState = function(passive, active, on) {

            if (active) {
                state = TEXT_STATE.active;
            } else if (on) {
                state = TEXT_STATE.on;
            } else if (passive) {
                state = TEXT_STATE.passive;
            } else {
                state = TEXT_STATE.color;
            }

            if (state !== this.textState) {
                this.textState = state;
                for (i = 0; i < this.textString.length; i++) {
                    this.applyConfigurationToLetter(i);
                }
            }
        };


        GuiTextElement.prototype.visualizeText = function(surfaceLayout, passive, active, stateOn) {

            this.updateTextConfig(this.configRead(this.layoutKey));

            this.updateTextState(passive, active, stateOn);

            this.applySurfaceLayout(surfaceLayout);


            if (this.effectList.effectCount() !== this.textString.length) {


                this.updateStateColorMaps(this.configRead(this.config.color_map), this.configRead(this.config.alpha_map));

                this.applyTextConfig(this.textString);


                for (i = 0; i < this.textString.length; i++) {
                    this.addLetterAtIndex(this.textString[i], i);
                }
            }

            if (this.dirty) {

                //    this.effectList.disableEffectList();
                for (i = 0; i < this.textString.length; i++) {
                    this.updateLetterIndexPosition(i);
                    this.applyConfigurationToLetter(i);
                }
            }

            this.dirty = false;
        };


        GuiTextElement.prototype.updateFontEffecs = function(string) {


            if (string.length && this.effectList.effectCount()) {

                this.updateTextConfig(this.configRead(this.layoutKey));

                if (this.effectList.effectCount() > string.length) {
                    this.effectList.removeEffectListElementCount(this.effectList.effectCount() - string.length)
                }

                this.applyTextConfig(string);

                for (var i = 0; i < string.length; i++) {
                    if (string[i] !== this.textString[i]) {
                        if (this.textString[i]) {
                            this.setLetterAtIndex(string[i] ,i);
                        } else {
                            this.addLetterAtIndex(string[i], i);
                        }
                    }
                    this.updateLetterIndexPosition(i);
                    this.effectList.setEffectIndexVelocity(i, this.skewVec)
                }
             //   this.dirty = true;
            } else {
                this.effectList.disableEffectList();
            }

        };

        GuiTextElement.prototype.setTextOffsetX = function(x) {
            this.offsetX = x;
        };

        GuiTextElement.prototype.getTextOffsetX = function() {
            return this.offsetX;
        };

        GuiTextElement.prototype.setTextOffsetY = function(y) {
            this.offsetY = y;
        };

        GuiTextElement.prototype.getTextOffsetY = function() {
            return this.offsetY;
        };

        GuiTextElement.prototype.getTextEffectSize = function() {
            return this.effectSize;
        };

        GuiTextElement.prototype.setElementLayoutKey = function(layoutKey) {
            this.layoutKey = layoutKey;
        };

        GuiTextElement.prototype.setElementText = function(string) {

            if (typeof(string) !== 'string') {
                string = ''+string;
            }

            if (this.textString !== string) {
                this.updateFontEffecs(string);
            }

            this.textString = string;
        };

        GuiTextElement.prototype.disableTextElement = function() {
            this.effectList.disableEffectList();
        };


        return GuiTextElement;

    });