import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

// GET all notes by user_id (query param)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  const { data, error } = await supabase
    .from('Notes')
    .select('note_id, title, content, user_id')
    .eq('user_id', userId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// CREATE note
export async function POST(req: Request) {
  const body = await req.json();

  const { title, content, user_id } = body;
  const { data, error } = await supabase
    .from('Notes')
    .insert([{ title, content, user_id }])
    .select('note_id, title, content, user_id');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data[0], { status: 201 });
}