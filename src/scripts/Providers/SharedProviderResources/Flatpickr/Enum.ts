// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.SharedProviderResources.Flatpickr.Enum {
	// Flatpickr provider info
	export enum ProviderInfo {
		Name = 'Flatpickr',
		Version = '4.6.13',
	}

	/**
	 * OutSystemsUI patterns exception
	 * Note: Can be used for exception purposes
	 */
	export enum PickersException {
		BottomSheet = 'osui-bottom-sheet',
		Notification = 'osui-notification',
		Popup = 'popup-backdrop',
		Sidebar = 'osui-sidebar',
		Zindex = 'osui-increase-zindex',
	}

	/**
	 * OutSystemsUI patterns exception
	 * Note: Can be used for exception purposes
	 */
	export enum PatternNameException {
		BottomSheet = 'bottomsheet',
		Notification = 'notification',
		Popup = 'popup',
		Sidebar = 'sidebar',
	}

	/**
	 * Flatpickr z-index variable
	 */
	export enum CSSVariables {
		FlatpickrOpenZindex = '--flatpickr-open-zindex',
	}
}
