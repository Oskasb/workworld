"use strict";

define([],

    function(

    ) {

        var POINTER_STATES;

        var initPressElement;

        var HudPointerProcessor = function() {
            POINTER_STATES = ENUMS.PointerStates;
        };

        var distX;
        var distY;
        var pressFrames = 0;

        var isPointedAt = function(guiElement, cursorPosition) {
            distX = Math.abs(cursorPosition.x - guiElement.position.x);

            if (distX < guiElement.options.width / 2) {

                distY = Math.abs(cursorPosition.y - guiElement.position.y);
                if (distY < guiElement.options.height / 2) {
                    return true;
                }
            }
        };

        var currentPointerState;


        HudPointerProcessor.prototype.checkPointerTrigger = function(guiElement) {

        };

        HudPointerProcessor.prototype.updateDisabledElement = function(guiElement) {
            guiElement.setPointerState(ENUMS.PointerStates.ENABLED);
        };

        HudPointerProcessor.prototype.initPressOnElement = function(guiElement) {
            initPressElement = guiElement;
            guiElement.setPointerState(ENUMS.PointerStates.PRESS_INIT)
        };

        HudPointerProcessor.prototype.updateEnabledElement = function(guiElement, pressActive) {

            if (pressFrames === 1) {
                this.initPressOnElement(guiElement);
            } else {
                guiElement.setPointerState(ENUMS.PointerStates.HOVER)
            }

        };

        HudPointerProcessor.prototype.updateHoveredElement = function(guiElement, pressActive) {
            if (pressFrames === 1) {
                this.initPressOnElement(guiElement);
            }
        };

        HudPointerProcessor.prototype.updatePressInitElement = function(guiElement, pressActive) {
            if (pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.PRESS)
            } else {
                guiElement.setPointerState(ENUMS.PointerStates.ENABLED)
            }
        };

        HudPointerProcessor.prototype.updatePressedElement = function(guiElement, pressActive) {

            if (initPressElement !== guiElement) {
                return;
            }

            if (!pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.ACTIVATE)
            }
        };

        HudPointerProcessor.prototype.updatePressExitElement = function(guiElement, pressActive) {
            if (!pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.ENABLED)
            } else {
                guiElement.setPointerState(ENUMS.PointerStates.PRESS)
            }
        };

        HudPointerProcessor.prototype.updateActivatingElement = function(guiElement, pressActive) {
            guiElement.setPointerState(ENUMS.PointerStates.ACTIVE)
        };

        HudPointerProcessor.prototype.updateActiveElement = function(guiElement, pressActive) {

            if (initPressElement !== guiElement) {
                return;
            }

            if (pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.ACTIVE_PRESS)
            } else {
                guiElement.setPointerState(ENUMS.PointerStates.ACTIVE_HOVER)
            }
        };

        HudPointerProcessor.prototype.updateActiveHoverElement = function(guiElement, pressActive) {
            if (pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.ACTIVE_PRESS)
            }
        };

        HudPointerProcessor.prototype.updateActivePressedElement = function(guiElement, pressActive) {

            if (initPressElement !== guiElement) {
                return;
            }

            if (!pressActive) {
                guiElement.setPointerState(ENUMS.PointerStates.DEACTIVATE)
            }
        };

        HudPointerProcessor.prototype.updateDeactivatingElement = function(guiElement, pressActive) {
            guiElement.setPointerState(ENUMS.PointerStates.ENABLED)
        };

        HudPointerProcessor.prototype.updateReleasedElement = function(guiElement, pressActive) {

        };


        HudPointerProcessor.prototype.updateTargetElementAction = function(guiElement, pressActive) {

            switch (currentPointerState) {
                case ENUMS.PointerStates.ENABLED:       this.updateEnabledElement(guiElement, pressActive);         break;
                case ENUMS.PointerStates.HOVER:         this.updateHoveredElement(guiElement, pressActive);         break;
                case ENUMS.PointerStates.PRESS_INIT:    this.updatePressInitElement(guiElement, pressActive);       break;
                case ENUMS.PointerStates.PRESS:         this.updatePressedElement(guiElement, pressActive);         break;
                case ENUMS.PointerStates.PRESS_EXIT:    this.updatePressExitElement(guiElement, pressActive);       break;
                case ENUMS.PointerStates.ACTIVATE:      this.updateActivatingElement(guiElement, pressActive);      break;
                case ENUMS.PointerStates.ACTIVE:        this.updateActiveElement(guiElement, pressActive);          break;
                case ENUMS.PointerStates.ACTIVE_PRESS:  this.updateActivePressedElement(guiElement, pressActive);   break;
                case ENUMS.PointerStates.ACTIVE_HOVER:  this.updateActiveHoverElement(guiElement, pressActive);     break;
                case ENUMS.PointerStates.DEACTIVATE:    this.updateDeactivatingElement(guiElement, pressActive);    break;
            }

        };


        HudPointerProcessor.prototype.updateNonTargetElementAction = function(guiElement, pressActive) {

            if (pressActive) {

                switch (currentPointerState) {
                    case ENUMS.PointerStates.HOVER:         guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.PRESS_INIT:    guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.PRESS:         guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.PRESS_EXIT:    guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.ACTIVATE:      this.updateActivatingElement(guiElement, pressActive);      break;
                    case ENUMS.PointerStates.ACTIVE_PRESS:  guiElement.setPointerState(ENUMS.PointerStates.ACTIVE);     break;
                    case ENUMS.PointerStates.ACTIVE_HOVER:  guiElement.setPointerState(ENUMS.PointerStates.ACTIVE_PRESS);     break;
                    case ENUMS.PointerStates.DEACTIVATE:    this.updateDeactivatingElement(guiElement, pressActive);    break;
                }

            } else {

                switch (currentPointerState) {
                    case ENUMS.PointerStates.DISABLED:      this.updateDisabledElement(guiElement, pressActive);     break;
                    case ENUMS.PointerStates.HOVER:         guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.PRESS_INIT:    guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.PRESS:         guiElement.setPointerState(ENUMS.PointerStates.RELEASE);    break;
                    case ENUMS.PointerStates.PRESS_EXIT:    guiElement.setPointerState(ENUMS.PointerStates.ENABLED);    break;
                    case ENUMS.PointerStates.ACTIVATE:      this.updateActivatingElement(guiElement, pressActive);      break;
                    case ENUMS.PointerStates.ACTIVE_HOVER:  guiElement.setPointerState(ENUMS.PointerStates.ACTIVE);     break;
                    case ENUMS.PointerStates.ACTIVE_PRESS:  guiElement.setPointerState(ENUMS.PointerStates.DEACTIVATE); break;
                    case ENUMS.PointerStates.DEACTIVATE:    this.updatePressExitElement(guiElement, pressActive);     break;
                }

            }

        };

        var elementIsPointedAt = false;

        HudPointerProcessor.prototype.applyPointerToElement = function(guiElement, mouseState, cursorPosition) {

            pressFrames = mouseState.pressFrames;

            elementIsPointedAt = isPointedAt(guiElement, cursorPosition);

            if (elementIsPointedAt) {
                this.updateTargetElementAction(guiElement, mouseState.action[0])
            } else {
                this.updateNonTargetElementAction(guiElement, mouseState.action[0])
            }
        };


        HudPointerProcessor.prototype.updateElementPointerState = function(guiElement, mouseState, cursorPosition) {

            currentPointerState = guiElement.getPointerState();

            this.applyPointerToElement(guiElement, mouseState, cursorPosition);

            return currentPointerState !== guiElement.getPointerState();

        };

        return HudPointerProcessor;

    });