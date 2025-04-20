const Joi = require('joi');

const schema = Joi.object({ 
  email: Joi.string().email().required(), 
  password: Joi.string().min(6).required() 
});

const signup = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    const supabase = req.app.get('supabase');

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Check if user record already exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw userError;
    }

    // Only insert if user doesn't exist
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, email }]);

      if (insertError) {
        throw insertError;
      }
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };
    
    const supabase = req.app.get('supabase');
    const { data, error: sbErr } = await supabase.auth.signInWithPassword({ 
      email: value.email, 
      password: value.password 
    });
    
    if (sbErr) throw sbErr;
    const token = data.session.access_token;
    res.json({ token });
  } catch (e) { 
    next(e); 
  }
};

module.exports = {
  signup,
  login
}; 