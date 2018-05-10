"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiArrowElement',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        GuiArrowElement,
        EffectList
    ) {

        var i;
        var dragVecConf;
        var tempVec1 = new THREE.Vector3();

        var GuiPointerSystem = function() {
            this.cursorPosition = new THREE.Vector3();
            this.pressInitPosition = new THREE.Vector3();
            this.dragVector = new THREE.Vector3();
            this.dragStartTime = 0;
            this.hoverPointEffects = new EffectList();
            this.curorEffects = new EffectList();;
            this.dragStartEffects =  new EffectList();
            this.dragVectorElements = [];
        };

        GuiPointerSystem.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiPointerSystem.prototype.initGuiSystem = function(systemReady) {

            this.configObject = new ConfigObject('GUI_SYSTEMS', 'GUI_POINTER_SYSTEM', 'config');

            var configLoaded = function(config) {
                this.configObject.removeCallback(configLoaded);
            //    console.log("Config: GUI_POINTER_SYSTEM", config);

                systemReady(this);

            }.bind(this);

            this.configObject.addCallback(configLoaded);

        };

        GuiPointerSystem.prototype.trackInputPosition = function(effectList, dataKey, posVec) {

            if (effectList.effectCount() === 0) {
                effectList.enableEffectList(this.configRead(dataKey), posVec);
            }
            effectList.setEffectListPosition(posVec)
        };


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

        GuiPointerSystem.prototype.trackInputVector = function(elementArray, dataKey, dragVec, fromVec, toVec) {

            if (elementArray.length !== dragVecConf.fx_count) {
                this.setupVectorElements(elementArray, dataKey)
            }

            var dragTime = WorldAPI.getWorldTime() - this.dragStartTime;

            var dragDir = MATH.angleInsideCircle(MATH.vectorXYToAngleAxisZ(dragVec));
            var dirIdx = Math.round(dragDir * elementArray.length / MATH.TWO_PI);

            var elemIdx = MATH.moduloPositive(dirIdx, elementArray.length);

            for (i = 0; i < elementArray.length; i++) {

                var orderFraction = MATH.valueFromCurve(i / elementArray.length, MATH.curves[dragVecConf.order_curve]);

                var expandFraction = MATH.calcFraction(0, dragVecConf.init_time_min + orderFraction*dragVecConf.init_time_max, dragTime);

                var value = MATH.valueFromCurve(expandFraction, MATH.curves[dragVecConf.expand_curve]);

                var animOut = dragVecConf.radius_min + value * (dragVecConf.radius_max-dragVecConf.radius_min);

                tempVec1.x =  Math.sin(MATH.TWO_PI * elemIdx / elementArray.length) * animOut;
                tempVec1.y =  Math.cos(MATH.TWO_PI * elemIdx / elementArray.length) * animOut;
                tempVec1.z = 0;

                var dot = tempVec1.dot(dragVec);

                tempVec1.x += dragVec.x * (0.9 + dot * dot * 5);
                tempVec1.y += dragVec.y * (0.9 + dot * dot * 5);

                tempVec1.addVectors(tempVec1, fromVec);
                elementArray[elemIdx].drawArrowElement(tempVec1, dragVec);

                elemIdx = MATH.moduloPositive(elemIdx+1, elementArray.length);
            }
        };

        GuiPointerSystem.prototype.updatePointerState = function() {

            this.cursorPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            this.cursorPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);
            this.cursorPosition.z = -1;
            this.pressInitPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_X);
            this.pressInitPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_Y);
            this.pressInitPosition.z = -1;

            dragVecConf = this.configRead('drag_vector');
            this.dragVector.subVectors(this.cursorPosition, this.pressInitPosition);

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
                this.trackInputPosition(this.curorEffects, 'cursor_effects', this.cursorPosition);
                this.trackInputPosition(this.dragStartEffects, 'drag_start_effects', this.pressInitPosition);
            } else {
                this.curorEffects.disableEffectList();
                this.dragStartEffects.disableEffectList();
                WorldAPI.setCom(ENUMS.BufferChannels.UI_PRESS_SOURCE, 0)
            }

            if (this.dragVector.lengthSq() > dragVecConf.range_min) {
                if (this.dragStartTime === 0) {
                    this.dragStartTime = WorldAPI.getWorldTime();
                }
                this.trackInputVector(this.dragVectorElements, 'drag_vector_effects', this.dragVector, this.pressInitPosition, this.cursorPosition);
            } else {
                this.clearVectorElements(this.dragVectorElements);
                this.dragStartTime = 0;
            }

            this.trackInputPosition(this.hoverPointEffects, 'hover_point_effects', this.cursorPosition);
        };


        GuiPointerSystem.prototype.updateGuiSystem = function() {
            this.updatePointerState();
        };

        return GuiPointerSystem;

    });