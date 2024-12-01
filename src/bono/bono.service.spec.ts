import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


describe('BonoService', () => {
  let service: BonoService;
  let repository: Repository<BonoEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let teacher: UsuarioEntity;
  let clase: ClaseEntity;
  let bonosList: BonoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    repository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));

  await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    await claseRepository.clear();
    await usuarioRepository.clear();
  
    teacher = await usuarioRepository.save({
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'Teacher',
      bossID: faker.string.uuid()
    });
  
    clase = await claseRepository.save({
      name: faker.person.firstName(),
      code: faker.string.alphanumeric(10),
      creds: faker.number.int(),
      teacher: teacher,
      bonos: []
    });
  
    bonosList = [];
    for (let i = 0; i < 5; i++) {
      const bono = await repository.save({
        amount: faker.number.int(),
        grade: faker.number.float({ min: 0, max: 5 }),
        keyWord: faker.string.alphanumeric(),
        class: clase,
        user: teacher
      });
      bonosList.push(bono);
    }
  };  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a bono', async () => {
    const bono = {
      id: "",
      amount: faker.number.int(),
      grade: faker.number.float({ min: 0, max: 5 }),
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: teacher
    };

    const result = await service.create(bono);
    expect(result).not.toBeNull();

    const storedBono = await repository.findOne({ where: { id: result.id } });
    expect(storedBono).not.toBeNull();
    expect(result.amount).toEqual(storedBono.amount);
    expect(result.grade).toEqual(storedBono.grade);
    expect(result.keyWord).toEqual(storedBono.keyWord);
  });

  it('should not create a bono with amount less than or equal to 0', async () => {
    const bono = {
      id: "",
      amount: 0,
      grade: faker.number.float({ min: 0, max: 5 }),
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: teacher
    };

    await expect(service.create(bono)).rejects.toHaveProperty('message', 'The amount must be greater than 0');
  });

  it('should not create a bono with user different than teacher', async () => {
    const bono = {
      id: "",
      amount: faker.number.int(),
      grade: faker.number.float({ min: 0, max: 5 }),
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: usuarioRepository.create({
        cedula: faker.number.int(),
        name: faker.person.firstName(),
        researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
        ext: faker.number.int({ min: 10000000, max: 99999999 }),
        role: 'Dean',
        bossID: faker.string.uuid()
      })
    };

    await expect(service.create(bono)).rejects.toHaveProperty('message', 'The user must be a teacher');
  });

  it('should find bonos by class code', async () => {
    const result = await service.findByClassCode(clase.code);
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
  });

  it('should not find bonos of different class code', async () => {
    const clase2 = await claseRepository.save({
      name: faker.person.firstName(),
      code: faker.string.alphanumeric(10),
      creds: faker.number.int(),
      teacher: teacher,
      bonos: []
    });

    const bono = await repository.save({
      amount: faker.number.int(),
      grade: faker.number.float({ min: 0, max: 5 }),
      keyWord: faker.string.alphanumeric(),
      class: clase2,
      user: teacher
    });

    const result = await service.findByClassCode(clase.code);
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
    expect(result).not.toContain(bono);
  });

  it('should find bonos by user id', async () => {
    const result = await service.findByUser(teacher.id);
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
  });

  it('should not find bonos of different user id', async () => {
    const teacher2 = await usuarioRepository.save({
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'Teacher',
      bossID: faker.string.uuid()
    });

    const bono = await repository.save({
      amount: faker.number.int(),
      grade: faker.number.float({ min: 0, max: 5 }),
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: teacher2
    });

    const result = await service.findByUser(teacher.id);
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
    expect(result).not.toContain(bono);
  });

  it('should delete a bono', async () => {
    const bono = await repository.save({
      amount: faker.number.int(),
      grade: 2,
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: teacher
    });

    await service.delete(bono.id);

    const result = await repository.findOne({ where: { id: bono.id } });
    expect(result).toBeNull();
  });

  it('should not delete a bono with grade greater than 4', async () => {
    const bono = await repository.save({
      amount: faker.number.int(),
      grade: 5,
      keyWord: faker.string.alphanumeric(),
      class: clase,
      user: teacher
    });

    await repository.save(bono);

    await expect(service.delete(bono.id)).rejects.toHaveProperty('message', 'The bono cannot be deleted because it has a grade greater than 4');
  });

});
