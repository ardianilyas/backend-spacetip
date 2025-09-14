import z, { ZodObject } from "zod";

export function validate<T extends ZodObject, K>(schema: T, data: K): z.infer<T> {
    const result = schema.safeParse(data);

    if(!result.success) {
        throw result.error;
    }

    return result.data;
}