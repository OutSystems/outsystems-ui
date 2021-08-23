// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AnimatedLabelAPI {
	const _animatedLabelsMap = new Map<string, OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel>(); //animatedlabel.uniqueId -> AnimatedLabel obj

	/**
	 * Function that will change the property of a given animatedLabel.
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the AnimatedLabel where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(animatedLabelId: string, propertyName: string, propertyValue: any): void {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new AnimatedLabel instance and add it to the animatedLabelsMap
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel}
	 */
	export function Create(
		animatedLabelId: string,
		configs: string
	): OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel {
		if (_animatedLabelsMap.has(animatedLabelId)) {
			throw new Error(`There is already an AnimatedLabel registered under id: ${animatedLabelId}`);
		}

		const _newAnimatedLabel = new OSUIFramework.Patterns.AnimatedLabel.AnimatedLabel(
			animatedLabelId,
			JSON.parse(configs)
		);

		_animatedLabelsMap.set(animatedLabelId, _newAnimatedLabel);

		return _newAnimatedLabel;
	}

	/**
	 * Function that will dispose the instance of the given AnimatedLabel
	 *
	 * @export
	 * @param {string} animatedLabelId
	 */
	export function Dispose(animatedLabelId: string): void {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.dispose();

		_animatedLabelsMap.delete(animatedlabel.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Animatedlabels instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel>}
	 */
	export function GetAllAnimatedLabelsMap(): Map<string, OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel> {
		return _animatedLabelsMap;
	}

	/**
	 * Function that gets the instance of AnimatedLabel, by a given ID.
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the AnimatedLabel that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel;}
	 */
	export function GetAnimatedLabelById(animatedLabelId: string): OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel {
		let animatedlabel: OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel;

		//animatedLabelId is the UniqueId
		if (_animatedLabelsMap.has(animatedLabelId)) {
			animatedlabel = _animatedLabelsMap.get(animatedLabelId);
		} else {
			//Search for animatedLabelId
			for (const p of _animatedLabelsMap.values()) {
				if (p.equalsToID(animatedLabelId)) {
					animatedlabel = p;
					break;
				}
			}
		}

		if (animatedlabel === undefined) {
			throw new Error(`AnimatedLabel id:${animatedLabelId} not found`);
		}

		return animatedlabel;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the Animatedlabel that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel}
	 */
	export function Initialize(animatedLabelId: string): OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.build();

		return animatedlabel;
	}

	/**
	 * Fucntion that will update the Label text according text has been changed inside the input
	 *
	 * @export
	 * @param {string} animatedLabelId ID of the Animatedlabel that will be updated.
	 * @return {*}  {OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel}
	 */
	export function UpdateOnRender(animatedLabelId: string): OSUIFramework.Patterns.AnimatedLabel.IAnimatedLabel {
		const animatedlabel = GetAnimatedLabelById(animatedLabelId);

		animatedlabel.updateOnRender();

		return animatedlabel;
	}
}
