const cron = require('node-cron');

// Schedule the job to run at 9 AM every day
const scheduleDailyDigest = (app) => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const sb = app.get('supabase');
      
      // Get all users
      const { data: users, error: usersError } = await sb
        .from('users')
        .select('id, email');

      if (usersError) throw usersError;

      // For each user, generate their daily digest
      for (const user of users) {
        // Get overdue tasks
        const { data: overdueTasks } = await sb
          .from('tasks')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('user_id', user.id)
          .eq('status', 'overdue');

        // Get today's tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayTasks } = await sb
          .from('tasks')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('user_id', user.id)
          .gte('due_date', today.toISOString())
          .lt('due_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
          .neq('status', 'completed');

        // Get task statistics
        const { count: totalTasks } = await sb
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: completedTasks } = await sb
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed');

        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Here you would typically send an email with this information
        // For now, we'll just log it
        console.log('Daily Digest for user:', user.email);
        console.log('Overdue Tasks:', overdueTasks?.length || 0);
        console.log('Today\'s Tasks:', todayTasks?.length || 0);
        console.log('Completion Rate:', completionRate.toFixed(2) + '%');
        console.log('-------------------');
      }
    } catch (error) {
      console.error('Error in daily digest job:', error);
    }
  });
};

module.exports = scheduleDailyDigest; 