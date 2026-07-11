"use server";

import { CreateTripRequestSchema } from "@/src/schema/trip";
import type {
    CreateTripRequest,
    TripRequest,
} from "@/src/schema/trip/index.type";
import { TripService } from "@/src/service";

export type TripRequestActionResult =
    | { success: true; data: TripRequest }
    | { success: false; message: string };

/** Validates and forwards a trip request to the backend API. */
export async function createTripRequestAction(
    payload: CreateTripRequest
): Promise<TripRequestActionResult> {
    const parsed = CreateTripRequestSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            message: "Some details don't look right — please check the form.",
        };
    }

    try {
        const result = await TripService.createTripRequest(parsed.data);
        if (!result.success || !result.data) {
            return {
                success: false,
                message:
                    result.error?.message ??
                    "Could not send your request. Please try again.",
            };
        }
        return { success: true, data: result.data };
    } catch {
        return {
            success: false,
            message:
                "Could not reach the booking service. Please try again, or call us directly.",
        };
    }
}
