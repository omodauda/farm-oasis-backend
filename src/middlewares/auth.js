// import jwtr from '../utils/jwtr';
import jwt from 'jsonwebtoken';
import { errorMsg } from '../utils/response';
import { Auth } from '../database/models';

// eslint-disable-next-line consistent-return
export default async function authenticate(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization === undefined) {
    return errorMsg(res, 401, 'unauthorized request');
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      try {
        if (err) throw new Error(err);
        req.user = await Auth.findByPk(decoded.sub);
        // req.user.jti = decoded.jti;
        next();
      } catch (error) {
        return errorMsg(res, 500, error.message);
      }
    });
  } catch (error) {
    return errorMsg(res, 500, error.message);
  }
}
