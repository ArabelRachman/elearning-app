import { Subtopic } from '@/hooks/useSubtopics';
import { Module }   from '@/hooks/useModules';


export function getNextModule(
  allSubs: Subtopic[],
  currentModules: Module[],
  currentSubId: string,
  currentModId: string,
): (Module & { subtopicId: string }) | null {

  const idx = currentModules.findIndex(m => m.id === currentModId);
  if (idx >= 0 && idx + 1 < currentModules.length) {
    const next = currentModules[idx + 1];
    return { ...next, subtopicId: currentSubId };
  }

  const startPos = allSubs.findIndex(s => s.id === currentSubId) + 1;
  for (let i = startPos; i < allSubs.length; i += 1) {
    const sub = allSubs[i];


    if (!sub.moduleCount || sub.moduleCount === 0) continue;

    const firstMod = sub.firstModule;  
    if (firstMod) {
      return { ...firstMod, subtopicId: sub.id };
    }
  }

  return null;
}
