import { Resolvers } from "types/resolvers";
import {
    ReportMovementMutationArgs, ReportMovementResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: authResolver (async(_, args: ReportMovementMutationArgs, { req, pubSub }): Promise<ReportMovementResponse> => {
            const user : User = req.user;
            try {
                await User.update({ id: user.id }, { ...args });
                const updatedUser = await User.findOne(user.id);
                pubSub.publish("driverUpdate", { DriversSubscription: updatedUser });
                return {
                    ok: true,
                    error: null
                }
            }
            catch (e) {
                return {
                    ok: false,
                    error: e.message
                }
            }
        })
    }
};

export default resolvers;