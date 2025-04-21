import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

function Main() {
  useEffect(() => {
    // Código de la plantilla BootstrapMade (modificado para ejecutarse después de que el DOM esté listo)
    
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
    
    mobileNavToggleBtn?.addEventListener('click', mobileNavToogle);
    
    window.addEventListener("load", () => {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader?.classList.contains('scroll-up-sticky') && 
          !selectHeader?.classList.contains('sticky-top') && 
          !selectHeader?.classList.contains('fixed-top')) return;
      
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    });

    const scrollTop = document.querySelector('.scroll-top');
    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }
    scrollTop?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

  }, []); // El useEffect asegura que este código solo se ejecute una vez, después de que el DOM se haya cargado.

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);
