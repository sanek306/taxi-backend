import { Resolvers } from "types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import {GetNearbyDriversResponse} from "../../../types/graph";
import {Between} from "typeorm";

const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: authResolver(async (_, __, { req }) : Promise<GetNearbyDriversResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;

            try {
                const drivers = await User.find({
                    isDriving: true,
                    lastLat: Between(lastLat - 1, lastLat + 1),
                    lastLng: Between(lastLng - 1, lastLng + 1)
                });
                return {
                    ok: true,
                    error: null,
                    drivers
                }
            }
            catch (e) {
                return {
                    ok: true,
                    error: e.message,
                    drivers: null
                }
            }
        })
    }
};

export default resolvers;