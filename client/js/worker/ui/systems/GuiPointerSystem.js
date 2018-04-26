"use strict";

define([
        'ConfigObject',
        'EffectsAPI',
    'ui/elements/GuiArrowElement'
    ],
    function(
        ConfigObject,
        EffectsAPI,
        GuiArrowElement
    ) {

        var i;

        var tempVec1 = new THREE.Vector3();

        var GuiPointerSystem = function() {
            this.configObject = new ConfigObject('GUI_SYSTEMS', 'GUI_POINTER_SYSTEM', 'config');
            this.cursorPosition = new THREE.Vector3();
            this.pressInitPosition = new THREE.Vector3();
            this.dragVector = new THREE.Vector3();
            this.hoverPointEffects = [];
            this.curorEffects = [];
            this.dragStartEffects = [];
            this.dragVectorElements = [];
        };

        GuiPointerSystem.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiPointerSystem.prototype.initGuiSystem = function(systemReady) {

            var configLoaded = function(config) {

                console.log("Config: GUI_POINTER_SYSTEM", config);

                systemReady(this);

            }.bind(this);

            this.configObject.addCallback(configLoaded);

        };

        GuiPointerSystem.prototype.setEffectListPosition = function(effectArray, posVec) {
            for (i = 0; i < effectArray.length; i++) {
                effectArray[i].updateEffectPositionSimulator(posVec);
            }
        };

        GuiPointerSystem.prototype.enableEffectList = function(effectIds, effectArray, posVec) {
            for (i = 0; i < effectIds.length; i++) {
                effectArray.push(EffectsAPI.requestPassiveEffect(effectIds[i], posVec))
            }
        };

        GuiPointerSystem.prototype.disableEffectList = function(effectArray) {
            while (effectArray.length) {
                EffectsAPI.returnPassiveEffect(effectArray.pop())
            }
        };

        GuiPointerSystem.prototype.trackInputPosition = function(effectArray, dataKey, posVec) {

            if (effectArray.length === 0) {
                this.enableEffectList(this.configRead(dataKey), effectArray, posVec);
            }

            this.setEffectListPosition(effectArray, posVec)
        };


        var dragVecConf;

        GuiPointerSystem.prototype.setupVectorElements = function(elementArray, dataKey) {

            var add = dragVecConf.fx_count - elementArray.length;

            if (add < 0) {
                while (elementArray.length > dragVecConf.fx_count) {
                    elementArray.pop().disableElement();
                }
            } else {
                for (i = 0; i < add; i++) {
                    var elementReady = function(elem) {
                        elementArray.push(elem)
                    };
                    new GuiArrowElement(elementReady, dataKey);
                }
            }
        };

        GuiPointerSystem.prototype.clearVectorElements = function(elementArray) {
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].disableElement();
            }
        };



        GuiPointerSystem.prototype.trackInputVector = function(elementArray, dataKey, fromVec, toVec) {

            dragVecConf = this.configRead('drag_vector');

            if (elementArray.length !== dragVecConf.fx_count) {
                this.setupVectorElements(elementArray, dataKey)
            }

            var pressFrames = WorldAPI.sampleInputBuffer(ENUMS.InputState.PRESS_FRAMES);

            for (i = 0; i < elementArray.length; i++) {

                var orderFraction = MATH.valueFromCurve(i / elementArray.length, MATH.curves[dragVecConf.order_curve]);

                var expandFraction = MATH.calcFraction(0, dragVecConf.init_time + orderFraction*elementArray.length, pressFrames);

                var value = MATH.valueFromCurve(expandFraction, MATH.curves[dragVecConf.expand_curve]);

                var animOut = dragVecConf.radius_min + value * (dragVecConf.radius_max-dragVecConf.radius_min);

                tempVec1.x = Math.sin(MATH.TWO_PI * i / elementArray.length) * animOut;
                tempVec1.y = Math.cos(MATH.TWO_PI * i / elementArray.length) * animOut;
                tempVec1.z = 0;
                tempVec1.addVectors(tempVec1, fromVec);
                elementArray[i].drawArrowElement(tempVec1, toVec);

            }
        };

        GuiPointerSystem.prototype.updatePointerState = function() {

            this.cursorPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            this.cursorPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);
            this.cursorPosition.z = -1;
            this.pressInitPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_X);
            this.pressInitPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_Y);
            this.pressInitPosition.z = -1;

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
            //    this.disableEffectList(this.hoverPointEffects);
                this.trackInputPosition(this.curorEffects, 'cursor_effects', this.cursorPosition);
                this.trackInputPosition(this.dragStartEffects, 'drag_start_effects', this.pressInitPosition);
                this.trackInputVector(this.dragVectorElements, 'drag_vector_effects', this.pressInitPosition, this.cursorPosition);
            } else {
                this.clearVectorElements(this.dragVectorElements);
                this.disableEffectList(this.curorEffects);
                this.disableEffectList(this.dragStartEffects);
            }

            this.trackInputPosition(this.hoverPointEffects, 'hover_point_effects', this.cursorPosition);
        };


        GuiPointerSystem.prototype.updateGuiSystem = function() {
            this.updatePointerState();
        };

        return GuiPointerSystem;

    });