import { Router } from 'express';
// import validator from '../../validator/validator';

const router = Router();

// router.post(
//     '/example',
//     validator(examplevalidator.webhook, { headers: true }, true),
//     examplecontroller.webhook,
// );

export default (app: Router) => app.use('/example', router);
