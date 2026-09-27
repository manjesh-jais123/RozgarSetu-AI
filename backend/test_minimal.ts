const isHindi = true;
const topic = "test";
const modules = [
  {
    title: isHindi ? 'व्यवसाय' : 'Business',
    description: isHindi
      ? `शुरुआती व्यवसाय ${topic} के बारे में`
      : `Learn ${topic}.`,
    content: isHindi
      ? `${topic} एक सफल व्यवसाय`
      : `Welcome to ${topic} business.`,
    keyPoints: isHindi
      ? ['कम से शुरुआत करें', 'गुणवत्ता']
      : ['Start small', 'Quality'],
  },
];
