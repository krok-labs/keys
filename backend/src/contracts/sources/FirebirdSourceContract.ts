export abstract class FirebirdSourceContract {
    abstract resolveNameFromKeycard(keycardId: number): Promise<String>;
};
