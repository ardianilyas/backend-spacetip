import z from "zod";

export const createCreatorSchema = z.object({
    username: z.string()
    .min(1, "username is required")
    .max(100, "username too long")
    .refine((val) => !/\s/.test(val), {
      message: "username tidak boleh mengandung spasi",
    })
    .refine((val) => !/[A-Z]/.test(val), {
      message: "username tidak boleh mengandung huruf besar",
    }),
    bio: z.string().optional()
});

export type CreateCreatorSchema = z.infer<typeof createCreatorSchema> & { userId: string,  };