import { Resolvers } from "types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import { GetNearbyRideResponse } from "../../../types/graph";
import {Between} from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRide: authResolver(async (_, __, { req }) : Promise<GetNearbyRideResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;
            if (user.isDriving) {
                try {
                    const ride = await Ride.findOne({
                        status: "REQUESTING",
                        pickUpLat: Between(lastLat - 1, lastLat + 1),
                        pickUpLnd: Between(lastLng - 1, lastLng + 1)
                    }, { relations: ["passenger", "driver"]});
                    if (ride) {
                        return {
                            ok: true,
                            error: null,
                            ride
                        }
                    }
                    else {
                        return {
                            ok: true,
                            error: null,
                            ride: null
                        }
                    }
                }
                catch (e) {
                    return {
                        ok: true,
                        error: e.message,
                        ride: null
                    }
                }
            }
            else {
                return {
                    ok: false,
                    error: "You're not a driver",
                    ride: null
                }
            }
        })
    }
};

export default resolvers;