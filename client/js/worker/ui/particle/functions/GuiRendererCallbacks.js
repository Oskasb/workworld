"use strict";

define([

        'ui/particle/functions/GuiFeedbackFunctions',
    'ui/particle/processors/CombatStatusUiProcessor',
        'ui/particle/processors/HudUiProcessor',
        'ui/particle/processors/HudMapProcessor'
    ],
    function(

        GuiFeedbackFunctions,
        CombatStatusUiProcessor,
        HudUiProcessor,
        HudMapProcessor
    ) {

        var GameAPI;
        var guiRenderer;


        var GuiRendererCallbacks = function(gRenderer, gameApi) {
            GameAPI = gameApi;
            guiRenderer = gRenderer;
            this.guiFeedbackFunctions = new GuiFeedbackFunctions();
            this.cursorElement = null;
            this.combatStatusUiProcessor = new CombatStatusUiProcessor(gRenderer, gameApi);



            this.hudUiProcessor = new HudUiProcessor(gRenderer, gameApi);
            this.hudMapProcessor = new HudMapProcessor(gRenderer, gameApi);

        };


        GuiRendererCallbacks.prototype.pxXtoPercentX = function(x) {
            return 100*x/GameScreen.getWidth()
        };

        GuiRendererCallbacks.prototype.pxYtoPercentY = function(y) {
            return 100*y/GameScreen.getHeight();
        };

        GuiRendererCallbacks.prototype.transformConnector = function(x1, y1, x2, y2, distance, zrot) {

        };


        GuiRendererCallbacks.prototype.showDragToPoint = function(x, y, distance, angle) {

        };

        GuiRendererCallbacks.prototype.showStartDragPoint = function(x, y, distance, angle) {

        };

        GuiRendererCallbacks.prototype.generateChildElement = function(dataKey, callback) {
            guiRenderer.getGuiElement(dataKey, callback)
        };

        GuiRendererCallbacks.prototype.removeChildElement = function(guiElement) {
            guiRenderer.removeGuiElement(guiElement)
        };

        GuiRendererCallbacks.prototype.show_map_corners = function(guiElement) {
            this.hudMapProcessor.show_map_corners(guiElement);
        };

        GuiRendererCallbacks.prototype.draw_local_map = function(guiElement) {
            this.hudMapProcessor.process_local_map(guiElement);
        };

        GuiRendererCallbacks.prototype.updateElementsSpriteKey = function(fxElements, spriteKey) {
            this.guiFeedbackFunctions.updateElementsSprite(fxElements, spriteKey);
        };

        GuiRendererCallbacks.prototype.updateElementsColorCurveKey = function(fxElements, colorKey) {
            this.guiFeedbackFunctions.updateElementsColor(fxElements, colorKey);
        };

        GuiRendererCallbacks.prototype.enable_geometry_element = function(guiElement, fxIndexe) {
            return this.guiFeedbackFunctions.enableElement(guiElement.elementId, guiElement.position, guiElement.fxIds[fxIndex], guiElement.fxElements);
        };

        GuiRendererCallbacks.prototype.enable_fx_element = function(guiElement, fxIndex) {
            return this.guiFeedbackFunctions.enableElement(guiElement.elementId, guiElement.position, guiElement.fxIds[fxIndex], guiElement.fxElements);
        };

        GuiRendererCallbacks.prototype.set_geomety_pos_quat = function(guiElement, fxElement) {
            this.guiFeedbackFunctions.updateElementPosition(fxElement, guiElement.position);
        };

        GuiRendererCallbacks.prototype.set_element_position = function(guiElement, fxElement) {
            this.guiFeedbackFunctions.updateElementPosition(fxElement, guiElement.position);
        };

        GuiRendererCallbacks.prototype.disable_fx_element = function(fxStore) {
            this.guiFeedbackFunctions.disableElement(fxStore);
        };

        GuiRendererCallbacks.prototype.show_aim_state_status = function(guiElement) {
            this.hudUiProcessor.show_aim_state_status(guiElement);
        };


        GuiRendererCallbacks.prototype.show_combat_status = function(guiElement) {
            this.combatStatusUiProcessor.show_combat_status(guiElement);
        };

        GuiRendererCallbacks.prototype.show_application_status = function(guiElement) {
            this.hudUiProcessor.show_application_status(guiElement);
        };

        GuiRendererCallbacks.prototype.show_menu_status = function(guiElement) {
            this.hudUiProcessor.show_menu_status(guiElement);
        };

        GuiRendererCallbacks.prototype.show_selection_corners = function(guiElement) {
            this.hudUiProcessor.show_selection_corners(guiElement);
        };

        GuiRendererCallbacks.prototype.show_cursor_point = function(guiElement) {
            this.hudUiProcessor.show_cursor_point(guiElement);
        };

        GuiRendererCallbacks.prototype.show_active_selection = function(guiElement) {
            this.hudUiProcessor.show_active_selection(guiElement);
        };


        GuiRendererCallbacks.prototype.updateMouseState = function(mState) {
            this.hudUiProcessor.updateMouseState(mState);
        };


        return GuiRendererCallbacks;

    });