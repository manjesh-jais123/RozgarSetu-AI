class TestClass {
  private buildMockLearningPath(
    topic: string,
    profile: any,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): any {
    const lang = profile.language || 'en';
    const isHindi = lang === 'hi';

    const modules = [
      {
        title: isHindi ? 'व्यवसाय के मूलभूत सिद्धांत' : 'Business Basics',
        description: isHindi
          ? `शुरुआती व्यवसाय के बुनियादी सिद्धांत सीखें। ${topic} के बारे में मूलभूत जानकारी।`
          : `Learn the fundamentals of starting a business. Introduction to ${topic}.`,
        content: isHindi
          ? `${topic} एक सफल व्यवसाय की दुनिया में आपका स्वागत है। एक व्यवसाय शुरू करने के लिए आपको समझना चाहिए कि ग्राहक क्या चाहिए।`
          : `Welcome to the world of ${topic} business. To start a business you need to understand what customers want.`,
        keyPoints: isHindi
          ? ['ग्राहक की जरूरत समझें', 'स्थानीय बाजार का अध्ययन करें', 'मूलभूत लागत गणना']
          : ['Understand customer needs', 'Study local market', 'Basic cost calculation'],
      },
      {
        title: isHindi ? 'उपकरण और उपक्रम' : 'Equipment',
        description: isHindi
          ? `${topic} के लिए आवश्यक सामान और उपकरण।`
          : `Tools and equipment needed for ${topic}.`,
        content: isHindi
          ? `शुरिशात में कम उपकरण से शुरू करें। जैसे-जैसे व्यवसाय बढ़ेगा, आप उन्नत उपकरण अपग्रेड कर सकते हैं।`
          : `Start with minimal equipment. As business grows, upgrade to advanced tools.`,
        keyPoints: isHindi
          ? ['कम से शुरुआत करें', 'गुणवत्वा पर ध्यान दें', 'रखरखाव का ध्यान रखें']
          : ['Start small', 'Focus on quality', 'Regular maintenance'],
      },
    ];

    return {
      title: topic,
      lessons: modules.map((mod: any) => ({
        title: mod.title,
        quiz: {
          questions: [
            {
              question: isHindi ? `${mod.title} के बारे में क्या सीखा?` : `What did you learn about ${mod.title}?`,
              options: isHindi
                ? ['मूल्य', 'गुणवत्वा', 'दोनों', 'कोई नहीं']
                : ['Price', 'Quality', 'Both', 'None'],
              correctAnswer: 2,
            },
          ],
          passingScore: 50,
        },
      })),
    };
  }
}
