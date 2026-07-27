"use server";

import { CreateReviewSchema } from "@/src/schema/review";
import type { CreateReview, Review } from "@/src/schema/review/index.type";
import { ReviewService } from "@/src/service";

export type ReviewActionResult =
    | { success: true; data: Review }
    | { success: false; message: string };

/** Validates and forwards a review to the backend API. */
export async function createReviewAction(
    payload: CreateReview
): Promise<ReviewActionResult> {
    const parsed = CreateReviewSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            message: "Some details don't look right — please check the form.",
        };
    }

    try {
        const result = await ReviewService.createReview(parsed.data);
        if (!result.success || !result.data) {
            return {
                success: false,
                message:
                    result.error?.message ??
                    "Could not post your review. Please try again.",
            };
        }
        return { success: true, data: result.data };
    } catch {
        return {
            success: false,
            message:
                "Could not reach the review service. Please try again later.",
        };
    }
}
