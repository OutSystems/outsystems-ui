// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.GlobalCallbacks {
	//This type, enable us to mention a generic function that will be use.
	//Receiving any number of parameters and having as output of an unknown type.
	//This will allow us in the future not use "any" as a type of an function callback.
	export type Generic = { (...args: unknown[]): unknown };

	//This type is used to define callbacks that will be actions in OutSystems code side.
	export type OSGeneric = { (patternId: string, ...args: unknown[]): void };
}
