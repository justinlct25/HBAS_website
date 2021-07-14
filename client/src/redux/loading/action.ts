export function setIsLoadingAction(isLoading: boolean) {
  return {
    type: "@@loading/setIsLoading" as const,
    isLoading,
  };
}

type ILoadingActionCreators = typeof setIsLoadingAction;

export type ILoadingPageAction = ReturnType<ILoadingActionCreators>;
