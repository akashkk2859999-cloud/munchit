export const questions = [
  {
    id: 1,
    text: "How do you know someone's really your type of person?",
    options: [
      { id: 'A', text: "Conversation flows and suddenly it's 3 hours later." },
      { id: 'B', text: "Silence feels easy. There's no pressure, no performance." },
      { id: 'C', text: "They can take your honesty and give it right back." },
      { id: 'D', text: "They see through you and stay anyway." },
      { id: 'E', text: "They make life feel bigger, lighter, more alive." }
    ]
  },
  {
    id: 2,
    text: "Someone you like leaves you on read for 2 days. You...",
    options: [
      { id: 'A', text: "Send a smooth follow-up. Casual, but effective." },
      { id: 'B', text: "Worry if they're okay... then overthink everything." },
      { id: 'C', text: "Leave them on read when they finally reply. No explanation." },
      { id: 'D', text: "Clock it, wait, then decide your next move." },
      { id: 'E', text: "Send one message that makes it impossible for them to ignore you. Then actually move on." }
    ]
  },
  {
    id: 3,
    text: "You're broke and your friends have expensive plans this weekend. You...",
    options: [
      { id: 'A', text: "Suggest something cheaper that somehow feels better." },
      { id: 'B', text: "Tell one friend the truth and figure it out together." },
      { id: 'C', text: "Say no. No long story." },
      { id: 'D', text: "Pull out the backup plan you already thought of." },
      { id: 'E', text: "Go anyway. The money situation will sort itself. It always does." }
    ]
  },
  {
    id: 4,
    text: "A close friend does something that upsets you. You...",
    options: [
      { id: 'A', text: "Bring it up casually but make the point land." },
      { id: 'B', text: "Hear their side before reacting." },
      { id: 'C', text: "Say it. Exactly as it is. They'll be fine." },
      { id: 'D', text: "Process it first, then speak clearly." },
      { id: 'E', text: "Address it on the spot. You don't do unresolved tension." }
    ]
  },
  {
    id: 5,
    text: "Someone you're dating is posting 'single life' content. You...",
    options: [
      { id: 'A', text: "Bring it up so smoothly they walk themselves into the truth." },
      { id: 'B', text: "Feel and sit with it for a while. Then bring it up gently because you'd rather know than assume." },
      { id: 'C', text: "Screenshot it. Confront them. Clarify things." },
      { id: 'D', text: "You noticed it two weeks ago. You've been watching. Now you have enough." },
      { id: 'E', text: "Raise it instantly. You don't sit on weird vibes." }
    ]
  },
  {
    id: 6,
    text: "You fail at something you worked hard for. What's your first response?",
    options: [
      { id: 'A', text: "Find the lesson in it and maybe the story." },
      { id: 'B', text: "Feel it properly, lean on your people, reset." },
      { id: 'C', text: "Identify exactly what went wrong. No self-pity. Just the diagnosis." },
      { id: 'D', text: "Plan B was ready. You execute it. You'll handle the feelings later." },
      { id: 'E', text: "Get up. Be active. Sitting and wallowing with it is not an option." }
    ]
  },
  {
    id: 7,
    text: "Someone posts something shady that's clearly about you. You...",
    options: [
      { id: 'A', text: "Post something so unbothered and so good that everyone forgets what they even said." },
      { id: 'B', text: "DM them. Not to fight because you'd rather fix it than win the internet." },
      { id: 'C', text: "Post your response. Publicly and calmly. With receipts if necessary." },
      { id: 'D', text: "Say absolutely nothing. Let them wonder if you even saw it." },
      { id: 'E', text: "Address it directly. On their post. In the comments. Right now." }
    ]
  }
];

export const personalities = {
  A: {
    id: 'A',
    name: "Cheesy Stix",
    color: "bg-munchit-blue",
    textColor: "text-munchit-blue",
    archetype: "The Smooth Operator",
    energy: "Charismatic. Playful. Confident.",
    description: "Sharp. Charming. Effortlessly magnetic. You don't force moments, you own them. You read people, timing, and energy like second nature, and somehow always know exactly what to say. Your confidence doesn't beg for attention. It pulls it. You're calm, clever, and impossible to ignore."
  },
  B: {
    id: 'B',
    name: "Sweet Surprise",
    color: "bg-munchit-pink",
    textColor: "text-munchit-pink",
    archetype: "The Magnetic Charmer",
    energy: "Friendly. Warm. Relatable.",
    description: "Soft-hearted. Easy to love. Weirdly unforgettable. You don't chase attention people just gravitate toward you. There's something in your energy that feels safe, warm, and instantly familiar. You love deeply, show up fully, and leave an impact people remember long after you've gone."
  },
  C: {
    id: 'C',
    name: "Sour Cream & Onion",
    color: "bg-munchit-green",
    textColor: "text-munchit-green",
    archetype: "The Sassy Truth Teller",
    energy: "Sharp. Bold. Unfiltered.",
    description: "Bold. Blunt. Impossible to forget. You say what everyone else is thinking and somehow make honesty feel refreshing. You don't shrink, sugarcoat, or perform. What people see is exactly what they get. Some people get you instantly. Others take time. Either way? You leave a mark."
  },
  D: {
    id: 'D',
    name: "Creamy Crunch",
    color: "bg-munchit-purple",
    textColor: "text-munchit-purple",
    archetype: "The Luxury Minimalist",
    energy: "Refined. Elevated. Premium.",
    description: "Calm. Intentional. Quietly powerful. You don't need to be loud to stand out. While everyone else is reacting, you're already thinking three steps ahead. You make composure look effortless even when it isn't. You care deeply, just selectively. Your calm isn't distance, it's depth."
  },
  E: {
    id: 'E',
    name: "Hot Chilli",
    color: "bg-munchit-spicy",
    textColor: "text-munchit-spicy",
    archetype: "The Bold Instigator",
    energy: "Daring. Provocative. Fearless.",
    description: "Bold. Fearless. Fully alive. You don't wait for moments, you make them. Your energy shifts every room you enter, and people feel it before you even speak. You move fast, trust your gut, and dive in while everyone else is still hesitating. It's not recklessness, it's confidence."
  }
};
