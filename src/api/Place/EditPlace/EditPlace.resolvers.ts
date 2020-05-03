import { Resolvers } from "types/resolvers";
import {
    EditPlaceMutationArgs, EditPlaceResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        EditPlace: authResolver (async(_, args: EditPlaceMutationArgs, { req }): Promise<EditPlaceResponse> => {
            const user : User = req.user;
            const { placeId } = args;
            try {
                const place = await Place.findOne({ id: placeId });
                if (place) {
                    if (place.userId === user.id) {
                        await Place.update( { id: args.placeId },{ ...args });
                        return {
                            ok: true,
                            error: null
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Not Authorized"
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "Place not found"
                    }
                }
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