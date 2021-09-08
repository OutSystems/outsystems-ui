// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function GetDevice(): any {
		const classList = document.body.classList;
		let device: string;

		if (classList.contains(OSUIFramework.GlobalEnum.Devices.Phone)) {
			device = OSUIFramework.GlobalEnum.Devices.Phone;
		} else if (classList.contains(OSUIFramework.GlobalEnum.Devices.Tablet)) {
			device = OSUIFramework.GlobalEnum.Devices.Tablet;
		} else {
			device = OSUIFramework.GlobalEnum.Devices.Desktop;
		}

		return device;
	}
}
