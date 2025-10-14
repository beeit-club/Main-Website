import * as AuthMessage from './auth.message.js';
import * as AuthCode from './auth.code.js';
import * as UserMessage from './user.message.js';
import * as UserCode from './user.code.js';
import * as CateMessage from './category.message.js';
import * as TagMessage from './tag.message.js';
import * as TagCode from './tag.code.js';
import * as CateCode from './category.code.js';
import * as document_category from './document_category.message.js';
import * as document_category_code from './document_category.code.js';
import * as documents from './document.message.js';
import * as documents_code from './document.code.js';
import * as EventMess from './event.message.js';
import * as EventCode from './event.code.js';

export const message = {
  Auth: AuthMessage,
  User: UserMessage,
  Cate: CateMessage,
  Tag: TagMessage,
  DOCCA: document_category,
  Doc: documents,
  Event: EventMess,
};

export const code = {
  Auth: AuthCode,
  User: UserCode,
  Cate: CateCode,
  Tag: TagCode,
  DOCCA: document_category_code,
  Doc: documents_code,
  Event: EventCode,
};
