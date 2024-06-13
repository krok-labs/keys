import { AbstractSharedStore, getStore } from "$lib/helpers";
import { writable } from "svelte/store";
import { type KeycardWizardStep } from "../types";
import { KeycardWizardStepsArray } from "../configuration";
import { ApplicationStateStore } from "$lib/modules/Application";
import { TemporaryKeycardsService } from "$lib/modules/TemporaryKeycards";
import { StreamingStore } from "$lib/modules/Streaming";
import type { Moment } from "moment";

export interface KeycardWizardInterface {
    steps: KeycardWizardStep[],
    currentStepId: number,

    isNextStepAvailable: boolean,

    // Form data
    form: {
        firstname?: string,
        surname?: string,
        middlename?: string,

        // todo: number
        cardNumber?: string,
        expiresAt?: Moment,
    },

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
    
    constructor() {
        super();

        const { subscribe, update } = writable<KeycardWizardInterface>({
            currentStepId: 0,
            steps: KeycardWizardStepsArray,
            isNextStepAvailable: false,
            form: {},
        });
    
        this.subscribe = subscribe;
        this.update = update;
    }

    public runAfterDispose(): void {
        StreamingStore.stop();
    }

    public clear() {
        this.update(() => ({
            currentStepId: 0,
            steps: KeycardWizardStepsArray,
            isNextStepAvailable: false,
            form: {},
        }));
        this.syncUpdates();
    };

    // Events
    public async onFinish() {
        const store = await getStore(this.subscribe);

        // Sending this images to backend

        // urgh
        // @ts-ignore
        await TemporaryKeycardsService.commitContract(store.faceImage!, store.documentsImage!, store.form);

        ApplicationStateStore.changeApplication('dashboard');
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
                // First step (document scanner)
                if (store.currentStepId + 1 == 1) {
                    StreamingStore.start('document_scanner');
                }

                if (store.currentStepId + 1 == 2) {
                    StreamingStore.stop();
                }

                return {
                    ...store,
                    currentStepId: store.currentStepId + 1,
                    
                    // step3-only
                    ...(store.currentStepId + 1) == 3 ? { isNextStepAvailable: true } : {}
                };
            });

            this.syncUpdates();
        };
    };

    public async setFormProperty(property: keyof KeycardWizardInterface["form"], value: string | undefined) {
        this.update((obj) => {
            return {
                ...obj,
                form: {
                    ...obj.form,
                    [property]: value
                }
            }
        });
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

    public setIsNextStateAvailable(isAvailable: boolean) {
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
