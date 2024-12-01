import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cedula: number;

    @Column()
    name: string;

    @Column()
    researchGroup: string;

    @Column()
    ext: number;

    @Column()
    role: string;

    @Column()
    bossID: string;

    @OneToMany(() => ClaseEntity, clase => clase.teacher)
    classes: ClaseEntity[];

    @OneToMany(() => BonoEntity, bono => bono.user)
    bonos: BonoEntity[];
}
