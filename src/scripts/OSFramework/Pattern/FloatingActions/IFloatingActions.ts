// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.FloatingActions {
	/**
	 * Defines the interface for OutSystemsUI Floating Actions Pattern
	 */
	export interface IFloatingActions extends Interface.IPattern, Interface.ICallback, Interface.IOpenable {
		addFloatingActionItem(uniqueId: string, floatingActionItem: FloatingActionsItem.IFloatingActionsItem);
		removeFloatingActionItem(uniqueId: string);
	}
}
