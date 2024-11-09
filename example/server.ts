import { serve } from "bun";
import { sampleActivities } from "./index";

const server = serve({
  port: 3001,
  fetch(req) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Activity Tracker</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f5f5f5;
              }
              .activity-card {
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .activity-title {
                  font-size: 1.5em;
                  color: #333;
                  margin-bottom: 10px;
              }
              .activity-type {
                  display: inline-block;
                  padding: 4px 8px;
                  background: #e0e0e0;
                  border-radius: 4px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
              }
              .metrics {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                  gap: 10px;
                  margin: 15px 0;
              }
              .metric {
                  background: #f8f8f8;
                  padding: 10px;
                  border-radius: 4px;
              }
              .metric-label {
                  color: #666;
                  font-size: 0.9em;
              }
              .metric-value {
                  font-size: 1.1em;
                  font-weight: bold;
              }
              .images {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                  gap: 10px;
                  margin-top: 15px;
              }
              .images img {
                  width: 100%;
                  height: 400px;
                  max-width: 600px;
                  border-radius: 4px;
                  object-fit: cover;
              }
          </style>
      </head>
      <body>
          <h1>Activity Tracker</h1>
          ${sampleActivities.map(activity => `
              <div class="activity-card">
                  <div class="activity-title">${activity.title}</div>
                  <div class="activity-type">${activity.type}</div>
                  <div class="activity-description">${activity.description}</div>
                  <div class="metrics">
                      <div class="metric">
                          <div class="metric-label">Distance</div>
                          <div class="metric-value">${(activity.metrics.distance / 1000).toFixed(2)} km</div>
                      </div>
                      <div class="metric">
                          <div class="metric-label">Duration</div>
                          <div class="metric-value">${Math.floor(activity.metrics.duration / 60)} min</div>
                      </div>
                      <div class="metric">
                          <div class="metric-label">Avg Speed</div>
                          <div class="metric-value">${activity.metrics.average_speed.toFixed(1)} m/s</div>
                      </div>
                      <div class="metric">
                          <div class="metric-label">Elevation Gain</div>
                          <div class="metric-value">${activity.metrics.elevation_gain}m</div>
                      </div>
                  </div>
                  <div class="images">
                      ${activity.images?.map(img => `
                          <img src="${img}" alt="Activity image">
                      `).join('')}
                  </div>
              </div>
          `).join('')}
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Server running at http://localhost:3001`); 