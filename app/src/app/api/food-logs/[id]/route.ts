import { supabase } from "../../../../lib/supabaseClient";

// GET single food log
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { data, error } = await supabase
        .from("FoodLogs")
        .select('food_log_id, food, category, calories, date_time')
        .eq("food_log_id", id)
        .single();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}

// UPDATE food log
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
        .from("FoodLogs")
        .update({
            food: body.food,
            category: body.category,
            calories: parseFloat(body.calories) || 0,
            date_time: body.date_time,
        })
        .eq("food_log_id", id)
        .select();

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data[0]);
}

// DELETE food log
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const { error } = await supabase
        .from("FoodLogs")
        .delete()
        .eq("food_log_id", id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Deleted successfully" });
}
