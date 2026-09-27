import { Server } from 'socket.io';
import { Request } from 'express';
import { emitToAdmins, emitToUser } from '../services/socket';

interface ExpressRequest extends Request {
  app?: {
    get: (key: string) => Server | undefined;
  };
}

export const getIO = (req: ExpressRequest): Server | undefined => {
  return req.app?.get('io') as Server | undefined;
};

export const emitSocketEvent = {
  new_user_registered: (req: ExpressRequest, user: unknown) => {
    const io = getIO(req);
    if (io) emitToAdmins(io, 'NEW_USER_REGISTERED', user);
  },

  new_product_registered: (req: ExpressRequest, product: unknown) => {
    const io = getIO(req);
    if (io) emitToAdmins(io, 'NEW_PRODUCT_REGISTERED', product);
  },

  product_status_updated: (req: ExpressRequest, product: unknown) => {
    const io = getIO(req);
    if (io) {
      emitToAdmins(io, 'PRODUCT_STATUS_UPDATED', product);
      if (product && typeof product === 'object' && 'userId' in product) {
        const userId = (product as { userId?: { _id?: string; toString?: () => string } }).userId;
        if (userId) {
          emitToUser(io, userId._id?.toString() || userId.toString(), 'PRODUCT_STATUS_UPDATED', product);
        }
      }
    }
  },

  new_support_request: (req: ExpressRequest, request: unknown) => {
    const io = getIO(req);
    if (io) emitToAdmins(io, 'NEW_SUPPORT_REQUEST', request);
  },

  learning_content_updated: (req: ExpressRequest, content: unknown) => {
    const io = getIO(req);
    if (io) emitToAll(io, 'LEARNING_CONTENT_UPDATED', content);
  },

  scheme_updated: (req: ExpressRequest, scheme: unknown) => {
    const io = getIO(req);
    if (io) emitToAll(io, 'SCHEME_UPDATED', scheme);
  },

  new_market_request: (req: ExpressRequest, request: unknown) => {
    const io = getIO(req);
    if (io) emitToAdmins(io, 'NEW_MARKET_REQUEST', request);
  },

  new_buyer_request: (req: ExpressRequest, buyer: unknown) => {
    const io = getIO(req);
    if (io) emitToAdmins(io, 'NEW_BUYER_REQUEST', buyer);
  },
};
