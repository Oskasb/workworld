define([
        'PipelineAPI'
    ],
    function(
        PipelineAPI
    ) {

        var PipelineObject = function(category, key, onDataCallback, immediateDataKey) {
            this.category = category;
            this.key = key;
            this.data = {};
            this.configs = {};

            this.subscribe(onDataCallback, immediateDataKey);

        };


        PipelineObject.prototype.subscribe = function(onDataCallback, immediateDataKey) {


            var dataCallback = function(src, data) {

                    this.data = data;
                    if (typeof(onDataCallback) === 'function') {
                        onDataCallback(src, data);
                    }

            }.bind(this);

            this.dataCallback = dataCallback;
            var cat = this.category;
            var key = this.key;

            if (immediateDataKey && this.readData()[immediateDataKey]) {
                PipelineAPI.subscribeToCategoryKey(cat, key, dataCallback);
            } else {
                setTimeout(function() {
                    PipelineAPI.subscribeToCategoryKey(cat, key, dataCallback);
                },0);
            }
        };
        
        PipelineObject.prototype.buildConfig = function(dataName) {

            if (!dataName) dataName = 'data';

            this.data = this.readData();
            this.configs = {};

            if (this.data.length) {
                for (var i = 0; i < this.data.length; i++) {
                    this.configs[this.data[i].id] = this.data[i][dataName];
                }
            } else {
                console.log("Data not Array Type", this.category, this.key, this.data)
            }

            return this.configs;
        };

        PipelineObject.prototype.setData = function(data) {
            PipelineAPI.setCategoryKeyValue(this.category, this.key, data);
        };

        PipelineObject.prototype.getElementId = function(id) {
            this.data = this.readData();
            this.configs = {};

            if (this.data.length) {
                for (var i = 0; i < this.data.length; i++) {
                    this.configs[this.data[i].id] = this.data[i];
                }
            } else {
                console.log("Data not Array Type", this.category, this.key, this.data)
            }
        };


        PipelineObject.prototype.readData = function() {
            return PipelineAPI.readCachedConfigKey(this.category, this.key);
        };

        PipelineObject.prototype.removePipelineObject = function() {
            return PipelineAPI.removeCategoryKeySubscriber(this.category, this.key, this.dataCallback);
        };

        return PipelineObject
    });