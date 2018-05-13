"use strict";

define([

    ],
    function(

    ) {

        var ControlableModule = function() {

        };

        ControlableModule.prototype.initModule = function() {
            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_RENDERABLE', this.idKey);
            this.configObject.addCallback(configLoaded);
        };

        return ControlableModule;

    });

