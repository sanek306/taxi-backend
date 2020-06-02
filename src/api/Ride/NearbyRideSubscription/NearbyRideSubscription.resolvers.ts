import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        NearbyRideSubscription: {
            subscribe: withFilter(
                (_, __, {pubSub}) => {
                    return pubSub.asyncIterator("rideRequest");
                },
                async (payload, __, { context }) =>  {
                    const user: User = context.currentUser;
                    const { NearbyRideSubscription: {
                        pickUpLat,
                        pickUpLnd
                    }} = payload;
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;
                    return (
                        pickUpLat >= userLastLat - 1 &&
                        pickUpLat <= userLastLat + 1 &&
                        pickUpLnd >= userLastLng - 1 &&
                        pickUpLnd <= userLastLng + 1
                    );
                })
        }
    }
};

export default resolvers;