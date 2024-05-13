import { AbstractSharedStore, getStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { type KeycardWizardStep } from "../types";
import { KeycardWizardStepsArray } from "../configuration";

export interface KeycardWizardInterface {
    steps: KeycardWizardStep[],
    currentStepId: number,

    isNextStepAvailable: boolean,

    currentImage?: string,
    documentsImage?: string,
    faceImage?: string,
};

// todo: make new abstract class named Wizard
//       and move all abstract logic to separate Wizard module
class KeycardWizardStoreClass extends AbstractSharedStore<KeycardWizardInterface> {
    public subscribe;
    protected update;

    protected readonly storeId = "keycard_wizard";
    
    // Wizard inputs
    protected documentsImage?: string;
    protected faceImage?: string;
    protected currentImage?: string;
    
    constructor() {
        super();

        const { subscribe, update } = writable<KeycardWizardInterface>({
            currentStepId: 0,
            steps: KeycardWizardStepsArray,
            isNextStepAvailable: false,
        });
    
        this.subscribe = subscribe;
        this.update = update;
    }

    public clear() {
        this.update(() => ({
            currentStepId: 0,
            steps: KeycardWizardStepsArray,
            isNextStepAvailable: false,
        }));
        this.syncUpdates();
    };

    // Events
    public async onFinish() {
        console.log('on finish');
    };

    // Handle Scanned Image
    public async handleScannedImage(payload: string): Promise<void> {
        // Getting current step
        const step = await this.getCurrentStep();
        // todo: error
        if (step == null) return;

        switch (step.id) {
            // Scan Face Step
            case 0:
                this.setImage({ currentImage: payload, faceImage: payload });
                this.setIsNextStateAvailable(true);
                break;

            // Scan Documents Step
            case 1:
                this.setImage({ currentImage: payload, documentsImage: payload });
                this.setIsNextStateAvailable(true);
                break;

            case 2:
                // todo: error?
                break;
        }
    };

    public async redoImage() {
        this.setImage({ currentImage: undefined });
        this.setIsNextStateAvailable(false);
    };

    public async nextStep() {
        const store = await getStore(this.subscribe);

        if (store.currentStepId >= store.steps.length - 1) {
            await this.onFinish();
        } else {
            this.setIsNextStateAvailable(false);
            this.setImage({ currentImage: undefined });

            // Moving to next step
            this.update((store) => {
                return {
                    ...store,
                    currentStepId: store.currentStepId + 1,
                    
                    // step2-only
                    ...(store.currentStepId + 1) == 2 ? { isNextStepAvailable: true } : {}
                };
            });
        };
    };

    private setImage(opts: { currentImage?: string, documentsImage?: string, faceImage?: string }) {
        this.update((store) => {
            return {
                ...store,
                ...opts,
            };
        });

        this.syncUpdates();
    };

    private setIsNextStateAvailable(isAvailable: boolean) {
        this.update((store) => {
            return {
                ...store,
                isNextStepAvailable: isAvailable
            };
        });

        this.syncUpdates();
    };

    private async getCurrentStep() {
        const store = await getStore(this.subscribe);
        return store.steps.find((x) => x.id == store.currentStepId);
    }

    private async getStepById(id: number) {
        const store = await getStore(this.subscribe);
        return store.steps.find((x) => x.id == id);
    }
};

export const KeycardWizardStore = new KeycardWizardStoreClass();
