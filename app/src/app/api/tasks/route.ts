import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

// Hardcoded user_id (replace with real auth later)
const HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001";

// GET all tasks for a user, optionally filtered by month or date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id') || HARDCODED_USER_ID;
  const date = searchParams.get('date'); // YYYY-MM-DD
  const month = searchParams.get('month'); // MM
  const year = searchParams.get('year'); // YYYY

  let query = supabase
    .from('Tasks')
    .select('task_id, name, task_date, start_time, end_time, is_done, user_id')
    .eq('user_id', userId);

  if (date) {
    query = query.eq('task_date', date);
  } else if (month && year) {
    // Filter for the entire month
    const startOfMonth = `${year}-${month.padStart(2, '0')}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endOfMonth = `${year}-${month.padStart(2, '0')}-${lastDay}`;
    query = query.gte('task_date', startOfMonth).lte('task_date', endOfMonth);
  }

  const { data, error } = await query.order('start_time', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// CREATE task
export async function POST(req: Request) {
  const body = await req.json();
  const { name, task_date, start_time, end_time, is_done, user_id } = body;

  const { data, error } = await supabase
    .from('Tasks')
    .insert([
      {
        name,
        task_date,
        start_time,
        end_time: end_time || null,
        is_done: is_done || false,
        user_id: user_id || HARDCODED_USER_ID,
      },
    ])
    .select('task_id, name, task_date, start_time, end_time, is_done, user_id');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data[0], { status: 201 });
}
