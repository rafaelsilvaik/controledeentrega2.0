import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.send('Hello, Supabase!');
});

// Additional routes and services can be configured here

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});