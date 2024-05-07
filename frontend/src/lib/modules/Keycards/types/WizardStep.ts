import type { WizardInputType } from "./input";

export interface KeycardWizardStep {
    id: number,
    inputType?: WizardInputType,

    // Visual information
    title: string,
    content: string,
};
