
if(typeof(ENUMS) === "undefined"){
    ENUMS = {};
}

(function(ENUMS){


    ENUMS.Protocol = {
        WAKE_INDEX:         0,
        WORKER_READY:       1,
        SET_LOOP:           2,
        NOTIFY_FRAME:       3,
        SET_INPUT_BUFFER:   4,
        SET_WORLD_BUFFER:   5,
        CREATE_WORLD:       6,
        REGISTER_TERRAIN:   7,
        FETCH_PIPELINE_DATA:8,
        SEND_PIPELINE_DATA: 9
    };

    ENUMS.BufferChannels = {
        WAKE_INDEX:         0,
        MEM_JS_HEAP:        1,
        MEM_JS_MB:          2,
        SHADERS:            3,
        SCN_NODES:          4,
        MESH_POOL:          5,
        DRAW_CALLS:         6,
        VERTICES:           7,
        GEOMETRIES:         8,
        TEXTURES:           9,

        TPF:                10,
        IDLE:               11,
        TIME_GAME:          12,
        TIME_RENDER:        13,
        FILE_CACHE:         14,
        EVENT_LISTENERS:    15,
        EVENT_TYPES:        16,
        LISTENERS_ONCE:     17,
        FIRED_EVENTS:       18,
        FRAME_RENDER_TIME:  19,
        CAM_POS_X:          20,
        CAM_POS_Y:          21,
        CAM_POS_Z:          22,
        CAM_QUAT_X:         23,
        CAM_QUAT_Y:         24,
        CAM_QUAT_Z:         25,
        CAM_QUAT_W:         26,
        CAM_FOV:            27,
        CAM_NEAR:           28,
        CAM_FAR:            29,
        CAM_ASPECT:         30

    };

    ENUMS.BufferTypes = {
        ENVIRONMENT:        0,
        CAMERA:             1,
        SPATIAL:            2,
        TERRAIN:            3
    };

    ENUMS.Worker = {
        WORLD:              0,
        DATA:               1
    };

    ENUMS.ClientStates = {
        INITIALIZING:'INITIALIZING',
        DISCONNECTED:'DISCONNECTED',
        CONNECTING:'CONNECTING',
        CONNECTED:'CONNECTED',
        LOADING:'LOADING',
        READY:'READY',
        PLAYING:'PLAYING',
        CLIENT_REQUESTED:'CLIENT_REQUESTED',
        CLIENT_REGISTERED:'CLIENT_REGISTERED',
        PLAYER_REQUESTED:'PLAYER_REQUESTED'
    };

    ENUMS.PointerStates = {
        DISABLED:       0,
        ENABLED:        1,
        HOVER:          2,
        PRESS_INIT:     3,
        PRESS:          4,
        PRESS_EXIT:     5,
        ACTIVATE:       6,
        ACTIVE:         7,
        ACTIVE_HOVER:   8,
        ACTIVE_PRESS:   9,
        DEACTIVATE:     10
    };

    ENUMS.TerrainFeature = {
        OCEAM:          0,
        SHORELINE:      1,
        STEEP_SLOPE:    2,
        SLOPE:          3,
        FLAT_GROUND:    4,
        WOODS:          5,
        AREA_SECTION:   6,
        SHALLOW_WATER:  7,
        DEEP_WATER:     8
    };


    ENUMS.InputState = {
        MOUSE_X:        0,
        MOUSE_Y:        1,
        WHEEL_DELTA:    2,
        START_DRAG_X:   3,
        START_DRAG_Y:   4,
        DRAG_DISTANCE_X:5,
        DRAG_DISTANCE_Y:6,
        ACTION_0:       7,
        ACTION_1:       8,
        LAST_ACTION_0:  9,
        LAST_ACTION_1:  10,
        PRESS_FRAMES:   11,
        VIEW_LEFT:      12,
        VIEW_WIDTH:     13,
        VIEW_TOP:       14,
        VIEW_HEIGHT:    15,
        ASPECT:         16,
        FRUSTUM_FACTOR: 17,
        BUFFER_SIZE:    18
    };

    ENUMS.PieceAlignments = {
        NEUTRAL:        0,
        GOOD:           1,
        EVIL:           2
    };

    ENUMS.PieceActivationStates = {
        RELEASE:        -2,
        INACTIVE:       -1,
        HIDDEN:         0,
        VISIBLE:        1,
        BRINKSMAN:      2,
        ACTIVE:         3,
        ENGAGED:        4
    };

    ENUMS.CombatStates = {
        NONE:           0,
        IDLE:           1,
        DISENGAGING:    2,
        DISENGAGED:     3,
        THREATENED:     4,
        ENGAGING:       5,
        ENGAGED:        6,
        DISABLED:       7,
        DESTROYED:      8,
        KILLED:         9,
        REMOVED:       10
    };

    ENUMS.Environment = {
        luminance:          0,
        turbidity:          1,
        rayleigh:           2,
        mieCoefficient:     3,
        mieDirectionalG:    4,
        inclination:        5,
        azimuth:            6,
        distance:           7,
        sunR:               8,
        sunB:               9,
        sunG:               10,
        moonR:              11,
        moon:               12,
        moonG:              13,
        ambientR:           14,
        ambientB:           15,
        ambientG:           16,
        fogR:               17,
        fogB:               18,
        fogG:               19,
        fogDensity:         20,
        sunPosX:            21,
        sunPosY:            22,
        sunPosZ:            23,
        sunQuatX:           24,
        sunQuatY:           25,
        sunQuatZ:           26,
        sunQuat:            27
    };

    ENUMS.Category = {
        POINTER_STATE:'POINTER_STATE',
        STATUS:'STATUS',
        LOAD_MODEL:'LOAD_MODEL',
        LOAD_MODULE:'LOAD_MODULE',
        LOAD_TERRAIN:'LOAD_TERRAIN',
        LOAD_CAMERA:'LOAD_CAMERA',
        LOAD_CONTROLS:'LOAD_CONTROLS',
        LOAD_PIECE:'LOAD_PIECE',
        LOAD_ACTOR:'LOAD_ACTOR',
        LOAD_ENVIRONMENT:'LOAD_ENVIRONMENT',
        LOAD_PARTICLES:'LOAD_PARTICLES',
        LOAD_LEVEL:'LOAD_LEVEL',
        LOAD_APP:'LOAD_APP',
        GUI_ELEMENT:'GUI_ELEMENT',
        setup:'setup'
    };

    ENUMS.Key = {
        WORLD_COM_BUFFER:'WORLD_COM_BUFFER',
        MON_VEGETATION:'MON_VEGETATION',
        DEBUG:'DEBUG',
        FULL_SCREEN:'FULL_SCREEN',
        MODEL_LOADER:'MODEL_LOADER',
        TERRAIN_LOADER:'TERRAIN_LOADER',
        MODULE_LOADER:'MODULE_LOADER',
        PIECE_LOADER:'PIECE_LOADER',
        CONTROL_LOADER:'CONTROL_LOADER',
        CAMERA_LOADER:'CAMERA_LOADER',
        ACTOR_LOADER:'ACTOR_LOADER',
        LEVEL_LOADER:'LEVEL_LOADER',
        APP_LOADER:'APP_LOADER',
        PARTICLE_LOADER:'PARTICLE_LOADER',
        ENV_LOADER:'ENV_LOADER',
        ADD:'ADD',
        REMOVE:'REMOVE'
    };

    ENUMS.InstantiableModels = {
        "creative_crate_geometry_effect":           0,
        "crate_wood_geometry_effect":               1,
        "model_geometry_tree_2_trunk_effect":       2,
        "model_geometry_wall_rock_50_effect":       3,
        "model_geometry_tree_3_combined_effect":    4,
        "model_geometry_tree_3_small_effect":       5,
        "model_geometry_enemy_oomba_effect":        6,
        "model_geometry_swivel_cannon_20mm_effect": 7
    };

    ENUMS.ColorCurve = {
        flatCyan    :   63,
        brightCyan  :   62,
        threatSixe  :   61,
        threatFive  :   60,
        threatFour  :   59,
        threatThree :   58,
        threatTwo   :   57,
        threatOne   :   56,
        threatZero  :   55,
        steadyOrange:   54,
        darkPurple:     53,
        darkBlue:       52,
        darkRed:        51,
        steadyPurple:   50,
        steadyBlue:     49,
        steadyRed:      48,
        dust:           47,
        earlyFadeOut:   46,
        lateFadeOut:    45,
        flashGrey:      44,
        brightYellow:   43,
        fullWhite:      42,
        greenToPurple:  41,
        blueYellowRed:  40,
        redToYellow:    39,
        qubeIn:         38,
        rootIn:         37,
        randomGreen:    36,
        randomRed:      35,
        randomYellow:   34,
        randomBlue:     33,
        rainbow:        32,
        warmToCold:     31,
        hotFire:        30,
        fire:           29,
        warmFire:       28,
        hotToCool:      27,
        orangeFire:     26,
        smoke:          25,
        dirt:           24,
        brightMix:      23,
        nearWhite:      22,
        darkSmoke:      21,
        nearBlack:      20,
        doubleSin:      19,
        halfSin:        18,
        sin:            17,
        sublteSin:      16,
        pulseSlowOut:   15,
        slowFadeIn:     14,
        halfQuickIn:    13,
        halfFadeIn:     12,
        smooth:         11,
        slowFadeOut:    10,
        dampen:         9,
        noiseFadeOut:   8,
        quickFadeOut:   7,
        quickIn:        6,
        quickInSlowOut: 5,
        zeroOneZero:    4,
        oneZeroOne:     3,
        zeroToOne:      2,
        oneToZero:      1
    };


    ENUMS.Channel = {
        client_state:'client_sta2te'
    };

    ENUMS.Gui = {
        rightPanel:'rightPanel',
        leftPanel:'leftPanel'
    };

    ENUMS.Type = {
        toggle:'toggle'
    };

    ENUMS.OptionKeys = {
        offset_x:'offset_x',
        offset_y:'offset_y',
        state_map:'state_map',
        row_y:'row_y',
        label_elemet_id:'label_elemet_id',
        offset_children:'offset_children',
        screen_pos:'screen_pos',
        gui_key:'gui_key'
    };

    ENUMS.ModuleParams = {
        attachment_points:'attachment_points',
        channels:'channels'
    };

    var map = {};

    for (var key in ENUMS) {
        map[key] = [];

        for (var i in ENUMS[key]) {
            map[key][ENUMS[key][i]] = i;
        }
    }

    ENUMS.Map = map;

    //  console.log("ENUMS", ENUMS);

})(ENUMS);
