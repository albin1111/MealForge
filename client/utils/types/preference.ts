import { z } from "zod";

export const PreferenceSchema = z.object({
	allergies: z.string(),
});
export type TNewPreference = z.infer<typeof PreferenceSchema>;
