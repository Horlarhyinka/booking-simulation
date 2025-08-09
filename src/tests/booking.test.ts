import { createBooking, deleteBooking } from '../controllers/booking';
import { AppDataSource } from '../config/db/data-source';
import validator from '../lib/validator';
import { DateTime } from 'luxon';
import { Booking } from '../models/booking';
import { Property } from '../models/property';

// Mock dependencies
jest.mock('../config/db/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

jest.mock('../lib/validator', () => ({
  __esModule: true,
  default: {
    validateBooking: jest.fn()
  }
}));

// Mock Luxon DateTime
const mockNow = DateTime.fromISO('2026-01-01T00:00:00.000Z', { zone: 'utc' });
if (!mockNow.isValid) {
  throw new Error('mockNow is not a valid Luxon DateTime');
}
jest.spyOn(DateTime, 'now').mockReturnValue(mockNow as DateTime<true>);

describe('Booking Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockPropertyRepo: any;
  let mockBookingRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockPropertyRepo = {
      findOne: jest.fn(),
    };

    mockBookingRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn()
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockImplementation((entity) => {
        if (entity === Property) return mockPropertyRepo;
        if (entity === Booking) return mockBookingRepo;
      });
  });

  describe('createBooking', () => {
    it('should return 400 if validation fails', async () => {
      (validator.validateBooking as jest.Mock).mockReturnValue({
        error: { message: 'Invalid data' }
      });

      await createBooking(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid data' });
    });

    it('should return 404 if property not found', async () => {
      (validator.validateBooking as jest.Mock).mockReturnValue({ error: null });
      mockPropertyRepo.findOne.mockResolvedValue(null);

      mockReq.body = {
        property_id: '123',
        start_date: '2026-01-05',
        end_date: '2026-01-10',
        user_name: 'John Doe'
      };

      await createBooking(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Property not found.' });
    });

    it('should return 201 when booking is successful', async () => {
      (validator.validateBooking as jest.Mock).mockReturnValue({ error: null });

      const mockProperty = {
        id: 'prop1',
        available_from: DateTime.fromISO('2026-01-01').toJSDate(),
        available_to: DateTime.fromISO('2026-01-15').toJSDate(),
        bookings: []
      };

      mockPropertyRepo.findOne.mockResolvedValue(mockProperty);

      const savedBooking = { id: 'bk1', user_name: 'John Doe' };
      mockBookingRepo.save.mockResolvedValue(savedBooking);

      mockReq.body = {
        property_id: 'prop1',
        start_date: '2026-01-05',
        end_date: '2026-01-10',
        user_name: 'John Doe'
      };

      await createBooking(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(savedBooking);
    });
  });

  describe('deleteBooking', () => {
    it('should return 404 if booking not found', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      mockReq.params.id = 'bk1';

      await deleteBooking(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('should return 200 when booking is deleted', async () => {
      const foundBooking = { id: 'bk1', user_name: 'John Doe' };
      mockBookingRepo.findOne.mockResolvedValue(foundBooking);

      mockReq.params.id = 'bk1';

      await deleteBooking(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(foundBooking);
    });
  });
});
