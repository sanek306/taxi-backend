import { Resolvers } from "src/types/resolvers";
import {
    DeletePlaceMutationArgs, DeletePlaceResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import authResolver from "../../../utils/authResolver";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        DeletePlace: authResolver (async(_, args: DeletePlaceMutationArgs, { req }): Promise<DeletePlaceResponse> => {
            const user : User = req.user;
            const { placeId } = args;
            try {
                const place = await Place.findOne({ id: placeId });
                if (place) {
                    if (place.userId === user.id) {
                        await place.remove();
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