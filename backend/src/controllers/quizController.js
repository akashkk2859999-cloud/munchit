export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    
    // answers is expected to be an array of objects or an object of { q1: 'A', q2: 'B', ... }
    if (!answers) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    // Since there are 7 questions, let's assume we get an object mapping Q# to Answer
    // Example: { 1: 'A', 2: 'C', ... }
    
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (const key in answers) {
      const answer = answers[key];
      if (counts[answer] !== undefined) {
        counts[answer]++;
      }
    }

    // Find primary and secondary personalities
    let sortedKeys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    
    const primary = sortedKeys[0];
    const secondary = sortedKeys[1]; // might be a tie, but we'll take the first two
    
    // Map options to personalities
    const personalities = {
      A: 'Cheesy Stix',
      B: 'Sweet Surprise',
      C: 'Sour Cream & Onion',
      D: 'Creamy Crunch',
      E: 'Hot Chilli'
    };

    res.json({
      primaryPersonality: personalities[primary],
      secondaryPersonality: counts[secondary] > 0 ? personalities[secondary] : null,
      primaryKey: primary,
      secondaryKey: counts[secondary] > 0 ? secondary : null
    });
  } catch (error) {
    next(error);
  }
};
