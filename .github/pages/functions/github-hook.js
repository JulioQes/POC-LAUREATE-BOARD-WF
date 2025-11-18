// ===========================
// GET → Para pruebas
// ===========================
export async function onRequestGet(context) {
  return new Response(
    JSON.stringify({
      status: "OK",
      message: "GitHub Pages Function is LIVE",
      usage: "Send POST requests to trigger the workflow",
      endpoint: context.request.url
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}


// ===========================
// POST → Dispara GitHub Actions (workflow_dispatch)
// ===========================
export async function onRequestPost(context) {
  try {
    const bodyText = await context.request.text();

    // Endpoint de GitHub Actions
    const githubWorkflowURL =
      "https://api.github.com/repos/JulioQes/POC-LAUREATE-BOARD/actions/workflows/gateway.yml/dispatches";

    // Llamada a GitHub Actions workflow_dispatch
    const response = await fetch(githubWorkflowURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${context.env.GH_PAT}`,
        "User-Agent": "GitHubPagesFunction"
      },
      body: JSON.stringify({
        event_type: "azure-devops-event",
        client_payload: { body: bodyText || "no-body" }
      })
    });

    const result = await response.text();

    return new Response(
      JSON.stringify({
        ok: response.ok,
        status: response.status,
        github_response: result
      }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || "Unknown error in function"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
