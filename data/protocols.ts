export interface Protocol {
  id: string;
  category: 'focus' | 'boredom' | 'breathing' | 'walk' | 'cognitive';
  name: string;
  description: string;
  instructions: string;
  duration: number; // minutes
  iconName: string; // MaterialCommunityIcons name
  brainBenefit?: string;
}

// === FOCUS PROTOCOLS ===
export const focusProtocols: Protocol[] = [
  {
    id: 'visual-focus',
    category: 'focus',
    name: 'Visual Focus Drill',
    description: 'Stare at a single point to activate your prefrontal cortex',
    instructions:
      'Pick a point on the wall at eye level. Stare at it without moving your eyes. When your gaze drifts, gently bring it back. This activates the neural circuits for sustained attention.',
    duration: 5,
    iconName: 'eye-outline',
  },
  {
    id: 'deep-work',
    category: 'focus',
    name: 'Deep Work Session',
    description: 'Sustained focus on a single task without distractions',
    instructions:
      'Choose one task before starting. Put your phone face-down. Work on only that task until the timer ends. If your mind wanders, notice it and return to the task.',
    duration: 15,
    iconName: 'brain',
  },
  {
    id: 'ultradian',
    category: 'focus',
    name: '90-Min Ultradian Cycle',
    description: 'Your brain\'s natural focus rhythm — the ultimate goal',
    instructions:
      'Your brain cycles through 90-minute ultradian rhythms. This is the gold standard of deep focus. Start your task and stay locked in for the full cycle. Take a real break after.',
    duration: 90,
    iconName: 'lightning-bolt-outline',
  },
];

// === BREATHING PROTOCOLS ===
export const breathingProtocols: Protocol[] = [
  {
    id: 'physiological-sigh',
    category: 'breathing',
    name: 'Physiological Sigh',
    description: 'Double inhale + long exhale — fastest way to calm down',
    instructions:
      'Inhale through your nose. Before exhaling, take a second sharp inhale to fully inflate your lungs. Then slowly exhale through your mouth for twice as long. Repeat 3-5 times.',
    duration: 2,
    iconName: 'weather-windy',
  },
  {
    id: 'box-breathing',
    category: 'breathing',
    name: 'Box Breathing',
    description: 'Navy SEAL technique for calm under pressure',
    instructions:
      'Inhale for 4 seconds. Hold for 4 seconds. Exhale for 4 seconds. Hold for 4 seconds. Repeat. This balances your autonomic nervous system.',
    duration: 5,
    iconName: 'square-outline',
  },
  {
    id: 'cyclic-hyperventilation',
    category: 'breathing',
    name: 'Cyclic Hyperventilation',
    description: 'Controlled adrenaline release for alertness',
    instructions:
      'Take 25 deep, rapid breaths (in through nose, out through mouth). After the last exhale, hold your breath for 15-30 seconds. Repeat 3 rounds. This increases adrenaline and alertness.',
    duration: 10,
    iconName: 'fire',
  },
];

// === WALKING MEDITATIONS ===
export const walkingMeditations: Protocol[] = [
  {
    id: 'mindful-walk',
    category: 'walk',
    name: 'Mindful Walk',
    description: 'Notice your body, breath, and surroundings',
    instructions:
      'Walk at a natural pace. Focus on the sensation of your feet hitting the ground. Notice the air on your skin. When your mind wanders, return to physical sensations.',
    duration: 10,
    iconName: 'walk',
  },
  {
    id: 'optic-flow-walk',
    category: 'walk',
    name: 'Optic Flow Walk',
    description: 'Forward movement activates calm — a Huberman protocol',
    instructions:
      'Walk forward and let your gaze soften — don\'t focus on any one thing. Let the world flow past you. This panoramic vision triggers parasympathetic calm while the forward motion processes stress.',
    duration: 15,
    iconName: 'eye-settings-outline',
  },
  {
    id: 'gratitude-walk',
    category: 'walk',
    name: 'Gratitude Walk',
    description: 'Pair movement with positive reflection',
    instructions:
      'As you walk, think of three things you\'re grateful for. Spend a few minutes on each one, really feeling the gratitude. Movement plus gratitude is one of the most effective mood boosters.',
    duration: 20,
    iconName: 'heart-outline',
  },
];

// === COGNITIVE WORKOUTS ===
export const cognitiveWorkouts: Protocol[] = [
  {
    id: 'zone2-cardio',
    category: 'cognitive',
    name: 'Zone 2 Cardio',
    description: 'Low-intensity steady state for 20-30 minutes',
    instructions:
      'Walk briskly, jog slowly, or bike at a pace where you can still hold a conversation. This is Zone 2 — you should be able to talk but not sing. Aim for 150-200 min per week.',
    duration: 30,
    iconName: 'run',
    brainBenefit: 'Increases BDNF (brain-derived neurotrophic factor) — literally grows new neurons',
  },
  {
    id: 'resistance-training',
    category: 'cognitive',
    name: 'Resistance Training',
    description: 'Strength work that boosts executive function',
    instructions:
      'Do any form of resistance training: bodyweight exercises, weights, or bands. Focus on compound movements (squats, pushups, rows). Even 20 minutes has cognitive benefits.',
    duration: 30,
    iconName: 'dumbbell',
    brainBenefit: 'Boosts executive function and working memory via IGF-1 and lactate',
  },
  {
    id: 'cold-exposure',
    category: 'cognitive',
    name: 'Deliberate Cold Exposure',
    description: 'Cold showers or ice baths for dopamine and focus',
    instructions:
      'End your shower with 1-3 minutes of cold water (as cold as you can tolerate). Or: fill a tub with cold water and ice. The discomfort is the point — it builds mental resilience and releases dopamine.',
    duration: 3,
    iconName: 'snowflake',
    brainBenefit: 'Increases dopamine by 250-300% for hours — better than any focus supplement',
  },
  {
    id: 'nsdr',
    category: 'cognitive',
    name: 'NSDR (Non-Sleep Deep Rest)',
    description: 'Yoga Nidra-style body scan for recovery',
    instructions:
      'Lie down. Close your eyes. Systematically relax each body part from toes to head. Follow along with a guided NSDR recording if available. This restores mental energy without sleep.',
    duration: 20,
    iconName: 'power-sleep',
    brainBenefit: 'Restores dopamine levels in the basal ganglia — resets your focus capacity',
  },
];
