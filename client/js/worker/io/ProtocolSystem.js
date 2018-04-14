"use strict";

// self.SharedArrayBuffer = null

define([], function() {

    var ProtocolSystem = function() {
        this.protocols = {};
        this.targetMap = {};
    };

    ProtocolSystem.prototype.handleMessage = function(msg) {

        if (this.protocols[msg[0]]) {
            this.handleProtocolMessage(msg);
            return;
        } else {
            console.log("No protocol for", msg)
        }
    };

    ProtocolSystem.prototype.mapProtocolTargets = function(msg) {
        this.targetMap[msg[0]] = msg[1];
    };

    ProtocolSystem.prototype.contains = function(msgName) {
        if (this.protocols[msgName]) {
            return true;
        }
    };

    ProtocolSystem.prototype.removeProtocol = function(actor) {
        if (!this.protocols[actor.id]) {
            console.log("No protocol to remove for actor", actor);
            return;
        }

        if (this.targetMap[actor.id]) {
            delete this.targetMap[actor.id];
        }

        delete this.protocols[actor.id];
    };

    ProtocolSystem.prototype.updateActorSendProtocol = function(actor, tpf) {

        var targetTime =  tpf * 2;

        var prot = this.protocols[actor.id];

        if (!prot) {
            return;
        }
        var count = 0;

        var msg = [prot[0], prot[1]];

        for (var i = 0; i < actor.piece.pieceStates.length; i++) {
            for (var j = 2; j < prot.length; j++) {
                var targetKey = actor.piece.pieceStates[i].id;
                if (prot[j] === targetKey) {
                    var targetChannel = prot.indexOf(targetKey);
                //    actor.piece.pieceStates[i].value = Math.sin(new Date().getTime() * 1000)*100;
                    var diff = Math.abs(prot[targetChannel+1] - actor.piece.pieceStates[i].getValue());
                    if (diff) {

                        if (diff < 5) {
                            targetTime =  tpf * 2;
                        } else {
                            targetTime = 0;
                        }

                        prot[targetChannel+1] = actor.piece.pieceStates[i].getValue();
                        msg.push(targetChannel);
                        msg.push(prot[targetChannel+1]);
                        msg.push(targetTime);
                    //    if (self.SharedArrayBuffer) {
                            prot[targetChannel+2][0] = prot[targetChannel+1];
                            prot[targetChannel+2][1] = targetTime;
                    //    }
                        count++;
                    }
                }
            }
        }

        if (!count) return;
        if (self.SharedArrayBuffer) return;
        self.postMessage(msg);
    };

    ProtocolSystem.prototype.addProtocol = function(protocol) {
        this.protocols[protocol[0]] = protocol;
        this.targetMap[protocol[0]] = [];
    };

    ProtocolSystem.prototype.applyProtocolToActorState = function(actor, tpf) {
        var prot = this.protocols[actor.id];

        if (!prot) {
            return;
        }

        for (var i = 0; i < actor.piece.pieceStates.length; i++) {
            for (var j = 2; j < prot.length; j++) {
                var targetKey = actor.piece.pieceStates[i].id;
                if (prot[j] === targetKey) {
                    var targetChannel = prot.indexOf(targetKey);
                    //  actor.piece.pieceStates[i].setValue(prot[targetChannel+2][0]);
                    actor.piece.pieceStates[i].buffer = prot[targetChannel+2];
                    prot[targetChannel+2][0] = prot[targetChannel+1];
                    prot[targetChannel+2][1] = tpf;
                }
            }
        }
        return true;
    };

    ProtocolSystem.prototype.updateTargetProtocol = function(target, channels, protocol) {
        var msg = [target[0], target[1]];

        var addStateToMessage = function(channelKey, targetKey) {

            var sourceChannel = protocol.indexOf(channelKey); //2 + 3 * Math.floor(Math.random()*channelCount);

            var targetChannel = target.indexOf(targetKey);

            target[targetChannel+1] = protocol[sourceChannel+1];


        //    if (self.SharedArrayBuffer) {
                target[targetChannel+2][0] = target[targetChannel+1];
                target[targetChannel+2][1] = 0.05;
         //   } else {
                msg.push(targetChannel);
                msg.push(target[targetChannel+1]);
                msg.push(0.05);
        };

        for (var i = 0; i < channels.length; i++) {
            var channelGroup = channels[i];

            for (var j = 1; j < channelGroup.length; j++) {
                addStateToMessage(channelGroup[0], channelGroup[j])
            }
        }

        if (self.SharedArrayBuffer) return;
        self.postMessage(msg);
    };


    ProtocolSystem.prototype.handleProtocolMessage = function(protocol) {

        if (!this.targetMap[protocol[0]]) {
            console.log("No target map", this.targetMap, protocol);
            return;
        }
        var target = this.protocols[protocol[1]];
        var channels = this.targetMap[protocol[0]];
        this.updateTargetProtocol(target, channels, protocol);

    };


    return ProtocolSystem;

});
