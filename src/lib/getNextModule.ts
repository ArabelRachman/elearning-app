import { Subtopic } from '@/hooks/useSubtopics';
import { Module }   from '@/hooks/useModules';

/**
 * Return the very next lesson after the current one or `null`
 * if the user is already at the last lesson in the course.
 *
 * The function is 100 % defensive:
 * – empty / undefined arrays  →  treated as “nothing to do yet”
 * – sub‑topics with no lessons →  skipped
 */
export function getNextModule(
  allSubs: Subtopic[] | undefined,
  currentModules: Module[] | undefined,
  currentSubId: string,
  currentModId: string,
): (Module & { subtopicId: string }) | null {
  /* Guard against async data that hasn’t arrived yet */
  if (!allSubs?.length || !currentModules?.length) return null;

  /* Same‑sub‑topic search */
  const idx = currentModules.findIndex(m => m.id === currentModId);
  if (idx >= 0 && idx + 1 < currentModules.length) {
    return { ...currentModules[idx + 1], subtopicId: currentSubId };
  }

  /* Cross‑sub‑topic search */
  const startPos = allSubs.findIndex(s => s.id === currentSubId) + 1;
  for (let i = startPos; i < allSubs.length; i += 1) {
    const sub = allSubs[i];
    if (!sub.moduleCount) continue;         // skip empty sub‑topics
    if (sub.firstModule) {
      return { ...sub.firstModule, subtopicId: sub.id };
    }
  }
  return null;                              // no more lessons
}
