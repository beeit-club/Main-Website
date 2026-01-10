
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import EmailTemplateModel from '../models/admin/emailTemplate.model.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const TEMPLATE_VARIABLES = {
  'login-otp': {
    otp: 'string'
  },
  'application-received': {
    fullname: 'string',
    email: 'string',
    student_id: 'string'
  },
  'interview-scheduled': {
    fullname: 'string',
    schedule_title: 'string',
    start_time: 'string',
    end_time: 'string',
    interview_date: 'string',
    location: 'string',
    description: 'string'
  },
  'application-approved': {
    fullname: 'string',
    email: 'string',
    interview_notes: 'string'
  },
  'application-rejected': {
    fullname: 'string',
    interview_notes: 'string'
  },
  'event-registration-confirmed': {
    fullname: 'string',
    event_title: 'string',
    start_time: 'string',
    location: 'string',
    notes: 'string'
  },
  'event-reminder': {
    fullname: 'string',
    event_title: 'string',
    time_until: 'string',
    start_time: 'string',
    location: 'string'
  },
  'event-check-in-confirmation': {
    fullname: 'string',
    event_title: 'string',
    check_in_time: 'string'
  },
  'event-cancellation': {
    fullname: 'string',
    event_title: 'string',
    is_cancelled: 'boolean',
    new_start_time: 'string',
    new_location: 'string',
    reason: 'string'
  },
  'document-access-granted': {
    fullname: 'string',
    document_title: 'string',
    document_description: 'string'
  },
  'password-reset': {
    reset_code: 'string',
    expires_in: 'number',
    reset_link: 'string'
  },
  'welcome-email': {
    fullname: 'string',
    email: 'string'
  },
  'fee-reminder': {
    name: 'string',
    deadline: 'string',
    amount: 'number',
    days_remaining: 'string'
  }
};

async function updateVariables() {
  console.log('Starting variables update...');
  
  try {
    for (const [slug, variables] of Object.entries(TEMPLATE_VARIABLES)) {
      const existing = await EmailTemplateModel.getTemplateBySlug(slug);
      
      if (existing) {
        // Convert to array of objects for the variables field structure usually expected by frontend
        // Assuming structure: [{name: 'otp', type: 'string', required: true}, ...]
        const variablesArray = Object.entries(variables).map(([key, type]) => ({
          name: key,
          type: type,
          required: true // Default to required for system templates
        }));

        console.log(`Updating variables for: ${slug}`);
        await EmailTemplateModel.updateTemplate(existing.id, {
          variables: JSON.stringify(variablesArray)
        });
      } else {
        console.warn(`Template not found: ${slug}`);
      }
    }

    console.log('Variables updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateVariables();
