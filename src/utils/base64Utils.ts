export const convertStringToBase64 = (input: string): string =>
    Buffer.from(input).toString("base64");

export const convertBase64ToString = (input: string): string =>
    Buffer.from(input, "base64").toString("ascii");
