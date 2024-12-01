import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClaseEntity } from './clase.entity';
import { faker } from '@faker-js/faker/.';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clase: ClaseEntity;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    clase = await repository.save({
      name: faker.person.firstName(),
      code: faker.string.alphanumeric(10),
      creds: faker.number.int(),
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a clase', async () => {
    const clase = {
      id: "",
      name: faker.person.firstName(),
      code: faker.string.alphanumeric(10),
      creds: faker.number.int(),
      teacher: null,
      bonos: []
    };

    const result = await service.create(clase);
    expect(result).not.toBeNull();

    const storedClase = await repository.findOne({ where: { id: result.id } });
    expect(storedClase).not.toBeNull();
    expect(result.name).toEqual(storedClase.name);
    expect(result.code).toEqual(storedClase.code);
    expect(result.creds).toEqual(storedClase.creds);
  });

  it('should not create a clase with a code that is not 10 characters long', async () => {
    const clase = {
      id: "",
      name: faker.person.firstName(),
      code: faker.string.alphanumeric(9),
      creds: faker.number.int(),
      teacher: null,
      bonos: []
    };

    await expect(service.create(clase)).rejects.toHaveProperty('message', 'The code must be 10 characters long');
  });

  it('should find a clase by ID', async () => {
    const result = await service.findByID(clase.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(clase.id);
    expect(result.name).toEqual(clase.name);
    expect(result.code).toEqual(clase.code);
    expect(result.creds).toEqual(clase.creds);
  });

  it('should not find a clase with invalid ID', async () => {
    await expect(service.findByID('non-existing-id')).rejects.toHaveProperty('message', 'The clase with the given id was not found');
  });
});
