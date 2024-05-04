// keys-related
export enum ApplicationStateEnum {
    IDLE = 'idle',

    // TYPE: "keys"
    // Stage 0: Processing card
    PROCESSING_CARD = 'processing_card',

    // Stage 1: User scans his card and picks keys he want
    PICKING = 'picking',

    // TYPE: ""
};

// export type ApplicationState = ApplicationStateEnum;
