import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

// Hardcoded user_id (replace with real auth later)
const HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001";

// GET all food logs for a user, optionally filtered by date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id') || HARDCODED_USER_ID;
  const date = searchParams.get('date');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let query = supabase
    .from('FoodLogs')
    .select('food_log_id, food, category, calories, date_time')
    .eq('user_id', userId);

  if (start && end) {
    query = query.gte('date_time', start).lte('date_time', end);
  } else if (date) {
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;
    query = query.gte('date_time', startOfDay).lte('date_time', endOfDay);
  }

  const { data, error } = await query.order('date_time', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// CREATE food log
export async function POST(req: Request) {
  const body = await req.json();
  const { food, category, calories, date_time, user_id } = body;

  const { data, error } = await supabase
    .from('FoodLogs')
    .insert([
      {
        food,
        category,
        calories: parseFloat(calories) || 0,
        date_time: date_time || new Date().toISOString(),
        user_id: user_id || HARDCODED_USER_ID,
      },
    ])
    .select('food_log_id, food, category, calories, date_time');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data[0], { status: 201 });
}
