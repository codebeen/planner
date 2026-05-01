import { supabase } from "../../../../lib/supabaseClient";

// GET single note
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { data, error } = await supabase
        .from("Notes")
        .select('note_id, title, content, user_id')
        .eq("note_id", id)
        .single();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}

// UPDATE note
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
        .from("Notes")
        .update({
            title: body.title,
            content: body.content,
        })
        .eq("note_id", id)
        .select('note_id, title, content, user_id');

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data[0]);
}

// DELETE note
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { error } = await supabase
        .from("Notes")
        .delete()
        .eq("note_id", id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Deleted successfully" });
}
