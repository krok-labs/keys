import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { SerialPort } from "serialport";
import { SerialDeviceType, SerialPortDevice } from "../types";
import { ReadlineParser } from "@serialport/parser-readline";

@Injectable()
export class CardReaderListenerService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CardReaderListenerService.name);
    private readonly _serialPorts: Map<SerialDeviceType, SerialPortDevice> = new Map();
    
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
                baudRate: 9600
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

            parser.on('data', (data) => {
                this.logger.warn(data);
                const regexp = new RegExp(/(?<=^[A-Za-z]+\[.+)[0-9A-F]{8}(?=\])/);
                
                // 973373553
                // num = 9

                if (regexp.test(data)) {
                    const hexId = regexp.exec(data)[0];
                    this.logger.warn(`Hex: ${hexId}`);
                    for (let index = 0; index < 32; index++) {
                        this.logger.warn(`CardId: ${parseInt(hexId, index)}`);
                    }
                };
            })
        };
    }
};
