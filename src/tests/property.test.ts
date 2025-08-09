import { addProperty, getProperties, getPropertyAvailability } from '../controllers/property';
import { AppDataSource } from '../config/db/data-source';
import validator from '../lib/validator';
import { DateTime } from 'luxon';

jest.mock('../config/db/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

jest.mock('../lib/validator', () => ({
  __esModule: true,
  default: {
    validateProperty: jest.fn()
  }
}));

describe('Property Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockRepo: any;

  beforeEach(() => {
    mockReq = { body: {}, query: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockRepo = {
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn()
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    jest.clearAllMocks();
  });

  describe('addProperty', () => {
    it('should return 400 if validation fails', async () => {
      (validator.validateProperty as jest.Mock).mockReturnValue({ error: { message: 'Invalid' } });
      await addProperty(mockReq, mockRes, jest.fn());
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid' });
    });

    it('should save property and return 201 on success', async () => {
      mockReq.body = {
        title: 'Test',
        description: 'Test desc',
        price_per_night: 100,
        available_from: '2025-08-10',
        available_to: '2025-08-20'
      };
      (validator.validateProperty as jest.Mock).mockReturnValue({ error: null });
      mockRepo.save.mockResolvedValue({ id: '123', ...mockReq.body });

      await addProperty(mockReq, mockRes, jest.fn());

      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }));
    });

    it('should return 400 if available_from >= available_to', async () => {
      mockReq.body = {
        title: 'Test',
        description: 'Test desc',
        price_per_night: 100,
        available_from: '2025-08-20',
        available_to: '2025-08-10'
      };
      (validator.validateProperty as jest.Mock).mockReturnValue({ error: null });

      await addProperty(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Available to date must be greater than Available from date' });
    });
  });

  describe('getProperties', () => {
    it('should return paginated list when available_on is not provided', async () => {
      mockReq.query = { page: '1', size: '2' };
      mockRepo.find.mockResolvedValue([{ id: '1' }, { id: '2' }]);
      mockRepo.count.mockResolvedValue(2);

      await getProperties(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ total: 2 }));
    });

    it('should filter properties by available_on date', async () => {
      const qb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 'filtered' }], 1])
      };
      mockRepo.createQueryBuilder.mockReturnValue(qb);
      mockReq.query = { available_on: '2025-08-15', page: '1', size: '10' };

      await getProperties(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ total: 1 }));
    });
  });

  describe('getPropertyAvailability', () => {
    it('should return 404 if property is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockReq.params.id = 'abc';

      await getPropertyAvailability(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Property not found' });
    });

    it('should return availability when no bookings', async () => {
      mockReq.params.id = 'abc';
      mockRepo.findOne.mockResolvedValue({
        available_from: new Date('2025-08-15'),
        available_to: new Date('2025-08-20'),
        bookings: []
      });

      await getPropertyAvailability(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return empty array if available_to date has passed', async () => {
      mockReq.params.id = 'abc';
      mockRepo.findOne.mockResolvedValue({
        available_from: new Date('2020-01-01'),
        available_to: new Date('2020-01-05'),
        bookings: []
      });

      await getPropertyAvailability(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });
});
