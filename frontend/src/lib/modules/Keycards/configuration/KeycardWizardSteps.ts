import { WizardInputType, type KeycardWizardStep } from "../types";

export const KeycardWizardStepsArray: KeycardWizardStep[] = [
    {
        id: 0,
        inputType: WizardInputType.IMAGE,
        title: "Фотографія обличчя",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum expedita, nostrum consequatur temporibus quibusdam minima quis nihil eveniet tempora praesentium.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo provident cum voluptatibus explicabo totam laudantium commodi maxime eius excepturi? Ipsa repudiandae rerum debitis, libero magni asperiores ullam eos eum distinctio?<br/><br/>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae, magnam?",
    },
    {
        id: 1,
        inputType: WizardInputType.IMAGE,
        title: "Фотографія документів",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum expedita, nostrum consequatur temporibus quibusdam minima quis nihil eveniet tempora praesentium.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo provident cum voluptatibus explicabo totam laudantium commodi maxime eius excepturi? Ipsa repudiandae rerum debitis, libero magni asperiores ullam eos eum distinctio?<br/><br/>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae, magnam?",
    },
    {
        id: 2,
        title: "Видача перепустки",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum expedita, nostrum consequatur temporibus quibusdam minima quis nihil eveniet tempora praesentium.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo provident cum voluptatibus explicabo totam laudantium commodi maxime eius excepturi? Ipsa repudiandae rerum debitis, libero magni asperiores ullam eos eum distinctio?<br/><br/>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae, magnam?",
    }
];
