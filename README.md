# Hablamos Salud · sitio web

Sitio estático de **Hablamos Salud** (una marca de MaJerie S.R.L.): página única con HTML, CSS y JavaScript, animaciones con GSAP (ScrollTrigger, SplitText) y desplazamiento suave con Lenis. No necesita compilación.

```
index.html             página completa
assets/css/styles.css  estilos
assets/js/main.js      interacciones y animaciones
assets/img/            logos, isotipo e íconos
assets/vendor/         GSAP y Lenis (copias locales)
vercel.json            cabeceras (noindex) y URLs limpias
```

## Verlo en local

```bash
npx http-server -p 8080 .
# abrir http://localhost:8080
```

## Publicar en Vercel

El proyecto de Vercel es `hablamos-salud`. Al no tener paso de compilación, se publica tal cual desde la raíz del repositorio (`vercel deploy --prod`, o conectando este repositorio al proyecto en Vercel → Settings → Git).

Correo de contacto del sitio: **salud@majerie.com** (definido en `index.html` y en la constante `EMAIL` de `assets/js/main.js`).
