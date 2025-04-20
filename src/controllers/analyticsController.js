const getTaskStats = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    
    // Get total tasks count
    const { count: totalTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.sub);

    // Get tasks by status
    const { data: statusStats } = await supabase
      .from('tasks')
      .select('status, count(*)')
      .eq('user_id', req.user.sub)
      .group('status');

    // Get tasks by priority
    const { data: priorityStats } = await supabase
      .from('tasks')
      .select('priority, count(*)')
      .eq('user_id', req.user.sub)
      .group('priority');

    // Get tasks by category
    const { data: categoryStats } = await supabase
      .from('tasks')
      .select('category, count(*)')
      .eq('user_id', req.user.sub)
      .group('category');

    res.json({
      totalTasks,
      statusStats,
      priorityStats,
      categoryStats
    });
  } catch (error) {
    next(error);
  }
};

const getTaskTrends = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    
    // Get tasks created per day for the last 30 days
    const { data: creationTrends } = await supabase
      .from('tasks')
      .select('created_at')
      .eq('user_id', req.user.sub)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    // Get tasks completed per day for the last 30 days
    const { data: completionTrends } = await supabase
      .from('tasks')
      .select('updated_at')
      .eq('user_id', req.user.sub)
      .eq('status', 'completed')
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('updated_at', { ascending: true });

    res.json({
      creationTrends,
      completionTrends
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTaskStats,
  getTaskTrends
}; 