import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsEmail} from "class-validator";
import bcrypt from "bcrypt";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Place from "./Place";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity{
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text", nullable: true })
    @IsEmail()
    email: string | null;

    @Column({ type: "text", nullable: true })
    facebookID: string | null;

    @Column({ type: "text" })
    firstName: string;

    @Column({ type: "text" })
    lastName: string;

    @Column({ type: "int", nullable: true })
    age: number;

    @Column({ type: "text", nullable: true })
    password: string;

    @Column({ type: "text", nullable: true })
    phoneNumber: string;

    @Column({ type: "boolean", default: false })
    verifiedPhoneNumber: boolean;

    @Column({ type: "text", nullable: true })
    fbId: string;

    @Column({ type: "text", nullable: true })
    profilePhoto: string;

    @Column({ type: "boolean", default: false })
    isDriving: boolean;
    @Column({ type: "boolean", default: false })
    isRiding: boolean;
    @Column({ type: "boolean", default: false })
    isTaken:boolean;

    @Column({ type: "double precision", default: 0})
    lastLng: number;
    @Column({ type: "double precision", default: 0})
    lastLat: number;
    @Column({ type: "double precision", default: 0})
    lastOrientation: number;

    @OneToMany(() => Chat, chat => chat.passenger)
    chatsAsPassenger: Chat[];

    @OneToMany(() => Chat, chat => chat.driver)
    chatsAsDriver: Chat[];

    @OneToMany(() => Message, message => message.user)
    messages: Message[];

    @OneToMany(() => Ride, ride => ride.passenger)
    ridesAsPassenger: Ride[];

    @OneToMany(() => Ride, ride => ride.driver)
    ridesAsDriver: Ride[];

    @OneToMany(() => Place, place => place.user)
    places: Place[];

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    private static hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    public comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

    @BeforeInsert()
    @BeforeUpdate()
    async savePassword() : Promise<void> {
        if (this.password) {
            this.password = await User.hashPassword(this.password);
        }
    }
}

export default User;