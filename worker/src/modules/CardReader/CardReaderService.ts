import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { SerialPort } from "serialport";
import { SerialDeviceType, SerialPortDevice } from "./types";
import { ReadlineParser } from "@serialport/parser-readline";
import { EventBusService } from "../EventBus/services";
import { SocketCommandsHelper } from "src/helpers";

@Injectable()
export class CardReaderService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CardReaderService.name);
    private readonly _serialPorts: Map<SerialDeviceType, SerialPortDevice> = new Map();

    constructor(
        private readonly eventBus: EventBusService,
    ) {}

    onApplicationBootstrap() {
        this.logger.warn("Bootstrapping serial devices...");

        // Starting serialPort
        // todo: configuration-based serial ports
        const PORTS = [
            {
                port: "COM3",
                type: SerialDeviceType.GUEST
            }
        ];

        // Initializing devices
        for (const serialPort of PORTS) {
            const type = serialPort.type;
            const device = new SerialPort({
                path: serialPort.port,
                baudRate: 9600,
            });
            const parser = device.pipe(new ReadlineParser({ delimiter: "\r\n" }));

            this.logger.log(`Bootstrapping device type [${type}] with path [${device.path}], baud rate [${device.baudRate}], isOpen [${device.isOpen}]`);

            // Saving this device configuration
            this._serialPorts.set(type, {
                type,
                device,
                parser,
            });

            // Attaching every needed event listener and parser to this device
            device.on('error', (error) => {
                this.logger.error(error);
            });

            // device.on('data', (data) => {
            //     this.logger.debug("Device data: ", data);
            // })

            parser.on('error', (error) => {
                this.logger.error(error);
            })

            parser.on('data', (data: string) => {
                this.logger.warn(data);
                SocketCommandsHelper.sendProcessingCard(this.eventBus.instance);

                // 423A048071
                // 973373553

                // 223A04530B
                // 973361931
                // num = 9
                
                if (data.includes("Mifare")) {
                    const cardId = parseInt((data.split(',')[1]).split(' ')[0]);
                    console.log(cardId);

                    // Sending this cardId to our frontend
                    SocketCommandsHelper.sendCardId(this.eventBus.instance, cardId);
                };
                // if (regexp.test(data)) {
                //     const cardId = regexp.exec(data)[0];

                // };
            })
        };
    }
};
