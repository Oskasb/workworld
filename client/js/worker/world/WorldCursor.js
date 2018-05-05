"use strict";

define([
        'ui/elements/EffectList'
    ],
    function(
        EffectList
    ) {

        var WorldCursor = function() {
            this.obj3d = new THREE.Object3D();
            this.effect = new EffectList();
            this.groundElevation = 0;
        };


        WorldCursor.prototype.enableWorldCursor = function() {

            this.effect.enableEffectList([
                'shield_module_sparks_effect',
                "hyper_module_sparks_effect",
                "flare_dot_module_effect"
            ], this.getCursorPosition());

        };

        WorldCursor.prototype.moveCursorPosition = function(moveVec) {
            this.obj3d.position.x += moveVec.x;
            this.obj3d.position.y += moveVec.y;
            this.obj3d.position.z += moveVec.z;
        };

        WorldCursor.prototype.setCursorElevation = function(height) {

            if (height) {
                this.obj3d.position.y = Math.max(height, 0);
            } else {
                this.obj3d.position.y = 0;
            }

        };

        WorldCursor.prototype.getCursorObj3d = function() {
            return this.obj3d
        };

        WorldCursor.prototype.setCursorPosition = function(posVec) {
            this.obj3d.position.copy(posVec);
        };

        WorldCursor.prototype.getCursorPosition = function() {
            return this.obj3d.position;
        };

        WorldCursor.prototype.getCursorQuaternion = function() {
            return this.obj3d.quaternion;
        };

        WorldCursor.prototype.setCursorQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        WorldCursor.prototype.disableUpdates = function() {

        };

        WorldCursor.prototype.drawCursorPosition = function() {

            this.setCursorElevation(WorldAPI.getTerrainElevationAtPos(this.getCursorPosition()));
            this.effect.setEffectListPosition(this.getCursorPosition())

        };

        WorldCursor.prototype.updateWorldCursor = function() {
            this.drawCursorPosition();
        };

        return WorldCursor;

    });