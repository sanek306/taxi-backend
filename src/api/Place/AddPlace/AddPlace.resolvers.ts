import { Resolvers } from "types/resolvers";
import {
    AddPlaceMutationArgs, AddPlaceResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        AddPlace: authResolver (async(_, args: AddPlaceMutationArgs, { req }): Promise<AddPlaceResponse> => {
            const user : User = req.user;

            try {
              await Place.create({ ... args, user }).save();
                return {
                    ok: true,
                    error: null
                }
            } catch (e) {
                return {
                    ok: false,
                    error: e.message
                }
            }
        })
    }
};

export default resolvers;