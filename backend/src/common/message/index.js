import * as AuthMessage from './auth.message.js';
import * as AuthCode from './auth.code.js';
import * as UserMessage from './user.message.js';
import * as UserCode from './user.code.js';

export const message = {
  Auth: AuthMessage,
  User: UserMessage,
};

export const code = {
  Auth: AuthCode,
  User: UserCode,
};
