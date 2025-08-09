
import { Router } from 'express';
import { createBooking, deleteBooking } from '../controllers/booking';

const router = Router()


router.post('/', createBooking)
router.delete('/:id', deleteBooking)

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

/**
 * @openapi
 * /bookings/{id}:
 *   delete:
 *     summary: Delete/Cancel booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the booking to be deleted
 *     responses:
 *       200:
 *         description: Booking has been deleted
 *       404:
 *         description: Booking not found
 */


export default router