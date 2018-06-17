"use strict";

define([
        'ConfigObject',
        'worker/controlable/ModuleFunctions',
        'worker/controlable/ModuleState',
        'worker/controlable/ModuleEffectFunctions',
        'worker/ui/elements/DebugElement'
    ],
    function(
        ConfigObject,
        ModuleFunctions,
        ModuleState,
        ModuleEffectFunctions,
        DebugElement
    ) {

        var ControlableModule = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;

            this.id = configId;

            this.moduleState = new ModuleState();
            this.offset = new THREE.Vector3();
            this.direction = new THREE.Vector3();
            this.size = new THREE.Vector3();

            this.debugElements = [];

            this.parentShape = null;

            this.parentShapeId = null;

        };

        ControlableModule.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        ControlableModule.prototype.initModule = function(onReady) {

            var configLoaded = function() {
                this.clearDebugModule();
                this.moduleState.applyConfig(this.configRead('state'));

                onReady(this);
                WorldAPI.addTextMessage('Load Module '+this.configKey+' '+this.configId)

            }.bind(this);

            this.configObject = new ConfigObject('MODULES', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);
        };

        ControlableModule.prototype.setOffset = function(x, y, z) {
            this.offset.set(x, y, z)
        };

        ControlableModule.prototype.setDirection = function(x, y, z) {
            this.direction.set(x, y, z)
        };

        ControlableModule.prototype.setSize = function(x, y, z) {
            this.size.set(x, y, z)
        };

        ControlableModule.prototype.setParentShape = function(shape) {
            this.parentShape = shape;
        };


        ControlableModule.prototype.setModuleTargetState = function(val) {
            this.moduleState.setTargetState(val)
        };

        ControlableModule.prototype.calculateWorldPosition = function(parentPos, parentQuat, store) {

            store.copy(this.offset);

            if (this.parentShape) {
                store.applyQuaternion(this.parentShape.rotation);
                store.add(this.parentShape.offset)
            }

            store.applyQuaternion(parentQuat);
            store.add(parentPos);
        };

        var map = {
            sampleSource:'sampleSource',
            source:'source',
            target:'target',
            feedback:'feedback',
            applyState:'applyState',
            effectFunction:'effectFunction',
            func:'function'
        };

        var source;
        var sampleSource;
        var applyState;
        var effectFunc;
        var feedback;
        var target;

        ControlableModule.prototype.renderControlableModule = function(renderable) {

            if (false) {
                if (typeof(ModuleFunctions[this.configRead(map.sampleSource)]) !== map.func) {
                    console.log("Bad sampleSource request: ", this.configRead('sampleSource'), renderable, this);
                    return;
                }

                if (typeof(ModuleFunctions[this.configRead('applyState')]) !== map.func) {
                    console.log("Bad applyState request: ", this.configRead('applyState'), renderable, this);
                    return;
                }

                if (typeof(ModuleEffectFunctions[this.configRead('effectFunction')]) !== map.func) {
                    console.log("Bad effectFunction request: ", this.configRead('effectFunction'), renderable, this);
                    return;
                }
            }

            sampleSource = this.configRead(map.sampleSource);
            applyState =this.configRead(map.applyState);
            effectFunc = this.configRead(map.effectFunction);
            source = this.configRead(map.source);
            target = this.configRead(map.target);
            feedback = this.configRead(map.feedback);

            ModuleFunctions[sampleSource](renderable, this.moduleState, source);
            ModuleFunctions[applyState](renderable, this.moduleState, target);
            ModuleEffectFunctions[effectFunc](renderable, this.moduleState, feedback);
        };

        ControlableModule.prototype.updateControlableModule = function(tpf) {
            this.moduleState.updateModuleState(tpf);
        };

        ControlableModule.prototype.debugDrawModule = function(renderable) {

            if (!this.debugElements.length) {
                this.debugElements.push(new DebugElement(renderable.pos))
            }

            for (var i = 0; i < this.debugElements.length; i++) {
                this.debugElements[i].debugRenderableModule(renderable, this);
            }
        };

        ControlableModule.prototype.clearDebugModule = function() {

            while (this.debugElements.length) {
                this.debugElements.pop().disableDebugElement();
            }

        };

        return ControlableModule;

    });

