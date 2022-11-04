export enum Type {
  Life = "Life",
  Venture = "Venture",
  School = "School",
  Career = "Career",
  Other = "Other",
}

export const getTypeProp = (name: string) => ({
  select: {
    name,
  },
});
