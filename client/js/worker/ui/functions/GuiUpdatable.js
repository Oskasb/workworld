"use strict";

define([
        'GuiAPI'
    ],
    function(
        GuiAPI
    ) {

        var GuiUpdatable = function() {
            this.callbacks = [];
        };

        GuiUpdatable.prototype.disableUpdates = function() {
            while (this.callbacks.length) {
                GuiAPI.removeGuiUpdateCallback(this.callbacks.pop())
            }
        };

        GuiUpdatable.prototype.enableUpdates = function(cb) {
            GuiAPI.addGuiUpdateCallback(cb);
            this.callbacks.push(cb);
        };

        return GuiUpdatable;

    });