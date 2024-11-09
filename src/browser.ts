import {
  ActivityBuilder,
  ActivityData,
  ActivityType,
  generateSecretKey,
} from "../lib";

export const initForm = () => {
  const activityForm = document.getElementById("activityForm");
  if (activityForm) {
    activityForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Generate keys client-side
      const secretKey = generateSecretKey();

      const activityData = {
        type: (
          document.getElementById("type") as HTMLSelectElement
        ).value as ActivityType,
        title: (document.getElementById("title") as HTMLInputElement).value,
        description: (
          document.getElementById("description") as HTMLInputElement
        ).value,
        metrics: {
          distance: Number(
            (document.getElementById("distance") as HTMLInputElement).value
          ),
          duration: Number(
            (document.getElementById("duration") as HTMLInputElement).value
          ),
          elevation_gain: Number(
            (document.getElementById("elevation_gain") as HTMLInputElement).value
          ),
          elevation_loss: Number(
            (document.getElementById("elevation_loss") as HTMLInputElement).value
          ),
          average_speed:
            Number(
              (document.getElementById("distance") as HTMLInputElement).value
            ) /
              Number(
                (document.getElementById("duration") as HTMLInputElement).value
              ),
          max_speed: 0,
        },
        recordedAt: Math.floor(Date.now() / 1000),
      } satisfies ActivityData;

      // Generate the event client-side
      const isPrivate =
        (document.querySelector(
          'input[name="privacy"]:checked'
        ) as HTMLInputElement).value === "private";
      const event = isPrivate
        ? ActivityBuilder.createPrivateEvent(activityData, secretKey)
        : ActivityBuilder.createPublicEvent(activityData, secretKey);

      // Send the generated event to the server
      const response = await fetch("/api/create-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event }),
      });

      const result = await response.json();
      (document.getElementById("result") as HTMLDivElement).innerHTML =
        "<pre>" + JSON.stringify(result, null, 2) + "</pre>";
    });
  }
};
