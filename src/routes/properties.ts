
import { Router } from "express";
import { addProperty, getProperties, getPropertyAvailability } from "../controllers/property";

const router = Router()


router.post('/', addProperty)
router.get('/:id/availability', getPropertyAvailability)
router.get('/', getProperties)
/**
 * @openapi
 * /properties:
 *   post:
 *     summary: Add new property
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Spacious 2-bedroom flat
 *               description:
 *                 type: string
 *                 example: Spacious bedroom with 23 hours power supply
 *               price_per_night:
 *                 type: number
 *                 example: 120000
 *               available_from: 
 *                 type: string
 *                 example: 2026-01-01
 *               available_to:
 *                 type: string
 *                 example: 2026-01-09
 *     responses:
 *       201:
 *         description: New property has been added to property listings
 */

/**
 * @openapi
 * /properties:
 *   get:
 *     summary: Get Properties
 *     parameters:
 *       - in: query
 *         name: available_on
 *         schema:
 *           type: string
 *           example: 2026-01-02
 *         description: Date string to filter available properties. If not provided, all properties will be fetched and paginated.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (defaults to 1).
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of properties per page (defaults to 10).
 *     responses:
 *       200:
 *         description: Properties have been retrieved
 */


/**
 * @openapi
 * /properties/{id}/availability:
 *   get:
 *     summary: Retrieves the availability date range of the selected property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the property whose availability is to be retrieved
 *     responses:
 *       200:
 *         description: Property availabilities retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: string
 *                     format: date
 *                     example: 2025-01-01
 *                   to:
 *                     type: string
 *                     format: date
 *                     example: 2025-01-03
 */



export default router