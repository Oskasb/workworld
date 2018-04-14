"use strict";

define([
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/world/WorldMain',
        'worker/world/WorldControlState'
    ],
    function(
        ProtocolRequests,
        WorldMessages,
        WorldMain,
        WorldControlState
    ) {

        var worldMain;
        var protocolRequests;
        var worldMessages;
        var worldControlState;

        var WorldAPI = function() {};

        WorldAPI.initWorld = function() {
            worldMessages = new WorldMessages(WorldAPI);
            worldControlState = new WorldControlState(WorldAPI);
            worldMain = new WorldMain(WorldAPI);
            protocolRequests = new ProtocolRequests();
            protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers())
        };

        WorldAPI.setWorldLoopTpf = function(tpf) {
            worldMain.setLoopTpf(tpf)
        };

        WorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        WorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        WorldAPI.setWorldInputBuffer = function(buffer) {
            worldControlState.setInputBuffer(buffer)
        };

        WorldAPI.updateWorldWorkerFrame = function(tpf, frame) {
            worldControlState.updateWorldControlState()
            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame)
        };

        return WorldAPI;
    });

