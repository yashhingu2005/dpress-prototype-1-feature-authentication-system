// src/assets/mockData/mockData.js

// Learning modules data
export const learningModules = [
    {
      id: 1,
      title: "Earthquake Preparedness",
      description: "Learn how to prepare for an earthquake and what to do during and after.",
      content: `
        <h3>Before an Earthquake</h3>
        <ul>
          <li>Secure heavy furniture to walls.</li>
          <li>Create an emergency plan and practice drop, cover, and hold on.</li>
          <li>Prepare an emergency kit with water, food, and first aid supplies.</li>
        </ul>
        <h3>During an Earthquake</h3>
        <ul>
          <li>Drop to the ground.</li>
          <li>Take cover under a sturdy piece of furniture.</li>
          <li>Hold on until the shaking stops.</li>
        </ul>
        <h3>After an Earthquake</h3>
        <ul>
          <li>Check for injuries and provide first aid if necessary.</li>
          <li>Check for damage to utilities and turn them off if needed.</li>
          <li>Listen to the radio for updates and instructions.</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 1,
            question: "What should you do during an earthquake?",
            options: [
              "Run outside",
              "Drop, cover, and hold on",
              "Stand in a doorway"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which of the following is an important step in earthquake preparedness?",
            options: [
              "Secure heavy furniture to walls",
              "Keep windows open",
              "Ignore aftershocks"
            ],
            correctAnswer: 0
          }
        ]
      }
    },
    {
      id: 2,
      title: "Flood Safety",
      description: "Understand the risks of floods and how to stay safe.",
      content: `
        <h3>Before a Flood</h3>
        <ul>
          <li>Know your area's flood risk.</li>
          <li>Elevate electrical panels and utilities.</li>
          <li>Install check valves in plumbing to prevent backups.</li>
        </ul>
        <h3>During a Flood</h3>
        <ul>
          <li>Move to higher ground immediately.</li>
          <li>Do not walk or drive through flood waters.</li>
          <li>Stay tuned to emergency broadcasts.</li>
        </ul>
        <h3>After a Flood</h3>
        <ul>
          <li>Avoid floodwaters as they may be contaminated.</li>
          <li>Inspect your home for damage.</li>
          <li>Clean and disinfect everything that got wet.</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 1,
            question: "What should you do if you are driving and encounter a flooded road?",
            options: [
              "Drive through it quickly",
              "Turn around and find another route",
              "Stop and wait for the water to recede"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Why should you avoid floodwaters after a flood?",
            options: [
              "They are too cold",
              "They may be contaminated",
              "They are too deep"
            ],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 3,
      title: "Wildfire Preparedness",
      description: "Learn how to protect your home and family from wildfires.",
      content: `
        <h3>Creating Defensible Space</h3>
        <ul>
          <li>Clear vegetation and debris from around your home.</li>
          <li>Use fire-resistant building materials.</li>
          <li>Maintain a well-watered landscape during fire season.</li>
        </ul>
        <h3>Evacuation Planning</h3>
        <ul>
          <li>Have an evacuation plan with multiple routes.</li>
          <li>Prepare a "go bag" with essentials.</li>
          <li>Know your community's warning systems.</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is defensible space?",
            options: [
              "A space cleared around your home to slow the spread of wildfire",
              "A safe room inside your home",
              "An underground bunker"
            ],
            correctAnswer: 0
          }
        ]
      }
    }
  ];
  
  // User profile data
  export const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    preparednessIndex: 82,
    institutionPreparednessIndex: 75,
    badges: [
      { id: 1, name: "Earthquake Ready", icon: "🌍", earned: true },
      { id: 2, name: "First Aid Certified", icon: "🩹", earned: true },
      { id: 3, name: "Fire Safety Expert", icon: "🔥", earned: true },
      { id: 4, name: "Flood Prepared", icon: "💧", earned: false },
      { id: 5, name: "Drill Master", icon: "🏅", earned: true }
    ],
    certificates: [
      { id: 1, name: "Basic Emergency Response", date: "2024-03-15" },
      { id: 2, name: "CPR Certification", date: "2024-05-22" }
    ]
  };
  
  // Admin dashboard data
  export const adminData = {
    users: [
      { id: 1, name: "Alex Johnson", status: "safe", lastSeen: "2 minutes ago" },
      { id: 2, name: "Maria Garcia", status: "unknown", lastSeen: "10 minutes ago" },
      { id: 3, name: "James Wilson", status: "sos", lastSeen: "5 minutes ago" },
      { id: 4, name: "Sarah Chen", status: "safe", lastSeen: "1 minute ago" },
      { id: 5, name: "David Kim", status: "safe", lastSeen: "3 minutes ago" }
    ],
    alerts: [
      { id: 1, message: "Earthquake drill scheduled for tomorrow", timestamp: "2024-09-10T14:30:00" },
      { id: 2, message: "Fire safety workshop next week", timestamp: "2024-09-08T09:15:00" }
    ]
  };