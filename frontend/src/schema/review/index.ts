import { z } from "zod";

export const CreateReviewSchema = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    rating: z.number().int().min(0).max(5),
    body: z.string().min(1).max(2000),
});

/** A review as shown on the public site — no contact details. */
export const ReviewSchema = z.object({
    id: z.string(),
    name: z.string(),
    rating: z.number().int(),
    body: z.string(),
    created_at: z.string(),
});

export const ReviewListSchema = z.array(ReviewSchema);
