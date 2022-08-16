/* 
* Pattern Info
**/
const patternInfo = {
    "codeName": "RangeSlider",
    "scss": "../scripts/OSFramework/Pattern/RangeSlider/scss/range-slider",
    "section": "Interaction",

    "assets": [
        {
            "codeName": "SliderSingle",
            "inDevelopment": false,
            "name": "Slider Single",
            "provider": {
                "name": "NoUISlider",
                "version": "v15.5.1"
            }
        },
        
        {
            "codeName": "SliderInterval",
            "inDevelopment": false,
            "name": "Slider Interval",
            "provider": {
                "name": "NoUISlider",
                "version": "v15.5.1"
            }
        }
    ]
};

// Expose patterns info!
exports.info = patternInfo;