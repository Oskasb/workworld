"use strict";


define([
        'Events',
        'PipelineAPI',
        'ui/GameScreen'
    ],
    function(
        evt,
        PipelineAPI,
        GameScreen
    ) {

        var txt = {
            flscrn:"FL SCRN",
            exit:"EXIT",
            bnd:"BOUND"
        }

        var FullScreenConfigurator = function() {

            var buttonEvent = {category:ENUMS.Category.STATUS, key:ENUMS.Key.FULL_SCREEN, type:ENUMS.Type.toggle};

            var buttonConf = {
                panel:ENUMS.Gui.leftPanel,
                id:"fullscreenbutton",
                container:"main_container",
                data:{
                    style:["panel_button", "coloring_button_main_panel"],
                    button:{
                        id:"panel_button",
                        event:buttonEvent
                    },
                    text:txt.flscrn
                }
            };

            var playerReady = function() {
                evt.fire(evt.list().ADD_GUI_ELEMENT, {data:buttonConf});
            };

        //    evt.on(evt.list().PLAYER_READY, playerReady);


            this.currentValue = 0;

            PipelineAPI.setCategoryData(ENUMS.Category.STATUS, {FULL_SCREEN:false});

            var _this=this;

            var apply = function(src, value) {
                setTimeout(function() {
                    _this.applyFullScreen(src, value)
                }, 100);
            };

            PipelineAPI.subscribeToCategoryKey(ENUMS.Category.STATUS, ENUMS.Key.FULL_SCREEN, apply);

            var processButtonEvent = function(e) {

                function toggleFullScreen() {

                    if (!_this.currentValue) {
                        elem.innerHTML = txt.exit;
                        GameScreen.goFullscreen();

                    //        PipelineAPI.setCategoryKeyValue(ENUMS.Category.GUI_ELEMENT, ENUMS.Key.REMOVE, buttonConf);
                    } else {
                        elem.innerHTML = txt.flscrn;
                        GameScreen.exitFullscreen();

                    //    evt.fire(evt.list().REMOVE_GUI_ELEMENT, {data:buttonConf});

                    }
                }

            //    console.log("BUTTON EVT FULLSCREEN!", evt.args(e));

                if (evt.args(e).data.FULL_SCREEN) {



                    var elem = evt.args(e).element;

                    elem.innerHTML = txt.bnd;
                    console.log("BIND EVT FULLSCREEN!", evt.args(e).data);

                    elem.addEventListener('click', function(e) {
                        //    if (e.keyCode == 13) {

                        console.log("TOGGLE FULLSCREEN!");
                        toggleFullScreen();
                        //    }
                    }, false);

                    evt.removeListener(evt.list().BUTTON_EVENT, processButtonEvent);
                }
            };

            evt.on(evt.list().BUTTON_EVENT, processButtonEvent);



        };

        FullScreenConfigurator.prototype.applyFullScreen = function(src, value) {

            if (this.currentValue == value) {
                return
            }

            this.currentValue = value;

        };


        return FullScreenConfigurator;

    });