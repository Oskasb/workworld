"use strict";

define([
        'ui/elements/EffectList',
        'worker/controls/ControlsList'
    ],
    function(
        EffectList,
        ControlsList
    ) {

        var WorldCursor = function() {
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.obj3d = new THREE.Object3D();
            this.effectList = new EffectList();
            this.controlsList = new ControlsList('GUI_FREE_CURSOR', 'movable_cursor')
        };

        WorldCursor.prototype.enableControl = function(onReady) {

            this.enabled = true;

            this.effectList.enableEffectList([
                'shield_module_sparks_effect',
                "hyper_module_sparks_effect",
                "flare_dot_module_effect"
            ], this.obj3d.position);

            var ctrlReady = function(freeCursorCtrl) {
                WorldAPI.addTextMessage('Free Cursor Control Loaded');

                if (this.enabled) {
                    freeCursorCtrl.enableCursorGuiWidgets();
                    onReady(this);
                }

            }.bind(this);

            this.controlsList.initControlsList(ctrlReady)
        };

        WorldCursor.prototype.disableControl = function() {
            this.effectList.disableEffectList();
            this.controlsList.disableControlsList();
            this.enabled = false;
        };

        WorldCursor.prototype.setCursorElevation = function(height) {

            if (height) {
                this.obj3d.position.y = Math.max(height, 0);
            } else {
                this.obj3d.position.y = 0;
            }
        };

        WorldCursor.prototype.setControlPosition = function(posVec) {
            this.obj3d.position.copy(posVec);
        };

        WorldCursor.prototype.setControlQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat)
        };

        WorldCursor.prototype.getControlPosition = function(vec3) {
            vec3.copy( this.obj3d.position );
        };

        WorldCursor.prototype.getControlQuaternion = function(quat) {
            quat.copy( this.obj3d.quaternion );
        };

        WorldCursor.prototype.drawCursorPosition = function() {
            this.setCursorElevation(WorldAPI.getTerrainElevationAtPos(this.obj3d.position));
            this.effectList.setEffectListPosition(this.obj3d.position)
        };

        WorldCursor.prototype.updateControl = function() {
            this.drawCursorPosition();
        };

        return WorldCursor;

    });