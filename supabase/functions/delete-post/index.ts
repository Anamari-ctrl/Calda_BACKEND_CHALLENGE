import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req) => {
    try {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { db: { schema: 'mydb' } }
    );

    const body = await req.json();
    const userId = body.userId;

    const { data: userPosts, error } = await supabase
        .from("posts")
        .select("post_id, content, post_date")
        .eq("user_id", userId);

    if (error) {
      throw error;
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    for (const post of userPosts) {
      const postDate = new Date(post.post_date);
      if (postDate < oneHourAgo) {
        await supabase.from("posts").delete().eq("post_id", post.post_id);
      }
    }

    let totalWords = 0;
    userPmydb.osts.forEach((post) => {
      totalWords += post.content.split(/\s+/).length;
    });

    return new Response(JSON.stringify({ totalWords }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});