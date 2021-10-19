export type IdentifierType = "CONFIRM_LOGOUT" | "";

export interface IGlobalData {
  isOpen: boolean;
  content: string;
  identifier: IdentifierType;
}

export interface IGlobalState {
  global: IGlobalData;
}
