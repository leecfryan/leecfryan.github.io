window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const statusEl = document.getElementById("form-status");

  if (!form || !statusEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        statusEl.textContent = "Sent! I’ll get back to you soon.";
        form.reset();
        return;
      }

      let msg = "Couldn’t send. Please try again.";
      try {
        const data = await res.json();
        if (data?.errors?.length)
          msg = data.errors.map((e) => e.message).join(", ");
      } catch (_) {}

      statusEl.textContent = msg;
    } catch (err) {
      console.error(err);
      statusEl.textContent =
        "Network error (often happens on file://). Try using Live Server or deploy the site.";
    }
  });
});
