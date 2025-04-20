const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  due_date: Joi.date().iso().required(),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').required(),
  category: Joi.string().allow('')
});

const createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const supabase = req.app.get('supabase');
    const { data, error: sbError } = await supabase
      .from('tasks')
      .insert([{
        ...req.body,
        user_id: req.user.sub
      }])
      .select()
      .single();

    if (sbError) throw sbError;
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const supabase = req.app.get('supabase');
    const { data, error: sbError } = await supabase
      .from('tasks')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .select()
      .single();

    if (sbError) throw sbError;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { error } = Joi.object({
      status: Joi.string().valid('pending', 'in_progress', 'completed').required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const supabase = req.app.get('supabase');
    const { data, error: sbError } = await supabase
      .from('tasks')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .select()
      .single();

    if (sbError) throw sbError;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
}; 