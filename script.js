/* ==========================================================================
   Akshit — Portfolio interactions
   Theme switch, scroll reveals, active navigation, weather, project search.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;

  /* ------------------------------------------------------------------------
     Theme switch
     ------------------------------------------------------------------------ */

  const THEME_KEY = "portfolio-theme";
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeToggleLabel");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* Private browsing can block storage — the switch still works. */
    }
  }

  function applyTheme(theme, persist) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

<<<<<<< HEAD
});
const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");
weatherButton.addEventListener("click", getWeather);
async function getWeather() {
=======
    if (themeLabel) {
      themeLabel.textContent = isDark ? "Dark" : "Light";
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#060d18" : "#f5f7fb");
    }

    if (persist) {
      storeTheme(isDark ? "dark" : "light");
    }
  }

  applyTheme(root.dataset.theme === "dark" ? "dark" : "light", false);

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next, true);
  });

  systemTheme.addEventListener?.("change", (event) => {
    if (!readStoredTheme()) {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  });

  /* ------------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------------ */

  const revealTargets = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealTargets.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------------
     Active navigation link
     ------------------------------------------------------------------------ */

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const linkBySection = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  if ("IntersectionObserver" in window && linkBySection.size > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => link.removeAttribute("aria-current"));
          const activeLink = linkBySection.get(entry.target.id);
          if (activeLink) {
            activeLink.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    document.querySelectorAll("main section[id], footer[id]").forEach((section) => {
      navObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Profile image fallback
     ------------------------------------------------------------------------ */

  document.querySelectorAll(".profile-image").forEach((image) => {
    const markMissing = () => image.classList.add("is-missing");

    if (image.complete && image.naturalWidth === 0) {
      markMissing();
    } else {
      image.addEventListener("error", markMissing);
    }
  });

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     Project search
     ------------------------------------------------------------------------ */

  const projectSearch = document.getElementById("projectSearch");
  const projectCards = document.querySelectorAll(".project-card");
  const projectSearchEmpty = document.getElementById("projectSearchEmpty");

  function filterProjects() {
    const query = projectSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const title = card.querySelector(".project-title")?.textContent || "";
      const description = card.querySelector(".project-description")?.textContent || "";
      const technologies =
        card.dataset.technologies ||
        card.querySelector(".project-tech")?.textContent ||
        "";
      const haystack = `${title} ${description} ${technologies}`.toLowerCase();
      const matches = query === "" || haystack.includes(query);

      card.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    if (projectSearchEmpty) {
      projectSearchEmpty.hidden = visibleCount > 0;
    }
  }

  projectSearch?.addEventListener("input", filterProjects);

  /* ------------------------------------------------------------------------
     Weather
     ------------------------------------------------------------------------ */

  const weatherForm = document.getElementById("weatherForm");
  const weatherButton = document.getElementById("weatherButton");
  const cityInput = document.getElementById("cityInput");
  const weatherResult = document.getElementById("weatherResult");

  function setWeatherMessage(message, isError = false) {
    if (!weatherResult) return;

    weatherResult.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.className = isError
      ? "weather__message weather__error"
      : "weather__message";
    paragraph.textContent = message;
    weatherResult.append(paragraph);
  }

  function renderWeather(data) {
    if (!weatherResult) return;

    const card = document.createElement("div");
    card.className = "weather__card";

    const head = document.createElement("div");
    head.className = "weather__head";

    const place = document.createElement("h3");
    place.textContent = data?.name || "Unknown location";

    const condition = document.createElement("p");
    condition.className = "weather__condition";
    condition.textContent = data?.weather?.[0]?.description || "Current conditions";

    head.append(place, condition);

    const temperature = document.createElement("p");
    temperature.className = "weather__temp";
    temperature.textContent = `${Math.round(data.main.temp)}\u00B0C`;

    const meta = document.createElement("p");
    meta.className = "weather__meta";
    const details = [];

    if (typeof data.main?.feels_like === "number") {
      details.push(`Feels like ${Math.round(data.main.feels_like)}\u00B0C`);
    }
    if (typeof data.main?.humidity === "number") {
      details.push(`${data.main.humidity}% humidity`);
    }
    if (typeof data.wind?.speed === "number") {
      details.push(`${Math.round(data.wind.speed * 3.6)} km/h wind`);
    }

    meta.textContent = details.join(" \u00B7 ");
    if (!meta.textContent) {
      meta.remove();
    }

    card.append(head, temperature, meta);
    weatherResult.replaceChildren(card);
  }

  async function getWeather() {
    if (!cityInput || !weatherButton) return;
>>>>>>> 60b8458 (Updates Added)

    const city = cityInput.value.trim();

    if (!city) {
      setWeatherMessage("Please enter a city.", true);
      cityInput.focus();
      return;
    }

    if (typeof CONFIG !== "undefined" && CONFIG.ready) {
      await CONFIG.ready;
    }

<<<<<<< HEAD
    if (typeof CONFIG !== "undefined" && CONFIG.ready) {
        await CONFIG.ready;
    }

    const apiKey = typeof CONFIG !== "undefined" ? CONFIG.weatherApiKey : "";

    if (!apiKey) {
        weatherResult.textContent =
            "Weather is unavailable because the API key is not configured.";
        return;
    }
=======
    const apiKey = typeof CONFIG !== "undefined" ? CONFIG.weatherApiKey : "";

    if (!apiKey) {
      setWeatherMessage(
        "Weather is unavailable because the API key is not configured.",
        true
      );
      return;
    }

    const originalLabel = weatherButton.textContent;
    weatherButton.disabled = true;
    weatherButton.textContent = "Checking\u2026";
    setWeatherMessage("Loading weather\u2026");
>>>>>>> 60b8458 (Updates Added)

    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${encodeURIComponent(apiKey)}` +
      "&units=metric";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("We couldn't find that city. Check the spelling and try again.");
        }
        throw new Error("The weather service is unavailable right now. Please try again.");
      }

      renderWeather(await response.json());
    } catch (error) {
      console.error("Weather error:", error);
      setWeatherMessage(
        error.message || "Unable to fetch weather. Please try again.",
        true
      );
    } finally {
      weatherButton.disabled = false;
      weatherButton.textContent = originalLabel;
    }
<<<<<<< HEAD
}

const projectSearch = document.getElementById("projectSearch");
const projectCards = document.querySelectorAll(".project-card");
const projectSearchEmpty = document.getElementById("projectSearchEmpty");

if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
}

function filterProjects() {
    const query = projectSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(function (card) {
        const title = card.querySelector(".project-title")?.textContent || "";
        const description = card.querySelector(".project-description")?.textContent || "";
        const technologies = card.dataset.technologies || card.querySelector(".project-tech")?.textContent || "";
        const haystack = `${title} ${description} ${technologies}`.toLowerCase();
        const matches = query === "" || haystack.includes(query);

        card.hidden = !matches;
        if (matches) {
            visibleCount += 1;
        }
    });

    if (projectSearchEmpty) {
        projectSearchEmpty.hidden = visibleCount > 0;
    }
}
=======
  }

  if (weatherForm) {
    weatherForm.addEventListener("submit", (event) => {
      event.preventDefault();
      getWeather();
    });
  } else {
    weatherButton?.addEventListener("click", getWeather);
  }
})();
>>>>>>> 60b8458 (Updates Added)
