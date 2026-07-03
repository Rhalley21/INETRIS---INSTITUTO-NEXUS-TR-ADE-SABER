/* =========================================================================
   INETRIS — Interações do site público
   Apenas interações simples de front-end (menu, scroll, animações,
   contadores). Nenhuma chamada a banco de dados ou API nesta etapa.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Ano automático no rodapé ---------- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.classList.toggle("is-active", isOpen);
    });

    // Fecha o menu ao clicar em um link (útil no mobile)
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header com sombra ao rolar a página ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 12) {
      header.style.boxShadow = "0 12px 30px -18px rgba(0,0,0,0.5)";
    } else {
      header.style.boxShadow = "none";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animação de revelar elementos ao rolar (.reveal) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: navegadores sem suporte simplesmente mostram tudo
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Contadores animados na seção de Resultados ---------- */
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && statNumbers.length) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
  } else {
    statNumbers.forEach((el) => (el.textContent = el.dataset.count));
  }

});

/* =========================================================================
   PREPARADO PARA MÓDULOS FUTUROS
   Quando o CRM, o sistema de RH, o login e a galeria completa forem
   desenvolvidos, este arquivo pode ser dividido em módulos menores
   (ex.: js/crm.js, js/auth.js) sem afetar as interações acima.
   ========================================================================= */
