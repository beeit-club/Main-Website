
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import EmailQueueModel from '../models/admin/emailQueue.model.js';
import EmailCampaignModel from '../models/admin/emailCampaign.model.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function debugQueue() {
  console.log('--- DEBUGGING EMAIL QUEUE ---');

  // 1. Check Campaigns
  const campaigns = await EmailCampaignModel.getAll({ limit: 100 });
  console.log(`Found ${campaigns.data.length} campaigns:`);
  campaigns.data.forEach(c => {
    console.log(`- ID: ${c.id}, Name: ${c.name}, Status: ${c.status}, Total: ${c.total_recipients}`);
  });

  // 2. Check Pending Items via Model
  const pending = await EmailQueueModel.getPendingItems(10);
  console.log(`\nPending Items (ready to process): ${pending.length}`);
  pending.forEach(p => {
    console.log(`- ID: ${p.id}, Email: ${p.recipient_email}, Status: ${p.status}`);
  });

  process.exit(0);
}

debugQueue();
