export function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Fetch existing script element by src
    // It may have been added by another intance of this hook
    let script = document.querySelector(`script[src="${src}"]`);

    if (!script) {
      // Create script
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      // Add script to document bodyt
      document.body.appendChild(script);

      script.addEventListener("load", resolve);
      script.addEventListener("error", reject);
    } else {
      resolve();
    }
  });
}
