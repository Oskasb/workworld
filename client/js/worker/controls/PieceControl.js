"use strict";

define([
        'worker/controls/ControlsList'
    ],
    function(
        ControlsList
    ) {

        var PieceControl = function(config) {

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.controlsList = [];

            for (var i = 0; i < config.length; i++) {
                this.controlsList.push(new ControlsList(config[i].config_key, config[i].config_id))
            }

        };

        PieceControl.prototype.enableControl = function(onReady) {

            this.enabled = true;

            var ctrlReady = function(ctrl) {

                if (this.enabled) {
                    ctrl.enableCursorGuiWidgets();
                    onReady(this);
                }

            }.bind(this);

            for (var i = 0; i < this.controlsList.length; i++) {
                this.controlsList[i].initControlsList(ctrlReady);
            }
        };

        PieceControl.prototype.disableControl = function() {
            for (var i = 0; i < this.controlsList.length; i++) {
                this.controlsList[i].disableControlsList();
            }

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