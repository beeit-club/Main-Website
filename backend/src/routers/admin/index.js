import express from 'express';
import { checkAdmin } from '../../middlewares/role.handler.js';
import userRouter from './user.router.js';
import postRouter from './post.router.js';
import tagsRouter from './tags.router.js';
import categoryRouter from './categories.router.js';
import document_categoriesRouter from './document_categories.router.js';
import documents from './document.router.js';
import questionRouter from './question.router.js';
import answerRouter from './answer.router.js';
import enven from './event.router.js';
import applicationRouter from './application.router.js';
import transactionRouter from './transaction.router.js';
import interviewsRouter from './interview.router.js';
import roleRouter from './role.router.js';
import permissionRouter from './permission.router.js';
import emailTemplateRouter from './emailTemplate.router.js';
import emailLogRouter from './emailLog.router.js';
import dashboardRouter from './dashboard.router.js';
import emailVariableRouter from './emailVariable.router.js';
import memoryFlowRouter from './memoryFlow.router.js';
import founderRouter from './founder.router.js';
import userController from '../../controllers/admin/user.controller.js';
import memberRouter from './member.router.js';
import campaignRouter from './campaign.routes.js';
const router = express.Router();

// Tất cả routes admin đều yêu cầu Admin hoặc Super Admin
router.use(checkAdmin);

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagsRouter);
router.use('/documentCategory', document_categoriesRouter);
router.use('/documents', documents);
router.use('/events', enven);
router.use('/transactions', transactionRouter);
router.use('/interviews', interviewsRouter);

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);
router.use('/applications', applicationRouter);

// Email Templates & Bulk Email
router.use('/email-templates', emailTemplateRouter);
router.use('/email-logs', emailLogRouter);
router.use('/campaigns', campaignRouter);
router.use('/email-variables', emailVariableRouter);

// Dashboard
router.use('/dashboard', dashboardRouter);

// Role và Permission management (chỉ Super Admin)
router.use('/roles', roleRouter);
router.use('/permissions', permissionRouter);

// Route cũ để lấy danh sách roles (cho filter, không cần super admin)
router.get('/roles-list', userController.getAllRoles);

// Landing Page Content Management
router.use('/memory-flow', memoryFlowRouter);
router.use('/founders', founderRouter);

// Members CRUD (sử dụng router riêng để tránh conflict)
router.use('/members', memberRouter);

// BeeIT Landing Page Management
import beeitHeroRouter from './beeitHero.router.js';
import beeitStatRouter from './beeitStat.router.js';
import beeitFooterRouter from './beeitFooter.router.js';
import beeitEmailSubmissionRouter from './beeitEmailSubmission.router.js';
import beeitLeaderRouter from './beeitLeader.router.js';
import beeitAchievementRouter from './beeitAchievement.router.js';
import beeitBehindSceneRouter from './beeitBehindScene.router.js';
import systemEmailMappingRouter from './systemEmailMapping.router.js';

router.use('/beeit/hero', beeitHeroRouter);
router.use('/beeit/stats', beeitStatRouter);
router.use('/beeit/footer', beeitFooterRouter);
router.use('/beeit/email-submissions', beeitEmailSubmissionRouter);
router.use('/beeit/leaders', beeitLeaderRouter);
router.use('/beeit/achievements', beeitAchievementRouter);
router.use('/beeit/photos', beeitBehindSceneRouter);

// Email Mappings
router.use('/email-mappings', systemEmailMappingRouter);

export default router;
