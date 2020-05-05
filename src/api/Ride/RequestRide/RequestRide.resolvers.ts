import { Resolvers } from "types/resolvers";
import {
    RequestRideMutationArgs, RequestRideResponse
} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: authResolver(async (_, args: RequestRideMutationArgs, { req }) : Promise<RequestRideResponse> => {
            const user: User = req.user;
            try {
                const ride = await Ride.create({ ...args, passenger: user }).save();

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
        })
    }
};

export default resolvers;