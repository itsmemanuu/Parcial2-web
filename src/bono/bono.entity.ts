import { ClaseEntity } from '../clase/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BonoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column('double precision')
    grade: number;

    @Column()
    keyWord: string;

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    class: ClaseEntity;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    user: UsuarioEntity;
}
