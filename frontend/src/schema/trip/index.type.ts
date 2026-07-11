import { z } from "zod";
import {
    CreateTripRequestSchema,
    DayPlanSchema,
    ServiceTypeSchema,
    TripRequestSchema,
} from "./index";

export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;
export type CreateTripRequest = z.infer<typeof CreateTripRequestSchema>;
export type TripRequest = z.infer<typeof TripRequestSchema>;
