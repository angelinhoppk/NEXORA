(() => {
  "use strict";

  const config = window.FEITIVA_SITE_CONFIG || {};
  const contact = config.contact || {};
  const formConfig = config.form || {};
  const root = document.documentElement;

  // --- Entrada do topo (uma única sequência) ---
  const startIntro = () => requestAnimationFrame(() => root.classList.add("is-loaded"));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]).then(startIntro);
  } else {
    startIntro();
  }

  // --- Ano no rodapé ---
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // --- Cabeçalho: linha divisória ao rolar ---
  const header = document.querySelector("[data-header]");
  const updateHeader = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // --- Menu mobile ---
  const menuButton = document.querySelector("[data-menu-button]");
  const menuLabel = document.querySelector("[data-menu-label]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  function openMenu() {
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
    menuButton.setAttribute("aria-expanded", "true");
    menuLabel.textContent = "Fechar menu";
    document.body.style.overflow = "hidden";
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu({ restoreFocus = false } = {}) {
    mobileMenu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuLabel.textContent = "Abrir menu";
    document.body.style.overflow = "";
    setTimeout(() => {
      if (menuButton.getAttribute("aria-expanded") === "false") mobileMenu.hidden = true;
    }, 300);
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      if (menuButton.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu({ restoreFocus: true });
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
      if (event.matches && menuButton.getAttribute("aria-expanded") === "true") closeMenu();
    });
  }

  // --- Seção atual destacada na navegação ---
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.setAttribute("aria-current", String(link.getAttribute("href") === `#${entry.target.id}`));
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
    // No topo (início) e no contato nenhum item do menu principal fica marcado
    ["#inicio", "#contato"].forEach((id) => {
      const el = document.querySelector(id);
      if (el) sectionObserver.observe(el);
    });
  }

  // --- Revelação das telas do produto ---
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Contatos reais (somente se preenchidos em config.js) ---
  const email = typeof contact.email === "string" ? contact.email.trim() : "";
  const whatsappDigits = String(contact.whatsapp || "").replace(/\D/g, "");
  const whatsappDisplay = String(contact.whatsappDisplay || "").trim() || whatsappDigits;

  const contactItems = [];
  if (email) contactItems.push({ label: "E-mail", text: email, href: `mailto:${email}` });
  if (whatsappDigits) {
    contactItems.push({ label: "WhatsApp", text: whatsappDisplay, href: `https://wa.me/${whatsappDigits}`, external: true });
  }

  function buildLink(item) {
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.text;
    if (item.external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    return a;
  }

  const directList = document.querySelector("[data-contact-direct]");
  const footerContact = document.querySelector("[data-footer-contact]");
  if (contactItems.length) {
    contactItems.forEach((item) => {
      if (directList) {
        const wrap = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = item.label;
        dd.appendChild(buildLink(item));
        wrap.append(dt, dd);
        directList.appendChild(wrap);
      }
      if (footerContact) footerContact.appendChild(buildLink(item));
    });
    if (directList) directList.hidden = false;
  }

  // --- Formulário de contato ---
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const statusEl = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector("[data-submit]");
  const projectSelect = form.querySelector("#cf-type");
  const endpointUrl = typeof formConfig.endpointUrl === "string" ? formConfig.endpointUrl.trim() : "";
  const deliveryMode = /^https:\/\//.test(endpointUrl) ? "endpoint" : email ? "email" : "none";

  // "Agendar uma apresentação" já escolhe o Feitiva Clinic no formulário
  document.querySelectorAll("[data-project-type]").forEach((link) => {
    link.addEventListener("click", () => {
      if (projectSelect) projectSelect.value = link.getAttribute("data-project-type");
    });
  });

  function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", type === "error");
    statusEl.classList.toggle("is-success", type === "success");
  }

  if (deliveryMode === "none") {
    setStatus("O envio por este formulário ainda não está ativo.");
  } else if (deliveryMode === "email") {
    submitButton.textContent = "Preparar e-mail";
  }

  const rules = {
    name: (v) => (v.length >= 2 ? "" : "Informe seu nome."),
    company: (v) => (v.length >= 2 ? "" : "Informe o nome da empresa."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Informe um e-mail válido, como nome@empresa.com.br."),
    projectType: (v) => (v ? "" : "Escolha o tipo de projeto."),
    message: (v) => (v.length >= 10 ? "" : "Descreva a necessidade em pelo menos uma frase.")
  };

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const message = rule(input.value.trim());
    const field = input.closest(".field");
    const errorEl = document.getElementById(`${input.id}-error`);
    field.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorEl ? errorEl.id : "");
    } else {
      input.removeAttribute("aria-invalid");
    }
    return !message;
  }

  const inputs = Array.from(form.querySelectorAll("input[name], select[name], textarea[name]")).filter(
    (el) => el.name in rules
  );

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value.trim()) validateField(input);
    });
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  function collectData() {
    const data = {};
    inputs.forEach((input) => {
      data[input.name] = input.value.trim();
    });
    data.website = form.querySelector("#cf-website").value;
    return data;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalid = inputs.filter((input) => !validateField(input));
    if (invalid.length) {
      invalid[0].focus();
      setStatus("Revise os campos destacados.", "error");
      return;
    }

    const data = collectData();

    if (deliveryMode === "none") {
      setStatus("O envio por este formulário ainda não está ativo.", "error");
      return;
    }

    if (deliveryMode === "email") {
      const subject = `Novo projeto: ${data.projectType} | ${data.company}`;
      const body = [
        `Nome: ${data.name}`,
        `Empresa: ${data.company}`,
        `E-mail: ${data.email}`,
        `Tipo de projeto: ${data.projectType}`,
        "",
        data.message
      ].join("\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("Abrimos o seu aplicativo de e-mail com a mensagem pronta. Falta só enviar.", "success");
      return;
    }

    submitButton.disabled = true;
    setStatus("Enviando mensagem...");

    try {
      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "site-feitiva" })
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("Mensagem enviada. Retornaremos pelo e-mail informado.", "success");
    } catch {
      setStatus(
        email
          ? `Não foi possível enviar agora. Tente novamente ou escreva para ${email}.`
          : "Não foi possível enviar agora. Tente novamente em alguns minutos.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });
})();
