import { APIClient } from "@/src/service/core/config";
import { parseResponse, responseParser } from "@/src/service/core/response-parser";
import { TripRequestSchema } from "@/src/schema/trip";
import type { CreateTripRequest, TripRequest } from "@/src/schema/trip/index.type";
import type { ClientResponse } from "@/src/schema/response/index.type";

export default class TripController {
    private apiClient: APIClient;
    constructor(private readonly backendUrl: string) {
        this.apiClient = new APIClient(backendUrl);
    }

    /** Submits a trip request. Public route — no auth token needed. */
    async createTripRequest(
        payload: CreateTripRequest
    ): Promise<ClientResponse<TripRequest>> {
        const response = await this.apiClient.post(
            "/api/v1/trip-requests",
            payload,
            undefined,
            true
        );
        const parsed = await parseResponse<unknown>(response);
        if (!parsed.success) return parsed as ClientResponse<TripRequest>;
        return responseParser(parsed.data, TripRequestSchema, "data");
    }
}
