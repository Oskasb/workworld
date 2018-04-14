"use strict";

define([
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/world/WorldMain'
    ],
    function(
        ProtocolRequests,
        WorldMessages,
        WorldMain
    ) {

        var worldMain;
        var protocolRequests;
        var worldMessages;

        var WorldAPI = function() {};

        WorldAPI.initWorld = function() {
            worldMessages = new WorldMessages(WorldAPI);
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

        return WorldAPI;
    });

