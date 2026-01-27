// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.Lang {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export class LangObserver extends AbstractMutationObserver {
        private _currentLang: string;

        constructor() {
            super(new LangObserverConfigs(), document.documentElement);
            this._currentLang = document.documentElement.lang;
        }

        /**
         * Observer callback method
         *
         * @param {MutationRecord[]} mutationList
         * @memberof LangObserver
         */
        public observerHandler(mutationList: MutationRecord[]): void {
            mutationList.forEach((mutation) => {
                if (mutation.attributeName === GlobalEnum.HTMLAttributes.Lang) {
                    const mutationTarget = mutation.target as HTMLElement;
                    const newLang = mutationTarget.lang;

                    if (this._currentLang !== newLang) {
                        this._currentLang = newLang;
                        
                        this.trigger(Observers.ObserverEvent.Language, mutation);
                    }
                }
            });
        }
    }
}