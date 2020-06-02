import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: withFilter(
                (_, __, {pubSub}) => {
                    return pubSub.asyncIterator("driverUpdate");
                },
                (payload, __, { context }) =>  {
                    const user: User = context.currentUser;
                    const { DriverSubscription: {
                        lastLat: driverLastLat,
                        lastLng: driverLastLng
                    }} = payload;
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;
                    return (
                        driverLastLat >= userLastLat - 1 &&
                        driverLastLat <= userLastLat + 1 &&
                        driverLastLng >= userLastLng - 1 &&
                        driverLastLng <= userLastLng + 1
                    );
                })
        }
    }
};

export default resolvers;