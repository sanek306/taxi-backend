import {Resolvers} from "types/resolvers";
import {UpdateRideStatusMutationArgs, UpdateRideStatusResponse} from "../../../types/graph";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: authResolver(async (_, args: UpdateRideStatusMutationArgs, { req, pubSub }) : Promise<UpdateRideStatusResponse> => {
            const user: User = req.user;
            const { rideId, status } = args;
            try {
                let ride;
                if (status === "ACCEPTED") {
                    ride = await Ride.findOne({id: rideId, status: "REQUESTING"}, { relations: ["passenger", "driver"] });
                    if (ride) {
                        ride.driver = user;
                        user.isTaken = true;
                        await user.save();
                        ride.chat = await Chat.create({
                            driver: user,
                            passenger: ride.passenger
                        }).save();
                        await ride.save();
                    }
                } else if (status === "FINISHED") {
                    ride = await Ride.findOne({id: rideId, driver: user}, { relations: ["passenger", "driver"] });
                    const passenger: User = ride.passenger;
                    passenger.isRiding = false;
                    await passenger.save();
                    user.isTaken = false;
                    await user.save();
                }  else if (status === "CANCELED") {
                    ride = await Ride.findOne({id: rideId}, { relations: ["passenger", "driver"] });
                    user.isRiding = false;
                    await user.save();
                } else {
                    ride = await Ride.findOne({id: rideId, driver: user}, { relations: ["passenger", "driver"] });
                }
                if (ride) {
                    ride.status = status;
                    await ride.save();
                    pubSub.publish("rideUpdate", {
                        RideStatusSubscription: ride
                    });
                    return {
                        ok: true,
                        error: null,
                        rideId
                    }
                } else {
                    return {
                        ok: false,
                        error: "Can't update ride",
                        rideId
                    }
                }
            } catch (e) {
                return {
                    ok: false,
                    error: e.message,
                    rideId
                }
            }
        })
    }
};

export default resolvers;