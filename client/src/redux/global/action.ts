import { IdentifierType } from "./state";

export function setGlobalModal(data: {
  isOpen: boolean;
  content?: string;
  identifier?: IdentifierType;
}) {
  return {
    type: "@@global/setGlobalModal" as const,
    data,
  };
}

type IGlobalActions = typeof setGlobalModal;

export type IGlobalAction = ReturnType<IGlobalActions>;
