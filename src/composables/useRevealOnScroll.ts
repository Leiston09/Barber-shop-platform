import { onMounted, onBeforeUnmount, type Ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** Selector de los elementos a animar (por defecto: [data-anim]) */
  selector?: string;
  /** Duración de cada elemento en segundos (por defecto: 0.9) */
  duration?: number;
  /** Tiempo entre elementos en segundos (por defecto: 0.12) */
  stagger?: number;
  /** Cuánto sube cada elemento en px (por defecto: 60) */
  y?: number;
  /** Cuánto se desplaza cada elemento en X (negativo = desde la izquierda, positivo = desde la derecha) */
  x?: number;
  /** Cuánto zoom hace al aparecer (1 = sin zoom, 1.25 = arranca 25% más grande) */
  scale?: number;
  /** Cuándo arranca (por defecto: "top 80%") */
  start?: string;
  /** Ease de GSAP (por defecto: "power3.out") */
  ease?: string;
  /** toggleActions de ScrollTrigger (por defecto: "play none none none") */
  toggleActions?: string;
}

export function useRevealOnScroll(
  containerRef: Ref<HTMLElement | null>,
  options: RevealOptions = {},
) {
  const {
    selector = "[data-anim]",
    duration = 0.9,
    stagger = 0.12,
    y = 60,
    x = 0,
    scale = 1,
    start = "top 80%",
    ease = "power3.out",
    toggleActions = "play none none none",
  } = options;

  let ctx: gsap.Context | null = null;

  onMounted(() => {
    if (!containerRef.value) return;

    ctx = gsap.context(() => {
      const targets =
        containerRef.value!.querySelectorAll<HTMLElement>(selector);

      if (!targets.length) return;

      // Estado inicial
      const initialProps: gsap.TweenVars = { opacity: 0 };
      const finalProps: gsap.TweenVars = { opacity: 1 };

      if (y !== 0) {
        initialProps.y = y;
        finalProps.y = 0;
      }

      if (x !== 0) {
        initialProps.x = x;
        finalProps.x = 0;
      }

      if (scale !== 1) {
        initialProps.scale = scale;
        finalProps.scale = 1;
      }

      gsap.set(targets, initialProps);

      gsap.to(targets, {
        ...finalProps,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: containerRef.value,
          start,
          toggleActions,
        },
      });
    }, containerRef.value);
  });

  onBeforeUnmount(() => {
    ctx?.revert();
  });
}