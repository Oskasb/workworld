"use strict";

define([

    ],
    function(

    ) {

        var ControlableEngine = function() {

        };

        ControlableEngine.prototype.initControlable = function() {
            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_RENDERABLE', this.idKey);
            this.configObject.addCallback(configLoaded);
        };

        return ControlableEngine;

    });

