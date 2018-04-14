"use strict";

define([
        'WorkerAPI',
		'io/VisualCursor',
		'io/InputState',
		'Events'
	],
	function(
        WorkerAPI,
		VisualCursor,
		InputState,
		evt
	) {

        var mouseState;

		var PointerCursor = function() {

			this.guiStateTransitionCallbacks = {
				passive:[],
				on_hover:[],
				on_active:[],
				on_applied:[],
				on_message:[]
			};

			this.pointerStateTransitionCallbacks = {
				press_0:[],
				press_1:[],
				press_2:[],
				release_0:[],
				release_1:[],
				release_2:[]
			};

			this.inputState = new InputState();

			this.x = 0;
			this.y = 0;

			var _this = this;

			this.enabled = false;

			function configureListener(e) {
				if (evt.args(e).inputModel) {
					_this.enabled = true;
					evt.removeListener(evt.list().SCREEN_CONFIG, configureListener);
				}
			}

			evt.on(evt.list().SCREEN_CONFIG, configureListener);
            mouseState = this.inputState.getPointerState().mouseState;
            this.setupInputBuffer();

		};

        PointerCursor.prototype.getPointerState = function() {
            return this.inputState.getPointerState();
        };

        PointerCursor.prototype.lineDistance = function(fromX, fromY, toX, toY) {
            return Math.sqrt((fromX - toX)*(fromX - toX) + (fromY - toY)*(fromY - toY));
        };

		PointerCursor.prototype.inputVector = function(fromX, fromY, toX, toY) {
            this.inputState.setLine(fromY, fromX, toY, toX, this.lineDistance(fromX, fromY, toX, toY), Math.atan2(fromX - toX, fromY - toY));
		};

        PointerCursor.prototype.setupInputBuffer = function() {
            var buffer = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * ENUMS.InputState.BUFFER_SIZE);
            this.buffer = new Float32Array(buffer);
            this.inputState.getPointerState().buffer = this.buffer;

        };

        PointerCursor.prototype.updateInputBuffer = function() {

            this.buffer[ENUMS.InputState.MOUSE_X]           = mouseState.x;
            this.buffer[ENUMS.InputState.MOUSE_Y]           = mouseState.y;
            this.buffer[ENUMS.InputState.WHEEL_DELTA]       = mouseState.wheelDelta;
            this.buffer[ENUMS.InputState.START_DRAG_X]      = mouseState.startDrag[0];
            this.buffer[ENUMS.InputState.START_DRAG_Y]      = mouseState.startDrag[1];
            this.buffer[ENUMS.InputState.DRAG_DISTANCE_X]   = mouseState.dragDistance[0];
            this.buffer[ENUMS.InputState.DRAG_DISTANCE_Y]   = mouseState.dragDistance[1];
            this.buffer[ENUMS.InputState.ACTION_0]          = mouseState.action[0];
            this.buffer[ENUMS.InputState.ACTION_1]          = mouseState.action[1];
            this.buffer[ENUMS.InputState.LAST_ACTION_0]     = mouseState.lastAction[0];
            this.buffer[ENUMS.InputState.LAST_ACTION_1]     = mouseState.lastAction[1];
            this.buffer[ENUMS.InputState.PRESS_FRAMES]      = mouseState.pressFrames

        };

		PointerCursor.prototype.tick = function() {
			if (this.enabled) {
                this.inputState.updateInputState();
			}

			this.updateInputBuffer();
		};

		return PointerCursor;
	});