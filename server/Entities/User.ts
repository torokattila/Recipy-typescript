import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './Recipe';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 150,
        nullable: true
    })
    google_id: string;

    @Column({
        length: 50,
        unique: true
    })
    username: string;

    @Column({
        length: 255,
        unique: true
    })
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(
        () => Recipe,
        recipe => recipe.user
    )
    recipies: Recipe[];
}