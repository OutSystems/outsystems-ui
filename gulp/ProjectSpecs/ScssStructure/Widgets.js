const project = require('../DefaultSpecs');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Widgets",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "Inputs and TextAreas",
            "path": "03-widgets/inputs-and-textareas"
        },
        {
            "name": "Switch",
            "path": "03-widgets/switch"
        },
        {
            "name": "Checkbox",
            "path": "03-widgets/checkbox"
        },
        {
            "name": "Dropdown",
            "path": "03-widgets/dropdown"
        },
        {
            "name": "Button",
            "path": "03-widgets/btn"
        },
        {
            "name": "List",
            "path": "03-widgets/list"
        },
        {
            "name": "List Item",
            "path": "03-widgets/list-item"
        },
        {
            "name": "Table",
            "path": "03-widgets/table"
        },
        {
            "name": "Table - Sortable Icon",
            "path": "03-widgets/table-sortable-icon"
        },
        {
            "name": "Table - Bulk Actions",
            "path": "03-widgets/bulk-actions"
        },
        {
            "name": "Form",
            "path": "03-widgets/form"
        },
        {
            "name": "Upload",
            "path": "03-widgets/upload"
        },
        {
            "name": "Button Group",
            "path": "03-widgets/button-group"
        },
        {
            "name": "Popover",
            "path": "03-widgets/popover"
        },
        {
            "name": "Popover - ODC",
            "path": "03-widgets/popover-odc",
            "platform": project.globalConsts.platformTarget.odc,
        },
        {
            "name": "Popup",
            "path": "03-widgets/popup"
        },
        {
            "name": "Feedback Message",
            "path": "03-widgets/feedback-message"
        },
        {
            "name": "Radio Button",
            "path": "03-widgets/radio-button"
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;