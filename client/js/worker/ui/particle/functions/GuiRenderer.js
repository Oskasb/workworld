"use strict";

define([
        'ThreeAPI',
        'io/PipelineAPI',
        'ui/particle/functions/GuiRendererCallbacks',

        'ui/particle/elements/GuiElement',
        'ui/particle/elements/GuiSystem',
        'application/ExpandingPool'
    ],
    function(
        ThreeAPI,
        PipelineAPI,
        GuiRendererCallbacks,
        GuiElement,
        GuiSystem,
        ExpandingPool
    ) {

        var mouseState;

        var guiRendererCallbacks;

        var GameAPI;

        var combatElemId = "gui_combat_plate_element";

        var expandingPools = {};


        var guiSystems = {};
        var guiElements = [];

        var combatStatusElements = [];

        function createElementByDataKey(dataKey, onReadyCB) {
            new GuiElement(dataKey, onReadyCB)
        }

        var GuiRenderer = function(gameApi) {
            GameAPI = gameApi;
            guiRendererCallbacks = new GuiRendererCallbacks(this, GameAPI);

            this.initiateGuiSystems();


            var fetchPointer = function(src, data) {
                mouseState = data;
            };

            PipelineAPI.subscribeToCategoryKey('POINTER_STATE', 'mouseState', fetchPointer);

        };


        GuiRenderer.prototype.getGuiElement = function(dataKey, callback) {

            if (!expandingPools[dataKey]) {
                expandingPools[dataKey] = new ExpandingPool(dataKey, createElementByDataKey);
            }

            expandingPools[dataKey].getFromExpandingPool(callback);
        };

        GuiRenderer.prototype.removeGuiElement = function(guiElement) {
            expandingPools[guiElement.dataKey].returnToExpandingPool(guiElement);
        };


        GuiRenderer.prototype.generateGuiElement = function(elementId, store) {

            var elementReady = function(guiElement) {
                if (guiElement.renderFunc) {
                    store.push(guiElement);
                }

            };

            this.getGuiElement(elementId, elementReady);

        };


        GuiRenderer.prototype.activateGuiSystemId = function(systemId) {
            guiSystems[systemId].activateGuiSystem();
        };


        GuiRenderer.prototype.deactivateGuiSystemId = function(systemId) {
            guiSystems[systemId].deactivateGuiSystem();
        };

        GuiRenderer.prototype.initiateGuiSystems = function() {

            var guiSystemData = function(src, data) {

                for (var i = 0; i < data.length; i++) {
                    guiSystems[data[i].id] = new GuiSystem(data[i], this);
                }

            }.bind(this);

            PipelineAPI.subscribeToCategoryKey('GUI_PARTICLE_SYSTEMS', 'SYSTEMS', guiSystemData)
        };


        GuiRenderer.prototype.requestCameraMatrixUpdate = function() {
            ThreeAPI.updateCamera();
        };

        var addBombatElementCB = function(element) {
            combatStatusElements.push(element);
        };

        GuiRenderer.prototype.addCombatElement = function() {
            this.getGuiElement(combatElemId, addBombatElementCB)

        };


        GuiRenderer.prototype.getActorCombatElement = function(actor, isIdle) {

            var available = -1;

            var actors = GameAPI.getActors();

            for (var i = 0; i < combatStatusElements.length; i++) {
                var target = combatStatusElements[i].getTarget();
                if (target === actor) {
                    return combatStatusElements[i];
                }


                if (!target) {
                    available = i;
                } else if (actors.indexOf(target) === -1) {
                    combatStatusElements[i].setTarget(null);
                    available = i;
                }

            }

            if (isIdle) return;

            if (available > -1) {
                combatStatusElements[available].setTarget(actor);
                return combatStatusElements[available];
            }

            this.addCombatElement();
        };

        GuiRenderer.prototype.updateGuiRenderer = function() {

            guiRendererCallbacks.updateMouseState(mouseState);

            for (var key in guiSystems) {
                guiSystems[key].updateGuiSystem(guiRendererCallbacks);
            }

            var actors = GameAPI.getActors();

            for (var i = 0; i < actors.length; i++) {

                var combatStatus = actors[i].piece.getCombatStatus();

                if (combatStatus) {
                    var isIdle = (combatStatus.getCombatState() === ENUMS.CombatStates.IDLE);

                    var combatElem = this.getActorCombatElement(actors[i], isIdle);
                    if (combatElem) {
                        combatElem.updateGuiElement(guiRendererCallbacks);
                    }
                }
            }
        };

        return GuiRenderer;

    });