const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle static HTML
    if (url.pathname === "/" || url.pathname === "/create") {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Nostr Activity Creator</title>
            <script type="module">
              import { initForm } from '/static/browser.js';
              window.initForm = initForm;
            </script>
            <style>
              body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui; }
              form { display: flex; flex-direction: column; gap: 1rem; }
              label { font-weight: bold; }
              .field { display: flex; flex-direction: column; gap: 0.5rem; }
              button { padding: 0.5rem 1rem; }
            </style>
          </head>
          <body>
            <h1>Create Activity Event</h1>
            <form id="activityForm">
              <div class="field">
                <label for="type">Activity Type:</label>
                <select name="type" id="type" required>
                  <option value="run">Run</option>
                  <option value="ride">Ride</option>
                  <option value="hike">Hike</option>
                  <option value="swim">Swim</option>
                  <option value="walk">Walk</option>
                  <option value="ski">Ski</option>
                  <option value="workout">Workout</option>
                </select>
              </div>
              
              <div class="field">
                <label for="title">Title:</label>
                <input type="text" id="title" required>
              </div>

              <div class="field">
                <label for="description">Description:</label>
                <textarea id="description"></textarea>
              </div>

              <div class="field">
                <label for="distance">Distance (meters):</label>
                <input type="number" id="distance" required>
              </div>

              <div class="field">
                <label for="duration">Duration (seconds):</label>
                <input type="number" id="duration" required>
              </div>

              <div class="field">
                <label for="elevation_gain">Elevation Gain (meters):</label>
                <input type="number" id="elevation_gain" required>
              </div>

              <div class="field">
                <label for="elevation_loss">Elevation Loss (meters):</label>
                <input type="number" id="elevation_loss" required>
              </div>

              <div class="field">
                <label>Privacy:</label>
                <label>
                  <input type="radio" name="privacy" value="public" checked> Public
                </label>
                <label>
                  <input type="radio" name="privacy" value="private"> Private
                </label>
              </div>

              <button type="submit">Create Activity Event</button>
            </form>

            <div id="result"></div>

          </body>
          <script>
              window.addEventListener('DOMContentLoaded', function() {
                // Initialize form after page and scripts are loaded
                window.initForm();
              });
            </script>
        </html>`,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    // Simplified server endpoint that just receives the event
    if (url.pathname === "/api/create-activity" && req.method === "POST") {
      try {
        const { event } = await req.json();
        
        // Here you would typically broadcast the event to relays
        // For now, just return the event
        return new Response(JSON.stringify({
          success: true,
          event,
        }), {
          headers: {
            "Content-Type": "application/json",
          },
        });

      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Handle static JS bundle
    if (url.pathname === "/static/browser.js") {
      const bundle = await Bun.build({
        entrypoints: ['./src/browser.ts'],
        minify: true,
      });

      return new Response(bundle.outputs[0], {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    }

    // Handle 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
