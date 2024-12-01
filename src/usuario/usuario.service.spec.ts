import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker/.';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      id: "",
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: faker.helpers.arrayElement(['Teacher', 'Dean']),
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    }

    const result = await service.create(user);
    expect(result).not.toBeNull();

    const storedUser = await repository.findOne({ where: { id: result.id } });
    expect(storedUser).not.toBeNull();
    expect(result.name).toEqual(storedUser.name);
    expect(result.cedula).toEqual(storedUser.cedula);
    expect(result.researchGroup).toEqual(storedUser.researchGroup);
    expect(result.ext).toEqual(storedUser.ext);
    expect(result.role).toEqual(storedUser.role);
    expect(result.bossID).toEqual(storedUser.bossID);
  });

  it('should not create a user with an invalid research group', async () => {
    const user = {
      id: "",
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: 'INVALID',
      ext: faker.number.int(),
      role: 'Teacher',
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    }

    await expect(service.create(user)).rejects.toHaveProperty('message', 'The research group is not valid');
  });

  it('should not create a user with an extension number that is not 8 digits long', async () => {
    const user = {
      id: "",
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: 12345,
      role: 'Dean',
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    }

    await expect(service.create(user)).rejects.toHaveProperty('message', 'The extension number must be 8 digits long');
  });

  it('should find a user by ID', async () => {
    const user = await repository.save({
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: faker.helpers.arrayElement(['Teacher', 'Dean']),
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    });

    const result = await service.findByID(user.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(user.id);
    expect(result.name).toEqual(user.name);
    expect(result.cedula).toEqual(user.cedula);
    expect(result.researchGroup).toEqual(user.researchGroup);
    expect(result.ext).toEqual(user.ext);
    expect(result.role).toEqual(user.role);
    expect(result.bossID).toEqual(user.bossID);
  });

  it('should not find a user with invalid ID', async () => {
    await expect(service.findByID('non-existing-id')).rejects.toHaveProperty('message', 'The usuario with the given id was not found');
  });

  it('should delete a user', async () => {
    const user = await repository.save({
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'Teacher',
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    });

    await service.delete(user.id);
    const result = await repository.findOne({ where: { id: user.id } });
    expect(result).toBeNull();
  });

  it('should not delete a user because it is a Dean', async () => {
    const user = await repository.save({
      cedula: faker.number.int(),
      name: faker.person.firstName(),
      researchGroup: faker.helpers.arrayElement(['ICSW', 'IMAGINE', 'COMIT']),
      ext: faker.number.int({ min: 10000000, max: 99999999 }),
      role: 'Dean',
      bossID: faker.string.uuid(),
      classes: [],
      bonos: []
    });

    await expect(service.delete(user.id)).rejects.toHaveProperty('message', 'The usuario cannot be deleted because it\'s a Dean');
  });

  it('should not delete a user with invalid ID', async () => {
    await expect(service.delete('non-existing-id')).rejects.toHaveProperty('message', 'The usuario with the given id was not found');
  });
});
