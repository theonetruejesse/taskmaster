export enum Status {
  Soon = "Soon",
  Todo = "Todo",
  Doing = "Doing",
  Priority = "Priority",
  Done = "Done",
  Paused = "Paused",
  Abandoned = "Abandoned",
}

export const getStatusProp = (name: string) => ({
  status: {
    name,
  },
});
