export const convertStringToBase64 = (input: string) =>
    Buffer.from(input).toString("base64");

export const convertBase64ToString = (input: string) =>
    Buffer.from(input, "base64").toString("ascii");
