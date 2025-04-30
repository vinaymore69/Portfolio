window.addEventListener('DOMContentLoaded', () => {
    barba.init({
      sync: true,
      transitions: [
        {
          name: 'fade',
          async leave({ current }) {
            await gsap.to(current.container, { opacity: 0, duration: 0.5 });
          },
          async enter({ next }) {
            gsap.set(next.container, { opacity: 0 });
            await gsap.to(next.container, { opacity: 1, duration: 0.5 });
          }
        }
      ]
    });
  });
  