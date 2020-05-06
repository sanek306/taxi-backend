import { Resolvers } from "types/resolvers";
import {
    UpdateRideStatusMutationArgs, UpdateRideStatusResponse
} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: authResolver(async (_, args: UpdateRideStatusMutationArgs, { req }) : Promise<UpdateRideStatusResponse> => {
            const user: User = req.user;
            const { rideId, status } = args;
            if (user.isDriving) {
                try {
                    let ride;
                    if (status === "ACCEPTED") {
                        ride = await Ride.findOne({id: rideId, status: "REQUESTING"});
                        if (ride) {
                            ride.driver = user;
                            user.isTaken = true;
                            await ride.save();
                        }
                    } else {
                        ride = await Ride.findOne({id: rideId, driver: user});
                    }
                    if (ride) {
                        ride.status = status;
                        await ride.save();

                        return {
                            ok: true,
                            error: null
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Can't update ride"
                        }
                    }
                } catch (e) {
                    return {
                        ok: false,
                        error: e.message
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You are not driving"
                }
            }
        })
    }
};

export default resolvers;