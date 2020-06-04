import { Resolvers } from "src/types/resolvers";
import authResolver from "../../../utils/authResolver";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Query: {
        GetMyProfile: authResolver(async (_, __, { req }) => {
            const { user } = req;
            user.places = await Place.find({ userId: user.id });
            return {
                ok: true,
                error: null,
                user
            }
        })
    }
};

export default resolvers;