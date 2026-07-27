import AuthController from "@/src/service/controller/auth";
import TripController from "@/src/service/controller/trip";
import ReviewController from "@/src/service/controller/review";

const apiConfig = {
    auth: new AuthController(process.env.API_URL!),
    trip: new TripController(process.env.API_URL!),
    review: new ReviewController(process.env.API_URL!),
}

export const AuthService = apiConfig.auth;
export const TripService = apiConfig.trip;
export const ReviewService = apiConfig.review;