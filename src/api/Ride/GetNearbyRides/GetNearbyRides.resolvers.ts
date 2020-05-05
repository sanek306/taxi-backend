import { Resolvers } from "types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import {GetNearbyRidesResponse} from "../../../types/graph";
import {Between} from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRides: authResolver(async (_, __, { req }) : Promise<GetNearbyRidesResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;
            if (user.isDriving) {
                try {
                    const rides = await Ride.find({
                        status: "REQUESTING",
                        pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                        pickUpLnd: Between(lastLng - 0.05, lastLng + 0.05)
                    });
                    return {
                        ok: true,
                        error: null,
                        rides
                    }
                }
                catch (e) {
                    return {
                        ok: true,
                        error: e.message,
                        rides: null
                    }
                }
            }
            else {
                return {
                    ok: false,
                    error: "You're not a driver",
                    rides: null
                }
            }
        })
    }
};

export default resolvers;