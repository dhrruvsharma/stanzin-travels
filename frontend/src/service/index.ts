import AuthController from "@/src/service/controller/auth";
import TripController from "@/src/service/controller/trip";

const apiConfig = {
    auth: new AuthController(process.env.API_URL!),
    trip: new TripController(process.env.API_URL!),
}

export const AuthService = apiConfig.auth;
export const TripService = apiConfig.trip;