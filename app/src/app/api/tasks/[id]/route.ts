import { supabase } from "../../../../lib/supabaseClient";

// GET single task
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { data, error } = await supabase
        .from("Tasks")
        .select('task_id, name, task_date, start_time, end_time, is_done, user_id')
        .eq("task_id", id)
        .single();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}

// UPDATE task
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
        .from("Tasks")
        .update({
            name: body.name,
            task_date: body.task_date,
            start_time: body.start_time,
            end_time: body.end_time,
            is_done: body.is_done,
        })
        .eq("task_id", id)
        .select('task_id, name, task_date, start_time, end_time, is_done, user_id');

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data[0]);
}

// DELETE task
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { error } = await supabase
        .from("Tasks")
        .delete()
        .eq("task_id", id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Deleted successfully" });
}
