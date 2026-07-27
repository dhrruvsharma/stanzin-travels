import { APIClient } from "@/src/service/core/config";
import {
    parseResponse,
    responseParser,
} from "@/src/service/core/response-parser";
import { ReviewListSchema, ReviewSchema } from "@/src/schema/review";
import type { CreateReview, Review } from "@/src/schema/review/index.type";
import type { ClientResponse } from "@/src/schema/response/index.type";

export default class ReviewController {
    private apiClient: APIClient;
    constructor(private readonly backendUrl: string) {
        this.apiClient = new APIClient(backendUrl);
    }

    /** Submits a review. Public route — no auth token needed. */
    async createReview(
        payload: CreateReview
    ): Promise<ClientResponse<Review>> {
        const response = await this.apiClient.post(
            "/api/v1/reviews",
            payload,
            undefined,
            true
        );
        const parsed = await parseResponse<unknown>(response);
        if (!parsed.success) return parsed as ClientResponse<Review>;
        return responseParser(parsed.data, ReviewSchema, "data");
    }

    /** Public list of reviews, newest first. */
    async listReviews(): Promise<ClientResponse<Review[]>> {
        const response = await this.apiClient.get(
            "/api/v1/reviews",
            undefined,
            true
        );
        const parsed = await parseResponse<unknown>(response);
        if (!parsed.success) return parsed as ClientResponse<Review[]>;
        return responseParser(parsed.data, ReviewListSchema, "data");
    }
}
