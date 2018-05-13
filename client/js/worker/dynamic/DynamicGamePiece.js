"use strict";

define([
    'ConfigObject',
        'worker/controls/PieceControl'

    ],
    function(
        ConfigObject,
        PieceControl
    ) {

        var DynamicGamePiece = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;
        };

        DynamicGamePiece.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicGamePiece.prototype.initGamePiece = function(onReady) {

            var configLoaded = function() {
                this.pieceControl = new PieceControl(this.configRead('controls').config_key, this.configRead('controls').config_id);
                this.configObject.removeCallback(configLoaded);
                onReady(this);
            }.bind(this);

            this.configObject = new ConfigObject('GAME_PIECES', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);

        };

        DynamicGamePiece.prototype.activatePieceControls = function(onReady) {
            this.pieceControl.enableControl(onReady);
        };

        DynamicGamePiece.prototype.deactivatePieceControls = function() {
            this.pieceControl.disableControl();
        };

        return DynamicGamePiece;

    });
