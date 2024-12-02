import { Router, RequestHandler } from 'express';
import { addLocation, getLocations } from '../controllers/locationController';

const router = Router();

router.post('/', addLocation as RequestHandler);
router.get('/:userId', getLocations as RequestHandler);

export default router;