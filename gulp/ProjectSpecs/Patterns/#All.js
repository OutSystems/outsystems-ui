// Get the reference file for each pattern
const accordion = require('./Accordion');
const accordionItem = require('./AccordionItem');
const animatedLabel = require('./AnimatedLabel');
const balloon = require('./Balloon');
const bottomSheet = require('./BottomSheet');
const buttonLoading = require('./ButtonLoading');
const carousel = require('./Carousel');
const datePicker = require('./DatePicker');
const dropdown = require('./Dropdown');
const dropdownServerSide = require('./DropdownServerSide');
const dropdownServerSideItem = require('./DropdownServerSideItem');
const flipContent = require('./FlipContent');
const gallery = require('./Gallery');
const monthPicker = require('./MonthPicker');
const notification = require('./Notification');
const overflowMenu = require('./OverflowMenu');
const progress = require('./Progress');
const rangeSlider = require('./RangeSlider');
const rating = require('./Rating');
const sectionIndex = require('./SectionIndex');
const sectionIndexItem = require('./SectionIndexItem');
const sidebar = require('./Sidebar');
const submenu = require('./Submenu');
const swipeEvents = require('./SwipeEvents');
const tabs = require('./Tabs');
const tabsContentItem = require('./TabsContentItem');
const tabsHeaderItem = require('./TabsHeaderItem');
const timePicker = require('./TimePicker');
const tooltip = require('./Tooltip');
const touchEvents = require('./TouchEvents');
const video = require('./Video');

/* 
* List of all patterns in OSFramework.OSUI.Patterns.*
*
* - "codeName": The used name in patterns folder and for the API file where 'API' will be concatenated to the name.
* - "inDevelopment": If true pattern will not be deployed into production mode.
* - "name": The pattern name which will be used to name in the comments context (eg: css structure).
* - "scss": The scss partial file path.
*
* For patterns with provider, structure can be slighly different in order to accomudate it's differences!
**/
const patterns = {
	"accordion-item": accordionItem.info,
	"accordion": accordion.info,
	"animated-label": animatedLabel.info,
	"balloon": balloon.info,	
	"bottom-sheet": bottomSheet.info,	
	"button-loading": buttonLoading.info,
	"carousel": carousel.info,
	"datepicker": datePicker.info,
	"dropdown-serverside": dropdownServerSide.info,	
	"dropdown-serverside-item": dropdownServerSideItem.info,	
	"dropdown": dropdown.info,
	"flip-content": flipContent.info,	
	"gallery": gallery.info,
	"monthpicker": monthPicker.info,
	"notification": notification.info,
	"overflowMenu": overflowMenu.info,
	"progress": progress.info,
	"range-slider": rangeSlider.info,
	"rating": rating.info,
	"section-index-item": sectionIndexItem.info,
	"section-index": sectionIndex.info,
	"sidebar": sidebar.info,
	"submenu": submenu.info,
	"swipe-events": swipeEvents.info,
	"tabs-content-item": tabsContentItem.info,
	"tabs-header-item": tabsHeaderItem.info,
	"tabs": tabs.info,
	"timepicker": timePicker.info,
	"tooltip": tooltip.info,
	"touch-events": touchEvents.info,
	"video": video.info,

};

// Expose all patterns list!
exports.all = patterns;