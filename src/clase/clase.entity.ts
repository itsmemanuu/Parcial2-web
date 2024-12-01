import { BonoEntity } from '../bono/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    creds: number;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.classes)
    teacher: UsuarioEntity;

    @OneToMany(() => BonoEntity, bono => bono.class)
    bonos: BonoEntity[];
}
