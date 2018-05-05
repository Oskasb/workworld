"use strict";


define([
        'worker/dynamic/DynamicRenderable'
    ],
    function(
        DynamicRenderable
    ) {

        var dynamics = [];

        var newDynRen;

        var addDynamicRenderable = function(dynRen) {
            if (dynamics.indexOf(dynRen) !== -1) {
                console.log("Dupe Add attempted... bailing");
                return;
            }
            dynamics.push(dynRen)
        };

        var DynamicWorld = function() {

        };


        DynamicWorld.prototype.spawnDynamicRenderable = function(renderableId, parentObj3d) {
            newDynRen = new DynamicRenderable();
            newDynRen.inheritObj3D(parentObj3d);
            newDynRen.obj3d.position.y += 5+Math.random()*8;
            newDynRen.initRenderable(renderableId, addDynamicRenderable);
        };


        DynamicWorld.prototype.updateDynamicWorld = function() {

            if (Math.random() < 0.02) {
                this.spawnDynamicRenderable('wooden_crate', WorldAPI.getWorldCursor().getCursorObj3d())
            }


            for (var i = 0; i < dynamics.length;i++) {
                dynamics[i].tickRenderable();
            }


        };

        return DynamicWorld;

    });

