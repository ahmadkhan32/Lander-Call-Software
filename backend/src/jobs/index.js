import cron from 'node-cron';
import supabase from '../config/supabase.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Job: Mark overdue follow-ups
 * Runs every hour. Sets status='overdue' for pending follow-ups past due_at.
 */
async function markOverdueFollowUps() {
  logger.info('[job] Running markOverdueFollowUps');
  const { error, count } = await supabase
    .from('follow_ups')
    .update({ status: 'overdue', updated_at: new Date().toISOString() })
    .eq('status', 'pending')
    .lt('due_at', new Date().toISOString());

  if (error) {
    logger.error('[job] markOverdueFollowUps failed', { error: error.message });
  } else {
    logger.info('[job] markOverdueFollowUps complete', { updated: count });
  }
}

/**
 * Job: Send follow-up reminders
 * Runs every 15 minutes. Notifies agents of upcoming due follow-ups.
 */
async function sendFollowUpReminders() {
  logger.info('[job] Running sendFollowUpReminders');

  const in30min = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { data: dueFollowUps, error } = await supabase
    .from('follow_ups')
    .select('id, lead_id, assigned_agent_id, due_at, organization_id')
    .eq('status', 'pending')
    .gte('due_at', now)
    .lte('due_at', in30min)
    .is('reminder_sent_at', null);

  if (error) {
    logger.error('[job] sendFollowUpReminders query failed', { error: error.message });
    return;
  }

  for (const fu of dueFollowUps || []) {
    if (!fu.assigned_agent_id) continue;

    await supabase.from('notifications').insert({
      organization_id: fu.organization_id,
      recipient_id: fu.assigned_agent_id,
      type: 'in_app',
      category: 'follow_up',
      title: 'Follow-up due soon',
      body: `You have a follow-up due at ${new Date(fu.due_at).toLocaleTimeString()}`,
      link: `/follow-ups`,
    });

    await supabase
      .from('follow_ups')
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq('id', fu.id);
  }

  logger.info('[job] sendFollowUpReminders complete', { sent: (dueFollowUps || []).length });
}

export function startJobs() {
  cron.schedule(config.jobs.overdueSchedule, markOverdueFollowUps);
  cron.schedule(config.jobs.reminderSchedule, sendFollowUpReminders);
  logger.info('Background jobs scheduled', {
    overdue: config.jobs.overdueSchedule,
    reminders: config.jobs.reminderSchedule,
  });
}
