"use strict";

define([
        'PipelineAPI'
    ],
    function(
        PipelineAPI
    ) {

        var i;

        var notifyStatus = function(store, value, dataKey) {
            if (!store[dataKey]) {
                store[dataKey] = {}
            }
            store[dataKey].dirty = store[dataKey].value !== value;
            store[dataKey].key = dataKey;
            store[dataKey].value = value
        };

        var listData = function(list, data) {

            for (i = 0; i < data.length; i++) {
                list[i] = data[i];
            }
        };

        var updateMessageHistory = function(channel, rows, maxHistory) {
            for (i = 0; i < rows; i++) {
                if (channel.messages[i]) {
                    notifyStatus(channel.view,     channel.messages[i],     i);
                }
            }

            while(channel.messages.length > maxHistory) {
                channel.messages.pop();
            }

            listData(channel.entries, channel.view);
        };

        var GuiMessageFunctions = function(rows, maxHistory) {
            this.maxHistory = maxHistory;
            this.rows = rows;
            this.channels = {}
        };

        GuiMessageFunctions.prototype.registerMessageChannel = function(category, key) {

            this.channels[key] = {
                messages: new Array(this.rows),
                view: [],
                entries: []
            };

            PipelineAPI.setCategoryKeyValue(category, key, this.channels[key]);
        };


        GuiMessageFunctions.prototype.updateMessageChannels = function() {

            for (var key in this.channels) {
                updateMessageHistory(this.channels[key], this.rows, this.maxHistory);
            }

        };

        return GuiMessageFunctions;

    });

