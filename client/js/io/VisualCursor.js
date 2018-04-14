"use strict";

define([
	'ui/GameScreen',
	'ui/particle/functions/GuiFeedbackFunctions'
],
	function(
		GameScreen,
        GuiFeedbackFunctions
		) {

		var mouseState;
        var pointerFrustumPos = new THREE.Vector3();
        var cursorElementId = 'gui_cursor_pointer_follow';
        var cursorEeffectId = 'gui_pointer_follow_effect';

		var VisualCursor = function() {
			this.guiFeedbackFunctions = new GuiFeedbackFunctions();
			this.cursorElement = null;
		};


        VisualCursor.prototype.pxXtoPercentX = function(x) {
			return 100*x/GameScreen.getWidth()
		};

		VisualCursor.prototype.pxYtoPercentY = function(y) {
			return 100*y/GameScreen.getHeight();
		};

		VisualCursor.prototype.transformConnector = function(x1, y1, x2, y2, distance, zrot) {

		};

		VisualCursor.prototype.showDragToPoint = function(x, y, distance, angle) {

		};

		VisualCursor.prototype.showStartDragPoint = function(x, y, distance, angle) {

		};

        VisualCursor.prototype.enableCursorElement = function() {
            this.cursorElement = this.guiFeedbackFunctions.enableElement(cursorElementId, pointerFrustumPos, cursorEeffectId);
        };

        VisualCursor.prototype.setElementPosition = function(pointerPos) {
            this.guiFeedbackFunctions.updateElementPosition(cursorElementId, pointerPos);
        };

		VisualCursor.prototype.showCursorPoint = function() {

            if (mouseState.action[0]) {

                if (!this.cursorElement) {
                    this.enableCursorElement()
                }

                pointerFrustumPos.set(
                    ((mouseState.x-GameScreen.getLeft()) / GameScreen.getWidth() - 0.5),
                    -((mouseState.y-GameScreen.getTop()) / GameScreen.getHeight()) + 0.5,
                    -2
                );

                GameScreen.fitView(pointerFrustumPos);
                this.setElementPosition(pointerFrustumPos);

            } else if (this.cursorElement) {
                this.guiFeedbackFunctions.disableElement(cursorElementId);
                this.cursorElement = null;
            }

		};



		VisualCursor.prototype.visualizeMouseState = function(mState) {
            mouseState = mState;
        //    this.showCursorPoint();
		};

		VisualCursor.prototype.visualizeVector = function(fromX, fromY, toX, toY) {

		};

		return VisualCursor;

	});