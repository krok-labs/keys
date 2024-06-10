import { WizardInputType, type KeycardWizardStep } from "../types";

export const KeycardWizardStepsArray: KeycardWizardStep[] = [
    {
        id: 0,
        inputType: WizardInputType.IMAGE,
        title: "Фотографія обличчя",
        content: "Нам потрібна фотографія Вашого обличчя. Тому, будь ласка, встаньте прямо, дивлячись на камеру на єкрані, та слухайте уважно, що Вам говорять охоронці.<br /><br />Після фотографії обличчя ми зробимо фотографію Ваших документів та видамо Вам тимчасову перепустку!",
    },
    {
        id: 1,
        inputType: WizardInputType.IMAGE,
        title: "Фотографія документів",
        content: "Передайте охоронцям Ваш ідентифікаційний документ <i>(паспорт, водійське посвідчення та побідне)</i>. Ми зробимо його фотографію, збережемо в захищенній базі данних та видамо Вам нову тимчасову перепустку.",
    },
    {
        id: 2,
        inputType: WizardInputType.FORM,
        title: "Заповнення інформації",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto error tempore, veniam ab iure quidem eaque harum non quis reiciendis quo laboriosam vero recusandae delectus repellendus impedit eos soluta nihil.",
    },
    {
        id: 3,
        title: "Видача перепустки",
        content: "Будь ласка, перевірьте правильність всіх фотографій та данних.<br /><br />При натисканні на кнопку \"Продовжити\" ми збережемо ці фотографії в базі данних та видамо Вам нову тимчасову перепустку.",
    }
];
