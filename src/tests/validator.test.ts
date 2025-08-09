import Validator from "../lib/validator";

describe('Validator', () => {
  describe('validateProperty', () => {
    it('should pass validation with a valid payload', () => {
      const payload = {
        title: 'Cozy Apartment',
        description: 'A nice apartment near the beach',
        price_per_night: 120,
        available_from: '2025-08-10',
        available_to: '2025-08-20',
      };

      const { error, value } = Validator.validateProperty(payload);
      expect(error).toBeUndefined();
      expect(value).toEqual(payload);
    });

    it('should fail validation with a missing field', () => {
      const payload = {
        title: 'Cozy Apartment',
        description: 'A nice apartment near the beach',
        // price_per_night missing
        available_from: '2025-08-10',
        available_to: '2025-08-20',
      };

      const { error } = Validator.validateProperty(payload);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/price_per_night/);
    });
  });

  describe('validateBooking', () => {
    it('should pass validation with a valid payload', () => {
      const payload = {
        user_name: 'John Doe',
        property_id: 'abc123',
        start_date: '2025-08-12',
        end_date: '2025-08-15',
      };

      const { error, value } = Validator.validateBooking(payload);
      expect(error).toBeUndefined();
      expect(value).toEqual(payload);
    });

    it('should fail validation with a missing field', () => {
      const payload = {
        user_name: 'John Doe',
        // property_id missing
        start_date: '2025-08-12',
        end_date: '2025-08-15',
      };

      const { error } = Validator.validateBooking(payload);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toMatch(/property_id/);
    });
  });
});


