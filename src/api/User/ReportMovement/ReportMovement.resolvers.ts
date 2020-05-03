import { Resolvers } from "types/resolvers";
import {
    ReportMovementMutationArgs, ReportMovementResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: authResolver (async(_, args: ReportMovementMutationArgs, { req }): Promise<ReportMovementResponse> => {
            const user : User = req.user;
            try {
                await User.update({ id: user.id }, { ...args });
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