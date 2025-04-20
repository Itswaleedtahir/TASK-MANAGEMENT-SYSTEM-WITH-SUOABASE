const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).allow('')
});

const createCategory = async (req, res, next) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const supabase = req.app.get('supabase');
    const { data, error: sbError } = await supabase
      .from('categories')
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

const getCategories = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const supabase = req.app.get('supabase');
    const { data, error: sbError } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .select()
      .single();

    if (sbError) throw sbError;
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    
    // First check if category exists and belongs to user
    const { data: category, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub)
      .single();

    if (checkError) throw checkError;
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update tasks to remove category reference
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ category_id: null })
      .eq('category_id', req.params.id)
      .eq('user_id', req.user.sub);

    if (updateError) throw updateError;

    // Delete the category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.sub);

    if (deleteError) throw deleteError;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCategoryTasks = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category_id', req.params.id)
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTasks
}; 