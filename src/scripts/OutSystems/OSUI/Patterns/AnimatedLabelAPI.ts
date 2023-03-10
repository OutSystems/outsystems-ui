// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AnimatedLabelAPI {
	const _animatedLabelsMap = new Map<string, OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel>(); //animatedlabel.uniqueId -> AnimatedLabel obj

	/**
	 * Function that will change the property of a given animatedLabel.
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the AnimatedLabel where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {unknown} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} animatedLabelId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel}
	 */
	export function Create(
		animatedLabelId: string,
		configs: string
	): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel {
		if (_animatedLabelsMap.has(animatedLabelId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.AnimatedLabel} registered under id: ${animatedLabelId}`
			);
		}

		const _newAnimatedLabel = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			OSFramework.OSUI.GlobalEnum.PatternName.AnimatedLabel,
			animatedLabelId,
			JSON.parse(configs)
		) as OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;

		_animatedLabelsMap.set(animatedLabelId, _newAnimatedLabel);

		return _newAnimatedLabel;
	}

	/**
	 * Function that will dispose the instance of the given AnimatedLabel
	 *
	 * @export
	 * @param {string} animatedLabelId
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel>}
	 */
	export function GetAllAnimatedLabels(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_animatedLabelsMap);
	}

	/**
	 * Function that gets the instance of AnimatedLabel, by a given ID.
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the AnimatedLabel that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;}
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
	 * @export
	 * @param {string} animatedLabelId ID of the Animatedlabel that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel}
	 */
	export function Initialize(animatedLabelId: string): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.build();

		return animatedlabel;
	}

	/**
	 * Fucntion that will update the Label text according text has been changed inside the input
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the Animatedlabel that will be updated.
	 * @return {*}  {OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel}
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
