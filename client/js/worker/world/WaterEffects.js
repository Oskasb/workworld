"use strict";

define([
        'ConfigObject',
        'Events',
        'ui/elements/EffectList'

    ],
    function(
        ConfigObject,
        evt,
        EffectList
    ) {


    var effect;
    var fxconf;

        var effectPool = [];

        var pools = {};

        var spliceIdx;

        var pool;
        var splashes = [];

        var WaterEffects = function() {
            this.initWaterFX();
        };

        WaterEffects.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        WaterEffects.prototype.initWaterFX = function() {

            var handleWFX = function(e) {
                this.spawnEffect(evt.args(e))
            }.bind(this);

            var configLoaded = function() {
                evt.on(evt.list().WATER_EFFECT, handleWFX);
            };

            this.configObject = new ConfigObject('ENVIRONMENT_EFFECTS', 'WATER', 'surface_effects');
            this.configObject.addCallback(configLoaded);

        };

        WaterEffects.prototype.spawnEffect = function(args) {

            fxconf = this.configRead(args.effect);

            if (!pools[args.effect]) {
                pools[args.effect] = []
            }

            pool = pools[args.effect];

            if (effectPool.length) {
                effect = effectPool.pop();
            } else {
                effect = new EffectList();
            }

            effect.enableEffectList(fxconf.effects, args.pos, args.quat, args.scale);
            effect.setEffectListVelocity(args.vel);


            pool.push(effect);

            while (pool.length > fxconf.pool) {
                spliceIdx = Math.floor(Math.random()*pool.length*0.8);
                effect = pool.splice(spliceIdx, 1)[0];
                effect.disableEffectList();
                effectPool.push(effect);
            }

        };

        WaterEffects.prototype.initGuiWidget = function(onReadyCB) {

        };


        WaterEffects.prototype.applyDynamicLayout = function(dynLayout) {

        };


        return WaterEffects;

    });