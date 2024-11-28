import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToOne(() => UsuarioEntity, usuario => usuario.employees)
    boss: UsuarioEntity;

    @OneToMany(() => UsuarioEntity, usuario => usuario.boss)
    employees: UsuarioEntity[];

    @OneToMany(() => ClaseEntity, clase => clase.teacher)
    classes: ClaseEntity[];

    @OneToMany(() => BonoEntity, bono => bono.user)
    bonos: BonoEntity[];
}
