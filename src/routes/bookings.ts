
import { Router } from 'express';
import { createBooking } from '../controllers/booking';

const router = Router()


router.post('/', createBooking)


/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create booking for a property
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: string
 *               user_name:
 *                 type: string
 *                 example: John Smith
 *               start_date: 
 *                 type: string
 *                 example: 2026-01-01
 *               end_date:
 *                 type: string
 *                 example: 2026-01-02
 *     responses:
 *       201:
 *         description: New booking has been created
 */

export default router