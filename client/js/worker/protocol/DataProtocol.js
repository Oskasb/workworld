"use strict";

define([],
    function() {

        var DataProtocol = function(pieceKey, pieceStates, worker) {

            this.messageCount = 0;

            this.ptcNr = pieceKey;

            this.worker = worker;

            this.stateKeyMap = {};
            this.protocol = [this.ptcNr, pieceKey];

            for (var i = 0; i < pieceStates.length; i++) {
                this.addStateChannel(pieceStates[i])
            }
            this.protocol.push(new Date().getTime());

            this.worker.postMessage(['registerProtocol', this.protocol]);
        };

        DataProtocol.prototype.recieveMessage = function(data) {
            this.messageCount++;
            for (var i = 2; i < data.length-1; i++) {
                this.setStateValue(data[i], data[i+1], data[i+2]);
                i++;
                i++;
            }
        };


        DataProtocol.prototype.setStateValue = function(stateIndex, value, time) {
            if (!this.stateKeyMap[stateIndex]) {
                console.log("No", stateIndex, this.protocol);
                return;
            }
        //    this.stateKeyMap[stateIndex].setValueAtTime(value, time);
            this.stateKeyMap[stateIndex].buffer[0] = value;
            this.stateKeyMap[stateIndex].buffer[1] = time;
        };

        DataProtocol.prototype.addStateChannel = function(state, buffer) {
            this.protocol.push(state.id);
            var stateIdx = this.protocol.indexOf(state.id);
            this.protocol.push(state.getValue());
            this.protocol.push(state.buffer);
            this.stateKeyMap[stateIdx] = state;
        };

        DataProtocol.prototype.postState = function(stateKey, value) {
            var stateIdx = this.protocol.indexOf(stateKey);
            this.protocol[stateIdx+1] = value;
            this.worker.postMessage(this.protocol);
        };

        // Use to bind player inputs to worker side state controls on another protocol
        DataProtocol.prototype.mapTargetChannels = function(actor, controlStateMap) {
            this.protocol[1] = actor.id;

            var channelMatrix = [];

            for (var stateKey in controlStateMap.controlTarget) {
                var channelGroup = [stateKey];
                for (var i = 0; i < controlStateMap.controlTarget[stateKey].length; i++) {
                    var targetKey = controlStateMap.controlTarget[stateKey][i].id;
                    channelGroup.push(targetKey);
                }
                channelMatrix.push(channelGroup);
            }

            this.worker.postMessage(['mapTarget', [this.protocol[0], channelMatrix]]);
        };

        return DataProtocol
    });
