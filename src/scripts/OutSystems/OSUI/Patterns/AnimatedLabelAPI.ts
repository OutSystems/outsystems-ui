// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AnimatedLabelAPI {
	const _animatedLabelsMap = new Map<string, OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel>(); //animatedlabel.uniqueId -> AnimatedLabel obj

	/**
	 * Function that will change the property of a given animatedLabel.
	 *
	 * @param animatedLabelId ID of the AnimatedLabel where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(animatedLabelId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AnimatedLabel.FailChangeProperty,
			callback: () => {
				const animatedlabel = GetAnimatedLabelById(animatedLabelId);

				animatedlabel.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new AnimatedLabel instance and add it to the animatedLabelsMap
	 *
	 * @param animatedLabelId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the AnimatedLabel instance
	 */
	export function Create(
		animatedLabelId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel {
		if (_animatedLabelsMap.has(animatedLabelId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.AnimatedLabel} registered under id: ${animatedLabelId}`
			);
		}

		const _newAnimatedLabel = new OSFramework.OSUI.Patterns.AnimatedLabel.AnimatedLabel(
			animatedLabelId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_animatedLabelsMap.set(animatedLabelId, _newAnimatedLabel);

		return _newAnimatedLabel;
	}

	/**
	 * Function that will dispose the instance of the given AnimatedLabel
	 *
	 * @param animatedLabelId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(animatedLabelId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AnimatedLabel.FailDispose,
			callback: () => {
				const animatedlabel = GetAnimatedLabelById(animatedLabelId);

				animatedlabel.dispose();

				_animatedLabelsMap.delete(animatedlabel.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Animatedlabels instances at the page
	 *
	 * @returns the ids of every AnimatedLabel instance
	 */
	export function GetAllAnimatedLabels(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_animatedLabelsMap);
	}

	/**
	 * Function that gets the instance of AnimatedLabel, by a given ID.
	 *
	 * @param animatedLabelId ID of the AnimatedLabel that will be looked for.
	 * @returns the AnimatedLabel instance
	 */
	export function GetAnimatedLabelById(
		animatedLabelId: string
	): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.AnimatedLabel,
			animatedLabelId,
			_animatedLabelsMap
		) as OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param animatedLabelId ID of the Animatedlabel that will be initialized.
	 * @returns the AnimatedLabel instance
	 */
	export function Initialize(animatedLabelId: string): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.build();

		return animatedlabel;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param dropdownId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AnimatedLabel.FailRegisterCallback,
			callback: () => {
				const animatedlabel = this.GetAnimatedLabelById(dropdownId);

				animatedlabel.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will update the Label text according text has been changed inside the input
	 *
	 * @param animatedLabelId ID of the Animatedlabel that will be updated.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateOnRender(animatedLabelId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AnimatedLabel.FailUpdate,
			callback: () => {
				const animatedlabel = GetAnimatedLabelById(animatedLabelId);

				animatedlabel.updateOnRender();
			},
		});

		return result;
	}
}
