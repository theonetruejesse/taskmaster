export const enumContains = (e: any, name: string) =>
  Object.keys(e).includes(name);

export const getEnumKeyByValue = (e: any, value: any) =>
  Object.keys(e)[Object.values(e).indexOf(value)];
