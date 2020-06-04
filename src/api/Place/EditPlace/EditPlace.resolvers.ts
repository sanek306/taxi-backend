import { Resolvers } from "src/types/resolvers";
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
            const { placeId: id, ...otherArgs } = args;
            try {
                const place = await Place.findOne({ id });
                if (place) {
                    if (place.userId === user.id) {
                        await Place.update( { id },{ id, ...otherArgs });
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