import { Resolvers } from "src/types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import {GetRidesResponse} from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetRides: authResolver(async (_, __, { req }) : Promise<GetRidesResponse> => {
            const user: User = req.user;

            try {
                const rides = await Ride.find({ passengerId: user.id });
                return {
                    ok: true,
                    error: null,
                    rides
                }
            }
            catch (e) {
                return {
                    ok: false,
                    error: e.message,
                    rides: []
                }
            }
        })
    }
};

export default resolvers;