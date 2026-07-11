import { z } from "zod";

export const ServiceTypeSchema = z.enum([
    "driver_only",
    "hotel_only",
    "complete_itinerary",
]);

export const DayPlanSchema = z.object({
    day_number: z.number().int().min(1),
    place: z.string().min(1),
});

export const CreateTripRequestSchema = z.object({
    customer_name: z.string().min(1).max(120),
    customer_phone: z
        .string()
        .regex(/^\+?[0-9][0-9 \-]{6,17}$/, "Phone number doesn't look valid"),
    group_size: z.number().int().min(1).max(50),
    service_type: ServiceTypeSchema,
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    vehicle_slug: z.string().min(1),
    day_plans: z.array(DayPlanSchema),
});

export const TripRequestSchema = CreateTripRequestSchema.extend({
    id: z.string(),
    status: z.string(),
    created_at: z.string(),
});
