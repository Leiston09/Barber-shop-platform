import { ref, type Ref } from "vue";
import { gsap } from "gsap";

/** Desktop advances by scene; touch devices retain native scrolling and momentum. */
export function useScrollAnimation(
  containerRef: Ref<HTMLElement | null>,
  sceneLayerRef: Ref<HTMLElement | null>,
) {
  const currentScene = ref(0);
  let dispose: (() => void) | undefined;

  const cleanup = () => {
    dispose?.();
    dispose = undefined;
  };

  const setupAnimation = () => {
    cleanup();
    const container = containerRef.value;
    const layer = sceneLayerRef.value;
    if (!container || !layer) return;
    const scenes = Array.from(layer.querySelectorAll<HTMLElement>("[data-scene]"));
    if (!scenes.length) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let transition: gsap.core.Timeline | undefined;
    let scrollTween: gsap.core.Tween | undefined;
    let active = -1;
    let moving = false;
    let frame = 0;
    const nativeScroll = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    let lastWheelAt = 0;
    let lastAdvanceAt = 0;
    let wheelUsed = false;
    let wheelDistance = 0;
    let wheelDirection = 0;
    let queuedDirection = 0;
    const previousStep = container.style.getPropertyValue("--home-scene-step");
    const updateStep = () => container.style.setProperty("--home-scene-step", nativeScroll.matches ? "90svh" : "100svh");
    updateStep();
    const previousInert = scenes.map(scene => scene.inert);

    const start = () => container.getBoundingClientRect().top + window.scrollY;
    const step = () => Math.max(1, (container.offsetHeight - (container.firstElementChild as HTMLElement).offsetHeight) / Math.max(1, scenes.length - 1));
    const end = () => start() + step() * (scenes.length - 1);
    const inside = () => window.scrollY >= start() - 2 && window.scrollY <= end() + 2;

    const context = gsap.context(() => {
      gsap.set(layer, { opacity: 1 });
      gsap.set(scenes, { autoAlpha: 0, yPercent: 0 });
    }, container);

    // Register event-created animations in the same context so route changes restore styles.
    context.add("showScene", (index: number, animate = true) => {
      if (index === active) return;
      const incoming = scenes[index];
      if (!incoming) return;
      const outgoing = scenes[active];
      const direction = index > active ? 1 : -1;
      transition?.kill();
      const duration = motion.matches || !animate ? 0 : nativeScroll.matches ? 0.36 : 0.4;

      scenes.forEach((scene, i) => {
        scene.inert = i !== index;
        if (i !== index && scene !== outgoing) gsap.set(scene, { autoAlpha: 0, yPercent: 0 });
      });
      const marked = incoming.querySelectorAll<HTMLElement>("[data-anim]");
      gsap.set(incoming, { zIndex: 2, autoAlpha: 0, yPercent: direction * (duration ? 5 : 0) });
      if (outgoing) gsap.set(outgoing, { zIndex: 1 });
      transition = gsap.timeline({ defaults: { duration, ease: "power3.out" } });
      if (outgoing) transition.to(outgoing, { autoAlpha: 0, yPercent: -direction * 3, duration: duration * 0.75 }, 0);
      transition.to(incoming, { autoAlpha: 1, yPercent: 0 }, 0);
      if (!duration) gsap.set(marked, { clearProps: "transform,opacity" });
      if (marked.length && duration) {
        // Move the scene as a whole; child transforms would briefly overflow its scroll area.
        transition.fromTo(marked, { opacity: 0 }, {
          opacity: 1, duration: duration * 0.8,
          stagger: { amount: duration * 0.12 }, clearProps: "transform,opacity",
        }, duration * 0.08);
      }
      active = index;
      currentScene.value = index;
    });

    const showScene = (index: number, animate = true) => context.showScene(index, animate);
    const sync = () => {
      frame = 0;
      if (!moving) showScene(Math.max(0, Math.min(scenes.length - 1, Math.round((window.scrollY - start()) / step()))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    const advance = (direction: number) => {
      if (moving || !inside()) return false;
      const next = active + direction;
      if (next < 0 || next >= scenes.length) return false;
      moving = true;
      showScene(next);
      const position = { y: window.scrollY };
      scrollTween = gsap.to(position, {
        y: start() + next * step(),
        duration: motion.matches ? 0 : 0.4,
        ease: "power2.out",
        onUpdate: () => window.scrollTo({ top: position.y, behavior: "instant" }),
        onComplete: () => {
          moving = false;
          const queued = queuedDirection;
          queuedDirection = 0;
          if (queued) advance(queued);
        },
      });
      return true;
    };

    const nestedCanScroll = (target: EventTarget | null, direction: number) => {
      let element = target instanceof Element ? target : null;
      while (element && element !== container) {
        if (element instanceof HTMLElement && /auto|scroll/.test(getComputedStyle(element).overflowY) &&
          element.scrollHeight > element.clientHeight + 1 &&
          (direction > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 1)) return true;
        element = element.parentElement;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (nativeScroll.matches || event.defaultPrevented || event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || !inside()) return;
      const direction = Math.sign(event.deltaY);
      if (nestedCanScroll(event.target, direction)) return;
      const now = performance.now();
      const newGesture = now - lastWheelAt > 140 || direction !== wheelDirection;
      lastWheelAt = now;
      wheelDirection = direction;
      if (newGesture) { wheelUsed = false; wheelDistance = 0; }
      // At either boundary the document continues naturally to the next section.
      if (!moving && ((active === 0 && direction < 0) ||
        (active === scenes.length - 1 && direction > 0))) return;
      event.preventDefault();
      if (wheelUsed) return;
      wheelDistance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(wheelDistance) < 10) return;
      wheelUsed = true;
      if (moving) {
        // Keep the next deliberate gesture instead of dropping it during the transition.
        if (newGesture && now - lastAdvanceAt >= 140) queuedDirection = direction;
      } else {
        lastAdvanceAt = now;
        advance(direction);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !inside()) return;
      if (event.target instanceof Element && event.target.closest("input,textarea,select,button,a,[contenteditable=true],[role=dialog]")) return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1)
        : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (!direction) return;
      if (nestedCanScroll(event.target, direction) || nativeScroll.matches) return;
      if (moving) { queuedDirection = direction; event.preventDefault(); }
      else if (advance(direction)) event.preventDefault();
    };
    const onResize = () => {
      scrollTween?.kill();
      moving = false;
      queuedDirection = 0;
      updateStep();
      onScroll();
    };

    nativeScroll.addEventListener("change", onResize);
    sync();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    dispose = () => {
      nativeScroll.removeEventListener("change", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (previousStep) container.style.setProperty("--home-scene-step", previousStep);
      else container.style.removeProperty("--home-scene-step");
      cancelAnimationFrame(frame);
      scrollTween?.kill();
      transition?.kill();
      context.revert();
      scenes.forEach((scene, i) => { scene.inert = previousInert[i] ?? false; });
    };
  };

  return { currentScene, setupAnimation, cleanup };
}
