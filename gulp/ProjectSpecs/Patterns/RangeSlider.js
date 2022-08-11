/* 
* Pattern Info
**/
const patternInfo = {
    "code-name": "RangeSlider",
    "scss": "../scripts/OSFramework/Pattern/RangeSlider/scss/range-slider",
    "section": "Interaction",

    "single": {
        "code-name": "SliderSingle",
        "in-development": false,
        "name": "Slider Single",
        "provider": {
            "name": "NoUISlider",
            "version": "v15.5.1"
        }
    },

    "interval": {
        "code-name": "SliderInterval",
        "in-development": false,
        "name": "Slider Interval",
        "provider": {
            "name": "NoUISlider",
            "version": "v15.5.1"
        }
    }
};

// Expose patterns info!
exports.info = patternInfo;