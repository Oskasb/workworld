"use strict";

define([
        'ui/elements/EffectList',
        'worker/controls/ControlsList'
    ],
    function(
        EffectList,
        ControlsList
    ) {

        var PieceControl = function(configKey, configId) {

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.controlsList = new ControlsList(configKey, configId)

        };

        PieceControl.prototype.enableControl = function(onReady) {

            this.enabled = true;

            var ctrlReady = function(freeCursorCtrl) {
                WorldAPI.addTextMessage('Free Cursor Control Loaded');

                if (this.enabled) {
                    freeCursorCtrl.enableCursorGuiWidgets();
                    onReady(this);
                }

            }.bind(this);

            this.controlsList.initControlsList(ctrlReady)
        };

        PieceControl.prototype.disableControl = function() {
            this.controlsList.disableControlsList();
            this.enabled = false;
        };

        PieceControl.prototype.getControlPosition = function(vec3) {
            vec3.copy(this.pos);
        };

        PieceControl.prototype.getControlQuaternion = function(quat) {
            quat.copy(this.quat);
        };

        PieceControl.prototype.setControlPosition = function(posVec) {
            this.pos.copy(posVec);
        };

        PieceControl.prototype.setControlQuaternion = function(quat) {
            this.quat.copy(quat)
        };

        PieceControl.prototype.updateControl = function() {

        };

        return PieceControl;

    });