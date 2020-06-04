import { Resolvers } from "src/types/resolvers";
import {
    RequestRideMutationArgs, RequestRideResponse
} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: authResolver(async (_, args: RequestRideMutationArgs, { req, pubSub }) : Promise<RequestRideResponse> => {
            const user: User = req.user;
            if (!user.isRiding && !user.isDriving) {
                try {
                    const ride = await Ride.create({ ...args, passenger: user }).save();
                    pubSub.publish("rideRequest", { NearbyRideSubscription: ride });
                    user.isRiding = true;
                    await user.save();
                    return {
                        ok: true,
                        error: null,
                        ride
                    }
                } catch (e) {
                    return {
                        ok: false,
                        error: e.message,
                        ride: null
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You can't request two rides or drive and request",
                    ride: null
                }
            }
        })
    }
};

export default resolvers;