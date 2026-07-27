import { z } from "zod";
import { CreateReviewSchema, ReviewSchema } from "./index";

export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type Review = z.infer<typeof ReviewSchema>;
