export class SensorMessage {
    constructor(
        public sensor: string,
        public sensorType: string,
        public content: string,
        public lastUpdated: string
     ) { }
  }