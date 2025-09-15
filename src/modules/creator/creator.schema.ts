import z from "zod";

export const createCreatorSchema = z.object({
    username: z.string()
    .min(1, "username is required")
    .max(100, "username too long")
    .refine((val) => !/\s/.test(val), {
      message: "username cannot contain spaces",
    })
    .refine((val) => !/[A-Z]/.test(val), {
      message: "username cannot contain uppercase letters",
    }),
    bio: z.string().optional()
});

export type CreateCreatorSchema = z.infer<typeof createCreatorSchema> & { userId: string,  };