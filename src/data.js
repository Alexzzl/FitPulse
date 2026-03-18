const assets = "./assets/CodeBuddyAssets";

export const appData = {
  assets,
  user: {
    bmi: "22.9",
    calories: "1,240",
    goal: "Weight Loss",
    height: "175 cm",
    name: "corn",
    totalCalories: "12,450",
    weight: "70 kg",
    workoutDays: "24",
  },
  home: {
    recommended: [
      {
        id: "morning-yoga",
        image: `${assets}/41_1515/28.png`,
        metric: "20 MIN",
        subtitle: "Relax & Stretch",
        title: "Morning Yoga",
      },
      {
        id: "hiit-burn",
        image: `${assets}/41_1515/29.png`,
        metric: "150 KCAL",
        subtitle: "High Intensity",
        title: "HIIT Burn",
      },
      {
        id: "core-blast",
        image: `${assets}/41_1515/30.png`,
        metric: "10 MIN",
        subtitle: "Abs Focus",
        title: "Core Blast",
      },
    ],
    resume: {
      image: `${assets}/41_1515/27.png`,
      label: "Resume",
      timeLeft: "15 min left",
      title: "Full Body Power",
    },
    weeklyActivity: [120, 245, 180, 300, 150, 320, 160],
  },
  history: [
    { calories: "159", day: "Today", title: "Full Body Blast" },
    { calories: "230", day: "Yesterday", title: "HIIT Cardio" },
    { calories: "188", day: "Mar 14", title: "Upper Body Strength" },
  ],
  library: {
    bodyParts: ["Arm", "Back", "Butt & Leg", "Chest", "Fullbody", "Shoulder"],
    picks: [
      { id: "workout-1", image: `${assets}/41_1708/12.png`, metric: "120 KCAL", title: "Workout 1" },
      { id: "workout-2", image: `${assets}/41_1708/13.png`, metric: "140 KCAL", title: "Workout 2" },
      { id: "workout-3", image: `${assets}/41_1708/14.png`, metric: "160 KCAL", title: "Workout 3" },
      { id: "workout-4", image: `${assets}/41_1708/15.png`, metric: "180 KCAL", title: "Workout 4" },
    ],
  },
  onboarding: {
    heroImage: `${assets}/41_1440/109.png`,
  },
  plans: {
    classic: [
      {
        id: "abs-of-steel",
        image: `${assets}/41_1855/9.png`,
        subtitle: "Beginner • No Equipment",
        tag: "30 DAY PLAN",
        title: "ABS OF STEEL",
      },
      {
        id: "total-shred",
        image: `${assets}/41_1855/10.png`,
        subtitle: "Strength • Home Friendly",
        tag: "30 DAY PLAN",
        title: "TOTAL SHRED",
      },
      {
        id: "morning-flow",
        image: `${assets}/41_1855/11.png`,
        subtitle: "Mobility • Flexibility",
        tag: "30 DAY PLAN",
        title: "MORNING FLOW",
      },
    ],
    dayDetail: {
      description:
        "Today we focus on the upper abs. Keep your core tight and movement controlled.",
      exercises: 8,
      image: `${assets}/41_1855/10.png`,
      time: "15:00",
      title: "CRUNCH TIME",
    },
  },
  workout: {
    exercises: [
      { image: `${assets}/41_2474/2.png`, metric: "00:24", name: "JUMPING JACKS", next: "Push Ups" },
      { image: `${assets}/41_1855/10.png`, metric: "x15", name: "PUSH UPS", next: "Squats" },
      { image: `${assets}/41_1855/11.png`, metric: "x20", name: "SQUATS", next: "Plank" },
      { image: `${assets}/41_1855/12.png`, metric: "01:00", name: "PLANK", next: "Finish" },
    ],
  },
};
