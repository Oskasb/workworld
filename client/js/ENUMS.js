
if(typeof(ENUMS) === "undefined"){
    ENUMS = {};
}

(function(ENUMS){


    ENUMS.Protocol = {
        WAKE_INDEX:             0,
        WORKER_READY:           1,
        SET_LOOP:               2,
        NOTIFY_FRAME:           3,
        SET_INPUT_BUFFER:       4,
        SET_WORLD_COM_BUFFER:   5,
        CREATE_WORLD:           6,
        REGISTER_TERRAIN:       7,
        FETCH_PIPELINE_DATA:    8,
        SEND_PIPELINE_DATA:     9,
        GENERATE_STATIC_AREA:   10,
        STATIC_AREA_DATA:       11,
        REQUEST_SHARED_WORKER:  12,
        SHARED_WORKER_PORT:     13,
        PHYSICS_TERRAIN_ADD:    14,
        PHYSICS_BODY_ADD:       15,
        PHYSICS_CALL_UPDATE:    16,
        FETCH_GEOMETRY_BUFFER:  17,
        SET_GEOMETRY_BUFFER:    18,
        REGISTER_GEOMETRY:      19,
        FETCH_CONFIG_DATA:      20,
        SET_CONFIG_DATA:        21,
        CANVAS_DYNAMIC_ADD:     22,
        CANVAS_CALL_UPDATE:     23,
        REGISTER_CANVAS_BUFFER: 24,
        OFFSCREEN_CANVAS:       25
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
        CAM_ASPECT:         30,
        PHYSICS_LOAD:       31,
        DYNAMIC_COUNT:      32,
        BODIES_ACTIVE:      33,
        BODIES_PASSIVE:     34,
        BODIES_STATIC:      35,
        BODIES_TERRAIN:     36,
        STEP_TIME:          37,
        FRAME_IDLE:         38,
        SKIP_FRAMES:        39,
        FRAME_TIME:         40,
        PHYS_ERRORS:        41,
        SPAWM_BOX_RAIN:     42,
        PUSH_ALL_DYNAMICS:  43,
        ATTRACT_DYNAMICS:   44,
        REPEL_DYNAMICS:     45,
        ENV_INDEX:          46,
        UI_NAVIGATION_TOP:  47,
        WORLD_ACTION_1:     48,
        WORLD_ACTION_2:     49,
        WORLD_ACTION_3:     50,
        UI_NAVIGATION_DEV:  51,
        DEV_ACTION_1:       52,
        DEV_ACTION_2:       53,
        DEV_ACTION_3:       54,

        UI_HOVER_SOURCE:    55,
        UI_PRESS_SOURCE:    56,

        UI_CAM_DRAG_X:      57,
        UI_CAM_DRAG_Y:      58,
        UI_CAM_DRAG_Z:      59,

        UI_CURSOR_DRAG_X:   60,
        UI_CURSOR_DRAG_Y:   61,
        UI_CURSOR_DRAG_Z:   62,

        DYNAMIC_HOVER:      63,
        HOVER_DYNAIMC_X:    64,
        HOVER_DYNAIMC_Y:    65,
        SELECT_PROGRESS:    66,
        EVENT_PROGRESS:     67,
        DRAW_DYN_SHAPES:    68,
        DRAW_SHAPE_FORCES:  69,
        DRAW_ATTACHMENTS:   70,
        DRAW_AERODYNAMICS:  71,
        CONTROLLED_POINTER: 72

    };

    ENUMS.BufferTypes = {
        ENVIRONMENT:        0,
        CAMERA:             1,
        SPATIAL:            2,
        TERRAIN:            3
    };

    ENUMS.BufferSpatial = {
        DYNAMIC:            0,
        SIMULATE:           1,
        POS_X:              2,
        POS_Y:              3,
        POS_Z:              4,
        QUAT_X:             5,
        QUAT_Y:             6,
        QUAT_Z:             7,
        QUAT_W:             8,
        FORCE_X:            9,
        FORCE_Y:            10,
        FORCE_Z:            11,
        TORQUE_X:           12,
        TORQUE_Y:           13,
        TORQUE_Z:           14,
        VELOCITY_X:         15,
        VELOCITY_Y:         16,
        VELOCITY_Z:         17,
        ANGULAR_VEL_X:      18,
        ANGULAR_VEL_Y:      19,
        ANGULAR_VEL_Z:      20,
        SCALE_X:            21,
        SCALE_Y:            22,
        SCALE_Z:            23,
        BODY_POINTER:       24,
        BODY_IS_DISABLED:   25,
        BODY_MASS:          26,
        STILL_FRAMES:       27,
        FORCE_APPLIED_X:    28,
        FORCE_APPLIED_Y:    29,
        FORCE_APPLIED_Z:    30,
        TORQUE_APPLIED_X:   31,
        TORQUE_APPLIED_Y:   32,
        TORQUE_APPLIED_Z:   33,
        ACCELERATION_X:     34,
        ACCELERATION_Y:     35,
        ACCELERATION_Z:     36,
        ANGULAR_ACCEL_X:    37,
        ANGULAR_ACCEL_Y:    38,
        ANGULAR_ACCEL_Z:    39,
        VISUAL_SIZE:        40,
        ANGLE_OF_ATTACK_X:  41,
        ANGLE_OF_ATTACK_Y:  42,
        ANGLE_OF_ATTACK_Z:  43,
        ROLL_ANGLE:         44,
        PITCH_ANGLE:        45,
        YAW_ANGLE:          46,
        SPEED_MPS:          47,
        DIRECTION_X:        48,
        DIRECTION_Y:        49,
        DIRECTION_Z:        50,
        PLAYER_CONTROL:     51,
        HORIZON_ATTITUDE:   52,
        ORIGINAL_QUAT_X:    53,
        ORIGINAL_QUAT_Y:    54,
        ORIGINAL_QUAT_Z:    55,
        ORIGINAL_QUAT_W:    56,
        COMPASS_ATTITUDE:   57,
        ROLL_ATTITUDE:      58,
        FRAME_COUNT:        59,

        ACCEL_SLIP:         60,
        ACCEL_G:            61,
        ACCEL_VEL:          62,
        VEL_MACH:           63,

        DYNAMIC_FIRST_INDEX:64,


        BONE_FIRST_INDEX:   2096,
        LIGHT_FIRST_INDEX:  3500,
        BUFFER_SIZE:        4096
    };

    ENUMS.DynamicShape = {
        NEED_ME:            0,
        HAS_FORCE:          1,
        OFFSET_X:           2,
        OFFSET_Y:           3,
        OFFSET_Z:           4,
        FORCE_APPLIED_X:    5,
        FORCE_APPLIED_Y:    6,
        FORCE_APPLIED_Z:    7,
        QUAT_X:             8,
        QUAT_Y:             9,
        QUAT_Z:             10,
        QUAT_W:             11,
        ACTING_FORCE_X:     12,
        ACTING_FORCE_Y:     13,
        ACTING_FORCE_Z:     14,
        INCIDENCE_X:        15,
        INCIDENCE_Y:        16,
        INCIDENCE_Z:        17,
        LIFT_FORCE:         18,
        DRAG_FORCE:         19,
        UPDATE_FRAME:       20,
        STRIDE:             21
    };

    ENUMS.DynamicBone = {
        BONE_INDEX:         0,
        HAS_UPDATE:         1,
        POS_X:              2,
        POS_Y:              3,
        POS_Z:              4,
        QUAT_X:             5,
        QUAT_Y:             6,
        QUAT_Z:             7,
        QUAT_W:             8,
        QUAT_UDATE:         9,
        SCALE_X:            10,
        SCALE_Y:            11,
        SCALE_Z:            12,
        SCALE_UDATE:        13,
        POS_UDATE:          14,
        STRIDE:             15
    };

    ENUMS.DynamicLight = {
        LIGHT_INDEX:        0,
        HAS_UPDATE:         1,
        LIGHT_INTENSITY:    2,
        STRIDE:             3
    };

    ENUMS.Worker = {
        WORLD:              0,
        STATIC_WORLD:       1,
        PHYSICS_WORLD:      2,
        CANVAS_WORKER:      3,
        DATA:               4
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

    ENUMS.Environments = {
        PRE_DAWN:       1,
        DAWN:           2,
        MORNING:        3,
        SUNNY_DAY:      4,
        HIGH_NOON:      5,
        EVENING:        6,
        NIGHT:          7
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

        whiteToGrey:   104,
        greyToWhite:   103,
        cyan_1:        102,
        cyan_2:        101,
        cyan_3:        100,
        cyan_4:         99,
        cyan_5:         98,
        yellow_1:       97,
        yellow_2:       96,
        yellow_3:       95,
        yellow_4:       94,
        yellow_5:       93,
        purple_1:       92,
        purple_2:       91,
        purple_3:       90,
        purple_4:       89,
        purple_5:       88,
        orange_1:       87,
        orange_2:       86,
        orange_3:       85,
        orange_4:       84,
        orange_5:       83,
        blue_1:         82,
        blue_2:         81,
        blue_3:         80,
        blue_4:         79,
        blue_5:         88,
        green_1:        77,
        green_2:        76,
        green_3:        75,
        green_4:        74,
        green_5:        73,
        red_1:          72,
        red_2:          71,
        red_3:          70,
        red_4:          69,
        red_5:          68,
        alpha_20:       67,
        alpha_40:       66,
        alpha_60:       65,
        alpha_80:       64,

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

    ENUMS.Layout = {
        x_min:'x_min',
        x_max:'x_max',
        y_min:'y_min',
        y_max:'y_max',

        anchor:'anchor',
        top_left:'top_left',
        top_right:'top_right',
        bottom_left:'bottom_left',
        bottom_right:'bottom_right',
        center:'center',
        fixed_aspect:'fixed_aspect',
        width:'width',
        height:'height',
        margin_x:'margin_x',
        margin_y:'margin_y'
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

    ENUMS.getKey = function(category, index) {
        return ENUMS.Map[category][index];
    }

    //  console.log("ENUMS", ENUMS);

})(ENUMS);
