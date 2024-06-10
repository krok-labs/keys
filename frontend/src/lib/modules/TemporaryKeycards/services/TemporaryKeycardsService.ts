import { getStore } from "$lib/helpers";
import { ApplicationConfigurationStore } from "$lib/modules/Application";

class TemporaryKeycardsServiceClass {
    private async getApiUrl(): Promise<string> {
        const configuration = await getStore(ApplicationConfigurationStore.subscribe);
        if (configuration == null) throw new Error("[KeysService.getApiUrl] Empty configuration");

        return configuration.apiUrl;
    };

    public async base64ToBlob(image: string): Promise<Blob> {
        return new Promise((resolve) => {
            fetch(image)
                .then((res) => res.blob())
                .then(blob => {
                    resolve(blob);
                    return;
                });
        });
    };

    public async commitContract(faceImage: string, documentImage: string, form: { firstname: string, surname: string, middlename: string, cardNumber: string }) {
        const formData = new FormData();

        formData.append("faceImage", new File([await this.base64ToBlob(faceImage)], "faceImage.jpeg"));
        formData.append("documentImage", new File([await this.base64ToBlob(documentImage)], "documentImage.jpeg"));

        formData.append("firstname", form.firstname);
        formData.append("surname", form.surname);
        formData.append("middlename", form.middlename);
        formData.append("cardNumber", form.cardNumber);

        return (await fetch(`${await this.getApiUrl()}/keycards/contract`, {
            method: 'POST',
            // headers: {
            //     "Content-Type": "multipart/form-data",
            // },
            body: formData,
        })).json();
    }
};

export const TemporaryKeycardsService = new TemporaryKeycardsServiceClass();
