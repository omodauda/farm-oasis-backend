import jwtr from '../utils/jwtr';
import { errorMsg } from '../utils/response';
import { Auth } from '../database/models';

// eslint-disable-next-line consistent-return
export default async function authenticate(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization === undefined) {
    return errorMsg(res, 401, 'unauthorized request');
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwtr.verify(token, process.env.JWT_SECRET);
    req.user = await Auth.findByPk(decoded.sub);
    next();
  } catch (error) {
    return errorMsg(res, 500, 'internal server error');
  }
}
