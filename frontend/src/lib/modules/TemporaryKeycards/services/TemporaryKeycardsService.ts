import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "$lib/modules/Application";

class TemporaryKeycardsServiceClass {
    private async getApiUrl(): Promise<string> {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        if (configuration == null) throw new Error("[KeysService.getApiUrl] Empty configuration");

        return configuration.apiUrl;
    };

    public async commitContract(faceImage: string, documentImage: string) {
        return (await fetch(`${await this.getApiUrl()}/keycards/contract`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // omg
                faceImage,
                documentImage,
            }),
        })).json();
    }
};

export const TemporaryKeycardsService = new TemporaryKeycardsServiceClass();
