import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "$lib/modules/Application";

class TemporaryKeycardsServiceClass {
    private async getApiUrl(): Promise<string> {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        if (configuration == null) throw new Error("[KeysService.getApiUrl] Empty configuration");

        return configuration.apiUrl;
    };

    public async commitContract(faceImage: string, documentImage: string) {
        const formData = new FormData();
        formData.append("faceImage", faceImage);
        formData.append("documentImage", documentImage);

        return (await fetch(`${await this.getApiUrl()}/keycards/contract`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: formData,
        })).json();
    }
};

export const TemporaryKeycardsService = new TemporaryKeycardsServiceClass();
