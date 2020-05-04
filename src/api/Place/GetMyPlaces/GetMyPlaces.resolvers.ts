import { Resolvers } from "types/resolvers";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        AddPlace: authResolver (async(_, __, { req }): Promise<{ places: Place[]; ok: boolean; error: string | null }> => {
            try {
                const user : User = await User.findOne({ id: req.user.id}, { relations: ["places"]});
                if (user) {
                    return {
                        ok: true,
                        error: null,
                        places: user.places
                    }
                }
                else {
                    return {
                        ok: false,
                        error: "User not found",
                        places: null
                    }
                }
            }
            catch (e) {
                return {
                    ok: true,
                    error: e.message,
                    places: null
                }
            }
        })
    }
};

export default resolvers;