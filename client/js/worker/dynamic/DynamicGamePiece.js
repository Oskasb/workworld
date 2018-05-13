"use strict";

define([
        'ConfigObject',
        'worker/controls/PieceControl',
        'worker/controlable/AttachmentGroup',
    'worker/controlable/PieceControlState'

    ],
    function(
        ConfigObject,
        PieceControl,
        AttachmentGroup,
        PieceControlState
    ) {

        var i;

        var DynamicGamePiece = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;
            this.attachmentGroups = [];
            this.controlStates = {};
        };

        DynamicGamePiece.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicGamePiece.prototype.initGamePiece = function(onReady) {

            var configLoaded = function() {
                this.initAttachmentGroups();
                this.initControlStates();
                this.pieceControl = new PieceControl(this.configRead('controls').config_key, this.configRead('controls').config_id);
                this.configObject.removeCallback(configLoaded);
                onReady(this);
            }.bind(this);

            this.configObject = new ConfigObject('GAME_PIECES', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);
        };

        DynamicGamePiece.prototype.initAttachmentGroups = function() {
            var attachmentConfig = this.configRead('attachment_groups');
            this.attachmentGroups = [];
            var groupReady = function(agrp) {
                this.attachmentGroups.push(agrp);
            }.bind(this);

            for (var i = 0; i < attachmentConfig.length; i++) {
                var group = new AttachmentGroup(attachmentConfig[i].config_key,attachmentConfig[i].config_id);
                group.initAttachmentGroup(groupReady)
            }
        };

        DynamicGamePiece.prototype.initControlStates = function() {
            var ctrlConf = this.configRead('control_states');

            this.controlStates = {};

            for (var i = 0; i < ctrlConf.length; i++) {
                this.controlStates[ctrlConf[i].control_id] = new PieceControlState(ctrlConf[i]);
            }
        };

        DynamicGamePiece.prototype.activatePieceControls = function(onReady) {
            this.pieceControl.enableControl(onReady);
        };

        DynamicGamePiece.prototype.deactivatePieceControls = function() {
            this.pieceControl.disableControl();
        };

        DynamicGamePiece.prototype.getControlStateById = function(controlId) {
            return this.controlStates[controlId];
        };

        DynamicGamePiece.prototype.applyModuleRenderable = function(renderable) {

            for (i = 0; i < this.attachmentGroups.length; i++) {
                this.attachmentGroups[i].renderAttachments(renderable);
            }
        };

        DynamicGamePiece.prototype.updateDynamicGamePiece = function(tpf) {

            for (var key in this.controlStates) {
                this.controlStates[key].updatePieceControlState();
            }

            for (i = 0; i < this.attachmentGroups.length; i++) {
                this.attachmentGroups[i].updateAttachmentGroup(tpf);
            }
        };

        return DynamicGamePiece;

    });
