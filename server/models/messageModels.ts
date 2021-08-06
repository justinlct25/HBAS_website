// interfaces for message details ----------------------------------------
export interface ILocation {
  latitude: number;
  longitude: number;
  altitude: number;
  source: string;
  accuracy: number;
}

export interface IRxInfo {
  gatewayID: string;
  time: null;
  timeSinceGPSEpoch: string;
  rssi: number;
  loRaSNR: number;
  channel: number;
  rfChain: number;
  board: number;
  antenna: number;
  location: ILocation;
  fineTimestampType: string;
  context: string;
  uplinkID: string;
  crcStatus: string;
}

export interface ILoRaModulationInfo {
  bandwidth: number;
  spreadingFactor: number;
  codeRate: string;
  polarizationInversion: boolean;
}

export interface ITxInfo {
  frequency: number;
  modulation: string;
  loRaModulationInfo: ILoRaModulationInfo;
}

export interface IObjectJSON {
  battery: string;
  date: string;
  latitude: string;
  longitude: string;
  msgtype: string;
  time: string;
}

// interfaces for messages themselves ----------------------------------------
export interface IJoinMessage {
  applicationID: string;
  applicationName: string;
  deviceName: string;
  devEUI: string;
  devAddr: string;
  rxInfo: IRxInfo[];
  txInfo: ITxInfo;
  dr: number;
  tags: {};
}

export interface IUpMessage {
  applicationID: string;
  applicationName: string;
  deviceName: string;
  devEUI: string;
  rxInfo: IRxInfo[];
  txInfo: ITxInfo;
  adr: true;
  dr: number;
  fCnt: number;
  fPort: number;
  data: string;
  objectJSON: string;
  tags: {};
  confirmedUplink: boolean;
  devAddr: string;
}
