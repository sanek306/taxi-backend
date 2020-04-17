import {
    BaseEntity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

class Verification extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text" })
    target: string;
    @Column({ type: "text" })
    payload: string;
    @Column({ type: "text" })
    key: string;

    @Column({ type: "boolean", default: false })
    used: boolean;

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}

export default Verification;