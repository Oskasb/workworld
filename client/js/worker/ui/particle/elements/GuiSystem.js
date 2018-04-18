"use strict";

define([

    ],
    function(

    ) {

        var GuiSystem = function(config, guiRenderer) {
            this.guiRenderer = guiRenderer;
            this.id = config.id;
            this.data = config.data;
            this.elementList = this.data.elements;
            this.elements = [];
        };

        GuiSystem.prototype.getElementList = function() {
            return this.elementList;
        };

        GuiSystem.prototype.activateGuiSystem = function() {
            for (var i = 0; i < this.getElementList().length; i++) {
                this.guiRenderer.generateGuiElement(this.getElementList()[i], this.elements)
            }
        };

        GuiSystem.prototype.deactivateGuiSystem = function() {

            while (this.elements.length) {
                this.elements.pop().disableGuiElement();
            }

        };

        GuiSystem.prototype.updateGuiSystem = function(guiRendererCallbacks) {


            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].updateGuiElement(guiRendererCallbacks);
            }

        };

        return GuiSystem;

    });